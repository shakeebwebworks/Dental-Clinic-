#!/usr/bin/env bash
# Nightly backup of the database and uploaded photos. Keeps 14 days.
set -euo pipefail
umask 077
cd /

BACKUP_DIR=/var/backups/dental-clinic
mkdir -p "$BACKUP_DIR"
chmod 700 "$BACKUP_DIR"
STAMP=$(date +%F_%H%M)

sudo -u postgres pg_dump dental_clinic | gzip > "$BACKUP_DIR/db_$STAMP.sql.gz"
if [[ -d /srv/dental-clinic/app/backend/media ]]; then
  tar -czf "$BACKUP_DIR/media_$STAMP.tar.gz" -C /srv/dental-clinic/app/backend media
fi
find "$BACKUP_DIR" -type f -mtime +14 -delete
echo "Backup finished: $STAMP"
