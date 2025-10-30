# AlmaLinux 8 VPS Deployment Kılavuzu

## 📋 AlmaLinux 8 İçin Özel Talimatlar

Bu kılavuz AlmaLinux 8 işletim sistemi için hazırlanmıştır.

---

## 🚀 Hızlı Başlangıç (AlmaLinux 8)

### 1. Dosyaları VPS'e Yükleme (En Kolay Yöntem: Git)

#### SSH ile VPS'e Bağlanın
```bash
ssh root@VPS_IP_ADRESINIZ
```

#### Git ile Dosyaları İndirin

**Seçenek A - GitHub'dan:**
```bash
# Git yükle
dnf install -y git

# Dizin oluştur ve dosyaları çek
cd /var/www
git clone https://github.com/KULLANICI_ADINIZ/REPO_ADINIZ.git aradakifark
```

**Seçenek B - Wget ile ZIP indirme:**
```bash
# Wget ile indir (ZIP linkini bir yere yüklediyseniz)
cd /tmp
wget "ZIP_DOSYANIZIN_LINKI" -O aradakifark.zip

# Unzip et
dnf install -y unzip
mkdir -p /var/www/aradakifark
unzip aradakifark.zip -d /var/www/aradakifark
```

**Seçenek C - SFTP (FileZilla):**
- Host: VPS_IP_ADRESINIZ
- Port: 22
- Protocol: SFTP
- Username: root
- Password: VPS şifreniz
- Remote dizin: /var/www/aradakifark

---

### 2. MongoDB Atlas Hazırlığı

1. https://www.mongodb.com/cloud/atlas/register - Ücretsiz hesap
2. FREE (M0) cluster oluştur
3. Database User ekle (username + password kaydet)
4. Network Access: "Allow from Anywhere" (0.0.0.0/0)
5. Connection string'i kopyala:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

---

### 3. Environment Variables Ayarlama

#### Backend .env
```bash
cd /var/www/aradakifark/backend
nano .env
```

Aşağıdakini yapıştır (MongoDB bilgilerinizi güncelleyin):
```env
MONGO_URL=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/aradakifark?retryWrites=true&w=majority
DB_NAME=aradakifark
JWT_SECRET=gizli-anahtar-degistir-12345
CORS_ORIGINS=*
ENVIRONMENT=production
```

Kaydet: `Ctrl+X`, `Y`, `Enter`

#### Frontend .env
```bash
cd /var/www/aradakifark/frontend
nano .env
```

Domain veya IP adresinizi girin:
```env
REACT_APP_BACKEND_URL=http://your-domain.com
```

Veya IP kullanın:
```env
REACT_APP_BACKEND_URL=http://123.45.67.89
```

Kaydet: `Ctrl+X`, `Y`, `Enter`

---

### 4. Deployment Scriptlerini Çalıştırma

```bash
cd /var/www/aradakifark/vps-deployment
chmod +x almalinux-*.sh

# Sunucu hazırlığı (10-15 dakika)
sudo bash almalinux-setup-server.sh

# Uygulama deployment (10-15 dakika)
sudo bash almalinux-deploy-app.sh
```

Domain adınızı soracak, yazın (örn: aradakifark.com)

---

### 5. Test Edin

Tarayıcıda açın:
- http://your-domain.com
- veya http://VPS_IP_ADRESINIZ

---

## 🔧 AlmaLinux 8 Özel Komutlar

### Paket Yönetimi (apt yerine dnf/yum)
```bash
# Paket yükleme
dnf install -y paket-adi

# Sistem güncelleme
dnf update -y

# Paket arama
dnf search paket-adi

# Kurulu paketler
dnf list installed
```

### Firewall Yönetimi
```bash
# Firewall durumu
firewall-cmd --state

# HTTP/HTTPS izni
firewall-cmd --permanent --add-service=http
firewall-cmd --permanent --add-service=https
firewall-cmd --reload

# Port açma
firewall-cmd --permanent --add-port=8001/tcp
firewall-cmd --reload

# Firewall kuralları
firewall-cmd --list-all
```

### SELinux Yönetimi
```bash
# SELinux durumu
getenforce

# SELinux modu değiştirme (geçici)
setenforce 0  # Permissive
setenforce 1  # Enforcing

# SELinux context ayarlama
chcon -R -t httpd_sys_content_t /var/www/aradakifark/frontend/build

# Port izni
semanage port -a -t http_port_t -p tcp 8001
```

### Servis Yönetimi (Ubuntu ile aynı)
```bash
# Backend servisi
systemctl status aradakifark-backend
systemctl restart aradakifark-backend
systemctl stop aradakifark-backend
systemctl start aradakifark-backend

# Nginx
systemctl status nginx
systemctl restart nginx

# Loglar
journalctl -u aradakifark-backend -f
journalctl -u nginx -f
```

---

## ⚠️ AlmaLinux 8 Özel Sorun Giderme

### Backend başlamıyor

#### 1. SELinux kontrolü
```bash
# SELinux loglarını incele
ausearch -m avc -ts recent

# Geçici olarak kapat (test için)
setenforce 0

# Eğer çalışırsa, SELinux context ayarla
chcon -R -t httpd_sys_rw_content_t /var/www/aradakifark/backend
setsebool -P httpd_can_network_connect 1
```

#### 2. Firewall kontrolü
```bash
# Port açık mı?
firewall-cmd --list-all

# 8001 portunu aç
firewall-cmd --permanent --add-port=8001/tcp
firewall-cmd --reload
```

#### 3. Python versiyonu
```bash
# Python versiyonu
python3 --version

# Eğer 3.9+ değilse
alternatives --install /usr/bin/python3 python3 /usr/bin/python3.9 1
alternatives --set python3 /usr/bin/python3.9
```

### Nginx 502 Bad Gateway

```bash
# Backend çalışıyor mu?
systemctl status aradakifark-backend

# SELinux izin ver
setsebool -P httpd_can_network_connect on

# Nginx error log
tail -f /var/log/nginx/error.log
```

### "Permission Denied" hataları

```bash
# Dosya sahipliği
chown -R nginx:nginx /var/www/aradakifark

# Dosya izinleri
chmod -R 755 /var/www/aradakifark

# SELinux context
restorecon -Rv /var/www/aradakifark
```

---

## 🔐 SSL Sertifikası (HTTPS)

```bash
# Certbot yükle (AlmaLinux için)
dnf install -y certbot python3-certbot-nginx

# SSL sertifikası al
certbot --nginx -d your-domain.com -d www.your-domain.com

# Otomatik yenileme testi
certbot renew --dry-run
```

---

## 📊 Performans İyileştirmeleri (AlmaLinux)

### Swap Memory Ekleme (512MB RAM için önerilen)
```bash
# 1GB Swap oluştur
fallocate -l 1G /swapfile
chmod 600 /swapfile
mkswap /swapfile
swapon /swapfile

# Kalıcı yap
echo '/swapfile none swap sw 0 0' >> /etc/fstab

# Kontrol et
free -h
```

### Log Rotation
```bash
# Backend log rotation
cat > /etc/logrotate.d/aradakifark << EOF
/var/log/aradakifark/*.log {
    daily
    missingok
    rotate 7
    compress
    delaycompress
    notifempty
    create 0640 nginx nginx
}
EOF
```

---

## 📝 AlmaLinux vs Ubuntu Farkları

| Komut | Ubuntu | AlmaLinux 8 |
|-------|--------|-------------|
| Paket yöneticisi | apt | dnf/yum |
| Web server user | www-data | nginx |
| Firewall | ufw | firewalld |
| SELinux | Yok | Var (aktif) |
| Paket deposu | apt repos | EPEL, AppStream |

---

## 🆘 Acil Durumlar

### Tüm servisleri yeniden başlat
```bash
systemctl restart aradakifark-backend
systemctl restart nginx
```

### SELinux'u geçici olarak kapat (sadece test için)
```bash
setenforce 0
```

### Logları temizle
```bash
journalctl --vacuum-time=1d
```

### Port kullanımını kontrol et
```bash
netstat -tulpn | grep :8001
netstat -tulpn | grep :80
```

---

## ✅ Deployment Checklist (AlmaLinux 8)

- [ ] SSH ile VPS'e bağlandım
- [ ] Dosyaları /var/www/aradakifark dizinine yükledim
- [ ] MongoDB Atlas hesabı oluşturdum
- [ ] backend/.env dosyasını ayarladım
- [ ] frontend/.env dosyasını ayarladım
- [ ] almalinux-setup-server.sh çalıştırdım
- [ ] almalinux-deploy-app.sh çalıştırdım
- [ ] Firewall HTTP/HTTPS açık
- [ ] SELinux izinleri ayarlandı
- [ ] Site açıldı ve test ettim
- [ ] SSL sertifikası kurdum (opsiyonel)

---

## 📞 Yardım

Sorun yaşarsanız:
1. Logları kontrol edin: `journalctl -u aradakifark-backend -n 100`
2. SELinux kontrol edin: `ausearch -m avc -ts recent`
3. Firewall kontrol edin: `firewall-cmd --list-all`
4. Servis durumlarını kontrol edin

---

**AlmaLinux 8 için özel hazırlanmış bu kılavuzla siteniz sorunsuz çalışacak! 🚀**
