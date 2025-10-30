#!/bin/bash

# Aradaki Fark - Uygulama Deployment Script

set -e

echo "🚀 Uygulama Deploy Ediliyor..."

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Uygulama dizini
APP_DIR="/var/www/aradakifark"

# Root kontrolü
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Bu script root olarak çalıştırılmalı (sudo kullanın)${NC}"
    exit 1
fi

cd $APP_DIR

# 1. Backend kurulumu
echo -e "${YELLOW}🐍 Backend kurulumu yapılıyor...${NC}"
cd $APP_DIR/backend

# Virtual environment oluştur
python3 -m venv venv
source venv/bin/activate

# Gereksinimleri yükle
pip install --upgrade pip
pip install -r requirements.txt

deactivate

echo -e "${GREEN}✅ Backend kurulumu tamamlandı${NC}"

# 2. Frontend build
echo -e "${YELLOW}⚛️  Frontend build yapılıyor...${NC}"
cd $APP_DIR/frontend

# Node modules yükle
yarn install

# Production build
yarn build

echo -e "${GREEN}✅ Frontend build tamamlandı${NC}"

# 3. Systemd servisleri oluştur
echo -e "${YELLOW}⚙️  Systemd servisleri oluşturuluyor...${NC}"

# Backend servisi
cat > /etc/systemd/system/aradakifark-backend.service << EOF
[Unit]
Description=Aradaki Fark Backend (FastAPI)
After=network.target

[Service]
Type=simple
User=www-data
WorkingDirectory=$APP_DIR/backend
Environment="PATH=$APP_DIR/backend/venv/bin"
EnvironmentFile=$APP_DIR/backend/.env
ExecStart=$APP_DIR/backend/venv/bin/uvicorn server:app --host 0.0.0.0 --port 8001
Restart=always
RestartSec=10

[Install]
WantedBy=multi-user.target
EOF

echo -e "${GREEN}✅ Systemd servisleri oluşturuldu${NC}"

# 4. Nginx yapılandırması
echo -e "${YELLOW}🌐 Nginx yapılandırılıyor...${NC}"

# Domain adını sor
read -p "Domain adınızı girin (örn: aradakifark.com): " DOMAIN

cat > /etc/nginx/sites-available/aradakifark << EOF
server {
    listen 80;
    server_name $DOMAIN www.$DOMAIN;

    # Frontend (React build)
    location / {
        root $APP_DIR/frontend/build;
        try_files \$uri \$uri/ /index.html;
        
        # Cache static files
        location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ {
            expires 1y;
            add_header Cache-Control "public, immutable";
        }
    }

    # Backend API
    location /api/ {
        proxy_pass http://127.0.0.1:8001/api/;
        proxy_http_version 1.1;
        proxy_set_header Upgrade \$http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host \$host;
        proxy_cache_bypass \$http_upgrade;
        proxy_set_header X-Real-IP \$remote_addr;
        proxy_set_header X-Forwarded-For \$proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto \$scheme;
    }

    # Gzip compression
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_types text/plain text/css text/xml text/javascript application/x-javascript application/xml+rss application/json;

    client_max_body_size 10M;
}
EOF

# Nginx sembolik link oluştur
ln -sf /etc/nginx/sites-available/aradakifark /etc/nginx/sites-enabled/

# Default site'ı kaldır
rm -f /etc/nginx/sites-enabled/default

# Nginx test
nginx -t

echo -e "${GREEN}✅ Nginx yapılandırıldı${NC}"

# 5. Servisleri başlat
echo -e "${YELLOW}🔄 Servisler başlatılıyor...${NC}"

systemctl daemon-reload
systemctl enable aradakifark-backend
systemctl start aradakifark-backend
systemctl restart nginx

echo -e "${GREEN}✅ Servisler başlatıldı${NC}"

# 6. Durum kontrolü
echo ""
echo -e "${YELLOW}📊 Servis Durumları:${NC}"
systemctl status aradakifark-backend --no-pager | head -n 10
systemctl status nginx --no-pager | head -n 5

echo ""
echo -e "${GREEN}🎉 Deployment tamamlandı!${NC}"
echo ""
echo -e "${YELLOW}📋 Önemli Bilgiler:${NC}"
echo "• Backend servisi: systemctl status aradakifark-backend"
echo "• Backend logları: journalctl -u aradakifark-backend -f"
echo "• Nginx restart: systemctl restart nginx"
echo "• Site URL: http://$DOMAIN"
echo ""
echo -e "${YELLOW}⚠️  SSL Sertifikası için:${NC}"
echo "sudo apt install certbot python3-certbot-nginx"
echo "sudo certbot --nginx -d $DOMAIN -d www.$DOMAIN"
