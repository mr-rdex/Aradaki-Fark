#!/bin/bash

# Aradaki Fark - VPS Deployment Script
# Bu script uygulamayı VPS'te kurar ve çalıştırır

set -e

echo "🚀 Aradaki Fark VPS Deployment Başlıyor..."

# Renk kodları
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Root kontrolü
if [ "$EUID" -ne 0 ]; then 
    echo -e "${RED}❌ Bu script root olarak çalıştırılmalı (sudo kullanın)${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Root erişimi doğrulandı${NC}"

# 1. Sistem güncellemesi
echo -e "${YELLOW}📦 Sistem güncelleniyor...${NC}"
apt update && apt upgrade -y

# 2. Gerekli paketleri yükle
echo -e "${YELLOW}📦 Gerekli paketler yükleniyor...${NC}"
apt install -y python3 python3-pip python3-venv nginx git curl

# 3. Node.js yükle (frontend için)
echo -e "${YELLOW}📦 Node.js yükleniyor...${NC}"
curl -fsSL https://deb.nodesource.com/setup_18.x | bash -
apt install -y nodejs

# 4. Yarn yükle
echo -e "${YELLOW}📦 Yarn yükleniyor...${NC}"
npm install -g yarn

# 5. Uygulama dizinini oluştur
echo -e "${YELLOW}📁 Uygulama dizini oluşturuluyor...${NC}"
mkdir -p /var/www/aradakifark
cd /var/www/aradakifark

echo -e "${GREEN}✅ Sistem hazırlığı tamamlandı${NC}"
echo ""
echo -e "${YELLOW}📋 Sonraki Adımlar:${NC}"
echo "1. Uygulama dosyalarını /var/www/aradakifark dizinine yükleyin"
echo "2. MongoDB Atlas bağlantı string'ini backend/.env dosyasına ekleyin"
echo "3. sudo bash deploy-app.sh komutunu çalıştırın"
