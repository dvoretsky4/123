#!/usr/bin/env bash
#
# Применяет сгенерированный AllowedIPs к КЛИЕНТСКИМ конфигам AmneziaWG.
#
# Безопасность:
#   - меняется ТОЛЬКО строка AllowedIPs, ключи и прочее не трогаются;
#   - перед каждой правкой создаётся бэкап *.conf.bak-YYYYMMDD-HHMMSS;
#   - обрабатываются только клиентские конфиги (есть строка Endpoint),
#     серверный интерфейс (awg0/wg0) НЕ трогается.
#
# Примеры:
#   bash scripts/apply_to_configs.sh --dir /opt/amnezia/awg --allowed /tmp/allowed_ips.txt --dry-run
#   bash scripts/apply_to_configs.sh --dir /opt/amnezia/awg --allowed /tmp/allowed_ips.txt
#
set -euo pipefail

DIR=""
ALLOWED=""
DRY=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dir)     DIR="$2"; shift 2 ;;
    --allowed) ALLOWED="$2"; shift 2 ;;
    --dry-run) DRY=1; shift ;;
    -h|--help)
      echo "Usage: $0 --dir CONFIG_DIR --allowed ALLOWED_FILE [--dry-run]"
      exit 0 ;;
    *) echo "Неизвестный аргумент: $1" >&2; exit 1 ;;
  esac
done

[[ -z "$DIR" ]] && { echo "Ошибка: не указан --dir" >&2; exit 1; }
[[ -z "$ALLOWED" ]] && { echo "Ошибка: не указан --allowed" >&2; exit 1; }
[[ -d "$DIR" ]] || { echo "Ошибка: каталог не найден: $DIR" >&2; exit 1; }
[[ -f "$ALLOWED" ]] || { echo "Ошибка: файл не найден: $ALLOWED" >&2; exit 1; }

# Достаём значение AllowedIPs (часть после '='). Если в файле нет префикса
# 'AllowedIPs =', считаем, что весь файл — это список CIDR.
VALUE="$(sed -n 's/^[[:space:]]*AllowedIPs[[:space:]]*=[[:space:]]*//p' "$ALLOWED" | head -1)"
if [[ -z "$VALUE" ]]; then
  VALUE="$(tr -d '\n' < "$ALLOWED" | sed 's/^[[:space:]]*//; s/[[:space:]]*$//')"
fi
[[ -z "$VALUE" ]] && { echo "Ошибка: не удалось извлечь значение AllowedIPs из $ALLOWED" >&2; exit 1; }

TS="$(date +%Y%m%d-%H%M%S)"
CHANGED=0
SKIPPED=0

shopt -s nullglob
for f in "$DIR"/*.conf; do
  # Клиентский конфиг определяем по наличию строки Endpoint.
  if ! grep -qE '^[[:space:]]*Endpoint[[:space:]]*=' "$f"; then
    echo "пропуск (не клиентский конфиг, нет Endpoint): $f" >&2
    SKIPPED=$((SKIPPED+1))
    continue
  fi
  if ! grep -qE '^[[:space:]]*AllowedIPs[[:space:]]*=' "$f"; then
    echo "пропуск (нет строки AllowedIPs): $f" >&2
    SKIPPED=$((SKIPPED+1))
    continue
  fi

  OLD="$(sed -n 's/^[[:space:]]*AllowedIPs[[:space:]]*=[[:space:]]*//p' "$f" | head -1)"
  if [[ "$OLD" == "$VALUE" ]]; then
    echo "без изменений (уже применено): $f" >&2
    SKIPPED=$((SKIPPED+1))
    continue
  fi

  if [[ "$DRY" -eq 1 ]]; then
    echo "=== DRY-RUN: $f ===" >&2
    echo "  было:  AllowedIPs = ${OLD:0:80}..." >&2
    echo "  стало: AllowedIPs = ${VALUE:0:80}..." >&2
    CHANGED=$((CHANGED+1))
    continue
  fi

  cp -p "$f" "${f}.bak-${TS}"
  # Заменяем строку AllowedIPs целиком. Разделитель '|' безопасен: значение
  # состоит из цифр, точек, слэшей, запятых и пробелов.
  sed -i "s|^[[:space:]]*AllowedIPs[[:space:]]*=.*|AllowedIPs = ${VALUE}|" "$f"
  echo "обновлено: $f (бэкап: ${f}.bak-${TS})" >&2
  CHANGED=$((CHANGED+1))
done

echo "" >&2
if [[ "$DRY" -eq 1 ]]; then
  echo "DRY-RUN завершён. Будет изменено: $CHANGED, пропущено: $SKIPPED." >&2
  echo "Убери --dry-run, чтобы применить." >&2
else
  echo "Готово. Изменено: $CHANGED, пропущено: $SKIPPED." >&2
  echo "Не забудь раздать клиентам обновлённые конфиги (если через приложение)." >&2
fi
