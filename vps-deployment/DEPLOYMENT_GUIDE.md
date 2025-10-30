# Aradaki Fark - VPS Deployment Kılavuzu

## 📋 Gereksinimler

### VPS Özellikleri
- ✅ 1 CPU
- ✅ 512 MB RAM (MongoDB Atlas kullanıldığı için yeterli)
- ✅ 20 GB SSD
- ✅ Linux (Ubuntu 20.04/22.04 önerilir)
- ✅ Root erişimi

### Dış Servisler
- MongoDB Atlas hesabı (ücretsiz 512MB tier)
- Domain adı (opsiyonel ama önerilir)

---

## 🚀 Deployment Adımları

### 1. MongoDB Atlas Kurulumu

#### a. Hesap Oluşturma
1. [MongoDB Atlas](https://www.mongodb.com/cloud/atlas/register) üzerinden ücretsiz hesap oluşturun
2. "Create a New Cluster" seçeneğini seçin
3. **FREE tier (M0)** seçin
4. Bölge seçin (Türkiye'ye en yakın: Frankfurt veya London)
5. Cluster adını girin (örn: `aradakifark-cluster`)

#### b. Database User Oluşturma
1. Sol menüden **"Database Access"** seçin
2. **"Add New Database User"** butonuna tıklayın
3. Username ve şifre belirleyin (güvenli bir şifre seçin)
4. **"Database User Privileges"**: "Read and write to any database" seçin
5. **"Add User"** butonuna tıklayın

#### c. Network Access Ayarlama
1. Sol menüden **"Network Access"** seçin
2. **"Add IP Address"** butonuna tıklayın
3. **"Allow Access from Anywhere"** seçin (0.0.0.0/0)
   - ⚠️ Alternatif: VPS IP adresinizi girin (daha güvenli)
4. **"Confirm"** butonuna tıklayın

#### d. Connection String Alma
1. **"Database"** > **"Connect"** butonuna tıklayın
2. **"Connect your application"** seçin
3. Driver: **"Python"**, Version: **"3.6 or later"** seçin
4. Connection string'i kopyalayın:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
5. `<username>` ve `<password>` yerlerine kendi bilgilerinizi yazın

---

### 2. VPS'e Bağlanma

SSH ile VPS'e bağlanın:
```bash
ssh root@YOUR_VPS_IP
```

Şifrenizi girin ve bağlantıyı kurun.

---

### 3. Uygulama Dosyalarını VPS'e Yükleme

#### Yöntem 1: Git ile (Önerilir)
```bash
cd /var/www
git clone YOUR_REPO_URL aradakifark
```

#### Yöntem 2: SCP ile (Local'den)
Local bilgisayarınızdan:
```bash
scp -r /app root@YOUR_VPS_IP:/var/www/aradakifark
```

#### Yöntem 3: FTP/SFTP ile
FileZilla veya WinSCP kullanarak dosyaları `/var/www/aradakifark` dizinine yükleyin.

---

### 4. Environment Variables Ayarlama

#### a. Backend .env dosyası
```bash
cd /var/www/aradakifark/backend
nano .env
```

Aşağıdaki içeriği yapıştırın (MongoDB Atlas connection string'inizi kullanın):
```env
MONGO_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/aradakifark?retryWrites=true&w=majority
DB_NAME=aradakifark
JWT_SECRET=your-super-secret-jwt-key-12345
CORS_ORIGINS=*
ENVIRONMENT=production
```

Kaydet ve çık: `Ctrl+X`, `Y`, `Enter`

#### b. Frontend .env dosyası
```bash
cd /var/www/aradakifark/frontend
nano .env
```

Aşağıdaki içeriği yapıştırın (domain'inizi yazın):
```env
REACT_APP_BACKEND_URL=http://your-domain.com
```

Eğer domain yoksa VPS IP kullanın:
```env
REACT_APP_BACKEND_URL=http://YOUR_VPS_IP
```

Kaydet ve çık: `Ctrl+X`, `Y`, `Enter`

---

### 5. Deployment Scriptlerini Çalıştırma

#### a. Server Kurulumu
```bash
cd /var/www/aradakifark/vps-deployment
chmod +x *.sh
sudo bash 01-setup-server.sh
```

Bu script:
- Sistem güncellemelerini yapar
- Python, Node.js, Nginx kurar
- Gerekli dizinleri oluşturur

#### b. Uygulama Deployment
```bash
sudo bash 02-deploy-app.sh
```

Domain adınızı soracak, girin (örn: `aradakifark.com`)

Bu script:
- Backend ve Frontend kurar
- Systemd servisleri oluşturur
- Nginx yapılandırır
- Servisleri başlatır

---

### 6. Domain Ayarları (Eğer domain kullanıyorsanız)

#### a. DNS Ayarları
Domain sağlayıcınızın kontrol panelinden:

**A Record ekleyin:**
```
Type: A
Name: @
Value: YOUR_VPS_IP
TTL: 3600
```

**WWW için A Record:**
```
Type: A
Name: www
Value: YOUR_VPS_IP
TTL: 3600
```

DNS yayılması 5-30 dakika sürebilir.

#### b. SSL Sertifikası (HTTPS için - Önerilir)

Let's Encrypt ile ücretsiz SSL:
```bash
sudo apt install certbot python3-certbot-nginx -y
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

Email adresinizi girin ve talimatları takip edin.

SSL otomatik yenilemesi:
```bash
sudo certbot renew --dry-run
```

---

## 📊 Deployment Sonrası Kontroller

### 1. Servis Durumlarını Kontrol Edin
```bash
# Backend durumu
sudo systemctl status aradakifark-backend

# Nginx durumu
sudo systemctl status nginx
```

### 2. Logları İnceleyin
```bash
# Backend logları (canlı)
sudo journalctl -u aradakifark-backend -f

# Nginx error logları
sudo tail -f /var/log/nginx/error.log
```

### 3. Web Sitesini Test Edin
Tarayıcıda açın:
- `http://your-domain.com` veya `http://YOUR_VPS_IP`
- Kayıt olun ve giriş yapın
- Araç karşılaştırması yapın
- Forum sayfasına gidin

---

## 🔧 Sık Kullanılan Komutlar

### Servis Yönetimi
```bash
# Backend'i yeniden başlat
sudo systemctl restart aradakifark-backend

# Backend'i durdur
sudo systemctl stop aradakifark-backend

# Backend'i başlat
sudo systemctl start aradakifark-backend

# Nginx'i yeniden başlat
sudo systemctl restart nginx
```

### Uygulama Güncelleme
```bash
cd /var/www/aradakifark

# Git ile güncelleme
git pull origin main

# Backend güncelleme
cd backend
source venv/bin/activate
pip install -r requirements.txt
deactivate
sudo systemctl restart aradakifark-backend

# Frontend güncelleme
cd ../frontend
yarn install
yarn build
sudo systemctl restart nginx
```

### Log İnceleme
```bash
# Backend logları
sudo journalctl -u aradakifark-backend -n 100

# Nginx access logları
sudo tail -f /var/log/nginx/access.log

# Nginx error logları
sudo tail -f /var/log/nginx/error.log
```

---

## ⚠️ Sorun Giderme

### Backend başlamıyor
```bash
# Logları kontrol et
sudo journalctl -u aradakifark-backend -n 50

# Olası sorunlar:
# 1. MongoDB bağlantı hatası → .env dosyasını kontrol edin
# 2. Port kullanımda → sudo lsof -i :8001
# 3. Python hataları → requirements.txt eksik paket var mı?
```

### Frontend açılmıyor
```bash
# Nginx durumunu kontrol et
sudo systemctl status nginx

# Build dosyaları var mı?
ls -la /var/www/aradakifark/frontend/build

# Yeniden build
cd /var/www/aradakifark/frontend
yarn build
```

### MongoDB bağlantı hatası
```bash
# Connection string doğru mu?
cat /var/www/aradakifark/backend/.env

# MongoDB Atlas'ta Network Access ayarlarını kontrol edin
# VPS IP adresi whitelist'te olmalı veya 0.0.0.0/0 açık olmalı
```

### 502 Bad Gateway
```bash
# Backend çalışıyor mu?
sudo systemctl status aradakifark-backend

# Backend başlat
sudo systemctl start aradakifark-backend

# Nginx restart
sudo systemctl restart nginx
```

---

## 🔐 Güvenlik Önerileri

### 1. Firewall Ayarları
```bash
sudo ufw allow 22/tcp    # SSH
sudo ufw allow 80/tcp    # HTTP
sudo ufw allow 443/tcp   # HTTPS
sudo ufw enable
sudo ufw status
```

### 2. SSH Güvenliği
```bash
# Root login devre dışı bırak
sudo nano /etc/ssh/sshd_config
# PermitRootLogin no
sudo systemctl restart sshd

# Yeni sudo user oluştur
adduser yourusername
usermod -aG sudo yourusername
```

### 3. JWT Secret Güçlendir
```bash
# Güvenli bir secret oluştur
openssl rand -hex 32

# backend/.env dosyasında güncelle
```

### 4. CORS Ayarları
Production'da CORS_ORIGINS'i domain'inize özel yapın:
```env
CORS_ORIGINS=http://your-domain.com,https://your-domain.com
```

---

## 📈 Performans İyileştirmeleri

### 1. Nginx Caching
Nginx config'e ekleyin (`/etc/nginx/sites-available/aradakifark`):
```nginx
proxy_cache_path /var/cache/nginx levels=1:2 keys_zone=api_cache:10m max_size=100m inactive=60m;

location /api/ {
    proxy_cache api_cache;
    proxy_cache_valid 200 5m;
    # ... diğer ayarlar
}
```

### 2. MongoDB İndeksler
Backend'de önemli collection'lar için index ekleyin.

### 3. Static File Compression
Nginx gzip compression zaten aktif (deployment script'te).

---

## 📞 Destek

Sorun yaşarsanız:
1. Logları kontrol edin
2. Servis durumlarını kontrol edin
3. MongoDB Atlas bağlantısını test edin
4. GitHub issues'dan destek alın

---

## 🎉 Tebrikler!

Siteniz artık canlı! 🚀

**Sonraki Adımlar:**
- ✅ SSL sertifikası ekleyin (HTTPS)
- ✅ Google Analytics ekleyin
- ✅ Google AdSense entegre edin
- ✅ Backup stratejisi oluşturun
- ✅ Monitoring kurun (Uptime Robot vb.)
