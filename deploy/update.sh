#!/usr/bin/env bash
# Deploy new backend code after you pushed it to GitHub.
set -euo pipefail

if [[ $EUID -ne 0 ]]; then
  echo "Please run with sudo:  sudo bash deploy/update.sh"
  exit 1
fi

APP_USER=dental
APP_DIR=/srv/dental-clinic/app
BACKEND=$APP_DIR/backend
as_app() { sudo -H -u "$APP_USER" "$@"; }

cd "$APP_DIR"
as_app git pull --ff-only
cd "$BACKEND"
as_app venv/bin/pip install -r requirements.txt
as_app venv/bin/python manage.py migrate --noinput
as_app venv/bin/python manage.py collectstatic --noinput
systemctl restart dental-gunicorn
echo "Backend updated. If you changed the frontend, upload it with deploy\\deploy-frontend.ps1 on your PC."
