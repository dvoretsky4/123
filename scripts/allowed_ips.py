#!/usr/bin/env python3
"""
Вычисляет строку AllowedIPs для WireGuard/AmneziaWG вида
«весь IPv4-интернет МИНУС российские подсети (и приватные диапазоны)».

Результат: всё идёт через VPN, кроме RU и локальных сетей.

Зависимостей нет — только стандартная библиотека (модуль ipaddress).
"""

import argparse
import ipaddress
import sys
import urllib.request

# Источники списка российских подсетей (GeoIP = RU).
DEFAULT_URLS = [
    "https://www.ipdeny.com/ipblocks/data/aggregated/ru-aggregated.zone",
    "https://www.ipdeny.com/ipblocks/data/countries/ru.zone",
]

# Приватные / служебные диапазоны — их тоже исключаем, чтобы локальная сеть,
# LAN и служебный трафик шли напрямую, а не в туннель.
BOGON_NETS = [
    "0.0.0.0/8",
    "10.0.0.0/8",
    "100.64.0.0/10",
    "127.0.0.0/8",
    "169.254.0.0/16",
    "172.16.0.0/12",
    "192.0.0.0/24",
    "192.0.2.0/24",
    "192.168.0.0/16",
    "198.18.0.0/15",
    "198.51.100.0/24",
    "203.0.113.0/24",
    "224.0.0.0/4",
    "240.0.0.0/4",
    "255.255.255.255/32",
]

MAX_V4 = 2 ** 32 - 1


def fetch_ru_networks(url=None, ru_file=None):
    """Загружает список RU-подсетей из файла или по URL."""
    text = None
    if ru_file:
        with open(ru_file, "r", encoding="utf-8") as fh:
            text = fh.read()
    else:
        urls = [url] if url else DEFAULT_URLS
        last_err = None
        for u in urls:
            try:
                with urllib.request.urlopen(u, timeout=30) as resp:
                    text = resp.read().decode("utf-8", "replace")
                sys.stderr.write("RU-список загружен: %s\n" % u)
                break
            except Exception as exc:  # noqa: BLE001
                last_err = exc
                sys.stderr.write("Не удалось загрузить %s: %s\n" % (u, exc))
        if text is None:
            raise SystemExit(
                "Ошибка: не удалось загрузить RU-список. "
                "Передай локальный файл через --ru-file или свой URL через --url.\n"
                "Последняя ошибка: %s" % last_err
            )

    nets = []
    for line in text.splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        try:
            nets.append(ipaddress.ip_network(line, strict=False))
        except ValueError:
            continue
    # Оставляем только IPv4 (AmneziaWG-конфиги здесь про IPv4).
    nets = [n for n in nets if n.version == 4]
    if not nets:
        raise SystemExit("Ошибка: в списке не найдено ни одной корректной IPv4-подсети.")
    return nets


def compute_complement(excluded):
    """Возвращает список IPv4-подсетей = 0.0.0.0/0 минус excluded."""
    excluded = list(ipaddress.collapse_addresses(excluded))
    excluded.sort(key=lambda n: int(n.network_address))

    result = []
    cursor = 0  # следующий ещё не покрытый адрес (как int)
    for net in excluded:
        start = int(net.network_address)
        end = int(net.broadcast_address)
        if start > cursor:
            result.extend(
                ipaddress.summarize_address_range(
                    ipaddress.IPv4Address(cursor),
                    ipaddress.IPv4Address(start - 1),
                )
            )
        cursor = max(cursor, end + 1)
    if cursor <= MAX_V4:
        result.extend(
            ipaddress.summarize_address_range(
                ipaddress.IPv4Address(cursor),
                ipaddress.IPv4Address(MAX_V4),
            )
        )
    return result


def main():
    ap = argparse.ArgumentParser(description=__doc__)
    ap.add_argument("--url", help="URL списка RU-подсетей (переопределяет источник по умолчанию)")
    ap.add_argument("--ru-file", help="Локальный файл со списком RU-подсетей (по одной CIDR в строке)")
    ap.add_argument("--out", help="Файл для записи результата (по умолчанию — stdout)")
    ap.add_argument(
        "--values-only",
        action="store_true",
        help="Выводить только список CIDR через запятую, без префикса 'AllowedIPs ='",
    )
    ap.add_argument(
        "--keep-private",
        action="store_true",
        help="НЕ исключать приватные/служебные диапазоны (по умолчанию они исключаются)",
    )
    args = ap.parse_args()

    ru = fetch_ru_networks(url=args.url, ru_file=args.ru_file)
    excluded = list(ru)
    if not args.keep_private:
        excluded += [ipaddress.ip_network(b) for b in BOGON_NETS]

    complement = compute_complement(excluded)
    value = ", ".join(str(n) for n in complement)
    line = value if args.values_only else ("AllowedIPs = " + value)

    sys.stderr.write(
        "Исключено подсетей (после collapse): RU+служебные. "
        "Итоговых CIDR в AllowedIPs: %d\n" % len(complement)
    )

    if args.out:
        with open(args.out, "w", encoding="utf-8") as fh:
            fh.write(line + "\n")
        sys.stderr.write("Записано в %s\n" % args.out)
    else:
        print(line)


if __name__ == "__main__":
    main()
