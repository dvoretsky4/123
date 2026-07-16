#!/usr/bin/env bash
#
# Откат: восстанавливает клиентские конфиги из последних бэкапов *.conf.bak-*,
# созданных apply_to_configs.sh.
#
# Пример:
#   bash scripts/rollback.sh --dir /opt/amnezia/awg
#   bash scripts/rollback.sh --dir /opt/amnezia/awg --dry-run
#
set -euo pipefail

DIR=""
DRY=0

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dir)     DIR="$2"; shift 2 ;;
    --dry-run) DRY=1; shift ;;
    -h|--help)
      echo "Usage: $0 --dir CONFIG_DIR [--dry-run]"
      exit 0 ;;
    *) echo "Неизвестный аргумент: $1" >&2; exit 1 ;;
  esac
done

[[ -z "$DIR" ]] && { echo "Ошибка: не указан --dir" >&2; exit 1; }
[[ -d "$DIR" ]] || { echo "Ошибка: каталог не найден: $DIR" >&2; exit 1; }

RESTORED=0
shopt -s nullglob
for f in "$DIR"/*.conf; do
  # Ищем самый свежий бэкап для этого конфига.
  latest=""
  for b in "$f".bak-*; do
    [[ -e "$b" ]] || continue
    if [[ -z "$latest" || "$b" > "$latest" ]]; then
      latest="$b"
    fi
  done
  [[ -z "$latest" ]] && continue

  if [[ "$DRY" -eq 1 ]]; then
    echo "DRY-RUN: восстановил бы $f <- $latest" >&2
  else
    cp -p "$latest" "$f"
    echo "восстановлено: $f <- $latest" >&2
  fi
  RESTORED=$((RESTORED+1))
done

echo "" >&2
echo "Готово. Обработано конфигов с бэкапами: $RESTORED." >&2
echo "Не забудь перезапустить интерфейс, чтобы клиенты получили старые настройки" >&2
echo "(или переотправь клиентам исходные конфиги, если раздача через приложение)." >&2
