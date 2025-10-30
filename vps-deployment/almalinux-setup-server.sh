#!/bin/bash

# Aradaki Fark - AlmaLinux 8 VPS Deployment Script
# Bu script uygulamayı AlmaLinux 8 VPS'te kurar

set -e

echo "🚀 Aradaki Fark VPS Deployment Başlıyor (AlmaLinux 8)..."

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Root kontrolü
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Bu script root olarak çalıştırılmalı${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Root erişimi doğrulandı${NC}"

# 1. Sistem güncellemesi
echo -e "${YELLOW}📦 Sistem güncelleniyor...${NC}"
dnf update -y

# 2. EPEL repository ekle
echo -e "${YELLOW}📦 EPEL repository ekleniyor...${NC}"
dnf install -y epel-release

# 3. Gerekli paketleri yükle
echo -e "${YELLOW}📦 Gerekli paketler yükleniyor...${NC}"
dnf install -y python39 python39-pip python39-devel gcc nginx git curl wget unzip

# Python3 sembolik linkini oluştur
alternatives --set python3 /usr/bin/python3.9 || true

# 4. Node.js yükle (NodeSource repository)
echo -e "${YELLOW}📦 Node.js yükleniyor...${NC}"
curl -fsSL https://rpm.nodesource.com/setup_18.x | bash -
dnf install -y nodejs

# 5. Yarn yükle
echo -e "${YELLOW}📦 Yarn yükleniyor...${NC}"
npm install -g yarn

# 6. Firewall ayarları
echo -e "${YELLOW}🔥 Firewall ayarları yapılıyor...${NC}"
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload

# 7. SELinux ayarları
echo -e "${YELLOW}🔐 SELinux ayarları yapılıyor...${NC}"
# SELinux için gerekli paketleri yükle
dnf install -y policycoreutils-python-utils

# HTTP bağlantılarına izin ver
setsebool -P httpd_can_network_connect 1

# 8. Uygulama dizinini oluştur
echo -e "${YELLOW}📁 Uygulama dizini oluşturuluyor...${NC}"
mkdir -p /var/www/aradakifark

# Sahiplik ayarları
chown -R nginx:nginx /var/www/aradakifark

echo -e "${GREEN}✅ Sistem hazırlığı tamamlandı${NC}"
echo ""
echo -e "${YELLOW}📋 Sonraki Adımlar:${NC}"
echo "1. Uygulama dosyalarını /var/www/aradakifark dizinine yükleyin"
echo "2. MongoDB Atlas bağlantı string'ini backend/.env dosyasına ekleyin"
echo "3. sudo bash almalinux-deploy-app.sh komutunu çalıştırın"
