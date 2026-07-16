#!/usr/bin/env bash
#
# Обёртка над allowed_ips.py: генерирует строку AllowedIPs
# «весь интернет минус RU» и сохраняет в файл.
#
# Примеры:
#   bash scripts/generate_allowed_ips.sh --out /tmp/allowed_ips.txt
#   bash scripts/generate_allowed_ips.sh --ru-file /tmp/ru.zone --out /tmp/allowed_ips.txt
#
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
OUT=""
EXTRA=()

while [[ $# -gt 0 ]]; do
  case "$1" in
    --out)      OUT="$2"; shift 2 ;;
    --ru-file)  EXTRA+=(--ru-file "$2"); shift 2 ;;
    --url)      EXTRA+=(--url "$2"); shift 2 ;;
    --keep-private) EXTRA+=(--keep-private); shift ;;
    -h|--help)
      echo "Usage: $0 [--out FILE] [--ru-file FILE] [--url URL] [--keep-private]"
      exit 0 ;;
    *) echo "Неизвестный аргумент: $1" >&2; exit 1 ;;
  esac
done

if ! command -v python3 >/dev/null 2>&1; then
  echo "Ошибка: требуется python3." >&2
  exit 1
fi

if [[ -z "$OUT" ]]; then
  OUT="/tmp/allowed_ips.txt"
fi

python3 "$HERE/allowed_ips.py" --out "$OUT" "${EXTRA[@]}"

echo "Готово. Строка AllowedIPs сохранена в: $OUT" >&2
echo "Предпросмотр (первые 200 символов):" >&2
head -c 200 "$OUT" >&2
echo " ..." >&2
