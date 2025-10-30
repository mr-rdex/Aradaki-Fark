# VPS Deployment Hızlı Başlangıç

## 🚀 5 Adımda Deploy

### 1. MongoDB Atlas Hazırlığı (5 dakika)
```
1. mongodb.com/cloud/atlas/register → Ücretsiz hesap aç
2. FREE (M0) cluster oluştur
3. Database User ekle (username + password)
4. Network Access: "Allow from Anywhere" (0.0.0.0/0)
5. Connection string'i kopyala
```

### 2. VPS'e Bağlan
```bash
ssh root@YOUR_VPS_IP
```

### 3. Dosyaları Yükle
```bash
# Uygulamayı /var/www/aradakifark dizinine yükleyin
# (Git, SCP veya FTP ile)
```

### 4. Environment Variables
```bash
# Backend .env
cd /var/www/aradakifark/backend
nano .env
# MongoDB Atlas connection string'inizi ekleyin

# Frontend .env
cd /var/www/aradakifark/frontend
nano .env
# REACT_APP_BACKEND_URL=http://your-domain.com
```

### 5. Deploy Script Çalıştır
```bash
cd /var/www/aradakifark/vps-deployment
chmod +x *.sh
sudo bash 01-setup-server.sh
sudo bash 02-deploy-app.sh
```

## ✅ Deployment Tamamlandı!

**Test Edin:**
- http://your-domain.com veya http://YOUR_VPS_IP

**Servis Kontrol:**
```bash
sudo systemctl status aradakifark-backend
sudo systemctl status nginx
```

**Loglar:**
```bash
sudo journalctl -u aradakifark-backend -f
```

---

Detaylı kılavuz: `DEPLOYMENT_GUIDE.md`
