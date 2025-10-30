#!/bin/bash

# Backup Script - MongoDB Atlas Backup (Optional)
# Bu script uygulamanızın yedeklerini alır

set -e

BACKUP_DIR="/var/backups/aradakifark"
DATE=$(date +%Y%m%d_%H%M%S)

echo "📦 Backup başlatılıyor..."

# Backup dizini oluştur
mkdir -p $BACKUP_DIR

# Frontend build backup
echo "⚛️ Frontend build yedekleniyor..."
tar -czf $BACKUP_DIR/frontend_$DATE.tar.gz -C /var/www/aradakifark/frontend/build .

# Backend code backup
echo "🐍 Backend kodu yedekleniyor..."
tar -czf $BACKUP_DIR/backend_$DATE.tar.gz -C /var/www/aradakifark/backend . --exclude='venv' --exclude='__pycache__'

# .env files backup
echo "⚙️ Environment variables yedekleniyor..."
cp /var/www/aradakifark/backend/.env $BACKUP_DIR/backend_env_$DATE.backup
cp /var/www/aradakifark/frontend/.env $BACKUP_DIR/frontend_env_$DATE.backup

# 30 günden eski backupları sil
find $BACKUP_DIR -name "*.tar.gz" -mtime +30 -delete
find $BACKUP_DIR -name "*.backup" -mtime +30 -delete

echo "✅ Backup tamamlandı: $BACKUP_DIR"
ls -lh $BACKUP_DIR | tail -n 10

# Cron job eklemek için:
# crontab -e
# 0 2 * * * /var/www/aradakifark/vps-deployment/backup.sh >> /var/log/aradakifark-backup.log 2>&1
