#!/usr/bin/env bash
# One-time server setup for the dental clinic website (Ubuntu 24.04 LTS).
set -euo pipefail

if [[ $EUID -ne 0 ]]; then
  echo "Please run with sudo:  sudo bash deploy/setup-server.sh"
  exit 1
fi
cd /tmp

APP_USER=dental
APP_ROOT=/srv/dental-clinic
APP_DIR=$APP_ROOT/app
BACKEND=$APP_DIR/backend
WEB_ROOT=/var/www/dental-clinic
DB_NAME=dental_clinic
DB_USER=dental_user

as_app() { sudo -H -u "$APP_USER" "$@"; }
manage() { (cd "$BACKEND" && as_app "$BACKEND/venv/bin/python" manage.py "$@"); }

if [[ ! -f $BACKEND/manage.py ]]; then
  echo "Cannot find $BACKEND/manage.py. Clone the repository first (see the guide)."
  exit 1
fi
if [[ -f $BACKEND/.env ]]; then
  echo "This server is already set up ($BACKEND/.env exists). Use deploy/update.sh for updates."
  exit 1
fi

read -rp "Your domain without www (example: brightsmile.in): " DOMAIN
DOMAIN=$(echo "$DOMAIN" | tr 'A-Z' 'a-z' | sed 's/^www\.//')
if [[ ! $DOMAIN =~ ^[a-z0-9-]+(\.[a-z0-9-]+)+$ ]]; then
  echo "That does not look like a valid domain."
  exit 1
fi

echo "==> Installing system packages"
export DEBIAN_FRONTEND=noninteractive
apt-get update -y
apt-get install -y python3 python3-venv postgresql nginx certbot python3-certbot-nginx ufw rsync
systemctl enable --now postgresql

echo "==> Creating the PostgreSQL database"
DB_PASS=$(python3 -c "import secrets; print(secrets.token_urlsafe(24))")
psql_run() { sudo -u postgres psql -v ON_ERROR_STOP=1 -tA "$@"; }
if [[ -z $(psql_run -c "SELECT 1 FROM pg_roles WHERE rolname='$DB_USER'") ]]; then
  psql_run -c "CREATE USER $DB_USER WITH PASSWORD '$DB_PASS';"
else
  psql_run -c "ALTER USER $DB_USER WITH PASSWORD '$DB_PASS';"
fi
psql_run -c "ALTER ROLE $DB_USER SET client_encoding TO 'utf8';"
psql_run -c "ALTER ROLE $DB_USER SET timezone TO 'UTC';"
if [[ -z $(psql_run -c "SELECT 1 FROM pg_database WHERE datname='$DB_NAME'") ]]; then
  psql_run -c "CREATE DATABASE $DB_NAME OWNER $DB_USER;"
fi

echo "==> Writing backend/.env"
SECRET_KEY=$(python3 -c "import secrets; print(secrets.token_urlsafe(60))")
cat > "$BACKEND/.env" <<EOF
SECRET_KEY=$SECRET_KEY
DEBUG=False
ALLOWED_HOSTS=$DOMAIN,www.$DOMAIN
DB_NAME=$DB_NAME
DB_USER=$DB_USER
DB_PASSWORD=$DB_PASS
DB_HOST=localhost
DB_PORT=5432
DB_CONN_MAX_AGE=60
CSRF_TRUSTED_ORIGINS=https://$DOMAIN,https://www.$DOMAIN
NUM_PROXIES=1
SECURE_HSTS_SECONDS=3600
CACHE_DIR=$APP_ROOT/cache
EOF
mkdir -p "$APP_ROOT/cache"
chown -R "$APP_USER:$APP_USER" "$APP_ROOT"
chmod 600 "$BACKEND/.env"
chmod 755 "$APP_ROOT"

echo "==> Installing Python packages (this takes a minute)"
as_app python3 -m venv "$BACKEND/venv"
as_app "$BACKEND/venv/bin/pip" install --upgrade pip
as_app "$BACKEND/venv/bin/pip" install -r "$BACKEND/requirements.txt"

echo "==> Preparing the database and static files"
manage migrate --noinput
manage collectstatic --noinput

read -rp "Load the SAMPLE services, doctors and reviews? Sample reviews are fake. (y/N): " SEED
if [[ ${SEED,,} == "y" ]]; then
  manage seed_demo_data
fi

echo "==> Starting the application service"
cp "$APP_DIR/deploy/dental-gunicorn.service" /etc/systemd/system/dental-gunicorn.service
systemctl daemon-reload
systemctl enable --now dental-gunicorn
sleep 3
if ! systemctl is-active --quiet dental-gunicorn; then
  echo "The service did not start. Run:  sudo journalctl -u dental-gunicorn -n 50 --no-pager"
  exit 1
fi

echo "==> Configuring Nginx"
mkdir -p "$WEB_ROOT"
if [[ ! -f $WEB_ROOT/index.html ]]; then
  echo "<h1>Site coming soon</h1>" > "$WEB_ROOT/index.html"
fi
chmod -R a+rX "$WEB_ROOT"
sed "s/__DOMAIN__/$DOMAIN/g" "$APP_DIR/deploy/nginx-dental.conf" > /etc/nginx/sites-available/dental-clinic
ln -sf /etc/nginx/sites-available/dental-clinic /etc/nginx/sites-enabled/dental-clinic
rm -f /etc/nginx/sites-enabled/default
nginx -t
systemctl reload nginx

echo "==> Setting up nightly backups"
echo "30 2 * * * root bash $APP_DIR/deploy/backup.sh >> /var/log/dental-backup.log 2>&1" > /etc/cron.d/dental-backup
chmod 644 /etc/cron.d/dental-backup

echo "==> Turning on the firewall (SSH, HTTP, HTTPS only)"
ufw allow 22/tcp
ufw allow 80/tcp
ufw allow 443/tcp
ufw --force enable

echo "==> Security check"
manage check --deploy || true

echo
echo "Server setup finished for $DOMAIN."
echo "Next: upload the frontend, run 'sudo certbot --nginx', then create your admin user."
