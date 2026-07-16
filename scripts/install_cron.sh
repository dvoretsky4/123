#!/usr/bin/env bash
#
# Ставит еженедельное обновление списка RU-подсетей и переприменение
# AllowedIPs к клиентским конфигам. RU-диапазоны меняются, поэтому список
# нужно периодически пересобирать.
#
# Пример:
#   sudo bash scripts/install_cron.sh --dir /opt/amnezia/awg
#
set -euo pipefail

HERE="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
DIR=""
RU_URL=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --dir) DIR="$2"; shift 2 ;;
    --url) RU_URL="$2"; shift 2 ;;
    -h|--help)
      echo "Usage: sudo $0 --dir CONFIG_DIR [--url RU_LIST_URL]"
      exit 0 ;;
    *) echo "Неизвестный аргумент: $1" >&2; exit 1 ;;
  esac
done

[[ -z "$DIR" ]] && { echo "Ошибка: не указан --dir" >&2; exit 1; }
[[ -d "$DIR" ]] || { echo "Ошибка: каталог не найден: $DIR" >&2; exit 1; }

if [[ "$(id -u)" -ne 0 ]]; then
  echo "Нужны права root (запусти через sudo)." >&2
  exit 1
fi

URL_ARG=""
[[ -n "$RU_URL" ]] && URL_ARG="--url \"$RU_URL\""

CRON="/etc/cron.weekly/amneziawg-ru-split"
LOG="/var/log/amneziawg-ru-split.log"

cat > "$CRON" <<EOF
#!/usr/bin/env bash
# Автообновление AllowedIPs (весь интернет минус RU) для AmneziaWG.
set -euo pipefail
TS="\$(date '+%Y-%m-%d %H:%M:%S')"
{
  echo "[\$TS] старт обновления RU-split"
  bash "$HERE/generate_allowed_ips.sh" --out /tmp/allowed_ips.txt $URL_ARG
  bash "$HERE/apply_to_configs.sh" --dir "$DIR" --allowed /tmp/allowed_ips.txt
  echo "[\$TS] обновление завершено"
} >> "$LOG" 2>&1
EOF

chmod +x "$CRON"
touch "$LOG"

echo "Установлено: $CRON (запуск еженедельно, лог: $LOG)" >&2
echo "Проверить вручную: sudo $CRON && tail -n 20 $LOG" >&2
