# 📦 VPS Deployment Paket İçeriği

## Dosyalar

### Deployment Scriptleri
- **01-setup-server.sh** - VPS'te gerekli tüm yazılımları kurar
- **02-deploy-app.sh** - Uygulamayı deploy eder ve servisleri başlatır
- **backup.sh** - Otomatik backup scripti

### Yapılandırma Dosyaları
- **backend.env.example** - Backend environment variables şablonu
- **frontend.env.example** - Frontend environment variables şablonu

### Dokümantasyon
- **DEPLOYMENT_GUIDE.md** - Detaylı deployment kılavuzu (15+ sayfa)
- **QUICKSTART.md** - Hızlı başlangıç (5 adım)
- **README.md** - Bu dosya

---

## 🚀 Hızlı Başlangıç

### Ön Hazırlık (Yerel Bilgisayarınızda)

1. **VPS Deployment klasörünü VPS'e yükleyin:**
   ```bash
   scp -r /app/vps-deployment root@YOUR_VPS_IP:/root/
   scp -r /app/backend root@YOUR_VPS_IP:/var/www/aradakifark/
   scp -r /app/frontend root@YOUR_VPS_IP:/var/www/aradakifark/
   ```

2. **MongoDB Atlas'ı hazırlayın:**
   - https://mongodb.com/cloud/atlas/register
   - FREE cluster oluşturun
   - Connection string alın

### VPS'te Deployment

1. **VPS'e bağlanın:**
   ```bash
   ssh root@YOUR_VPS_IP
   ```

2. **Environment variables ayarlayın:**
   ```bash
   cd /var/www/aradakifark/backend
   nano .env
   # MongoDB Atlas connection string'inizi ekleyin
   
   cd /var/www/aradakifark/frontend
   nano .env
   # REACT_APP_BACKEND_URL=http://your-domain.com
   ```

3. **Deployment scriptlerini çalıştırın:**
   ```bash
   cd /root/vps-deployment
   sudo bash 01-setup-server.sh
   sudo bash 02-deploy-app.sh
   ```

4. **Test edin:**
   - http://your-domain.com veya http://YOUR_VPS_IP

---

## 📋 Sistem Gereksinimleri

### VPS
- ✅ 1 CPU
- ✅ 512 MB RAM (MongoDB Atlas kullanıldığı için)
- ✅ 20 GB SSD
- ✅ Ubuntu 20.04/22.04
- ✅ Root erişimi

### Harici Servisler
- MongoDB Atlas (ücretsiz 512MB)
- Domain adı (opsiyonel)

---

## 📚 Detaylı Dokümantasyon

- **Yeni Başlayanlar:** `QUICKSTART.md` okuyun (5 dakika)
- **Detaylı Kurulum:** `DEPLOYMENT_GUIDE.md` okuyun (30 dakika)

---

## 🔧 Deployment Sonrası

### Servis Yönetimi
```bash
# Backend restart
sudo systemctl restart aradakifark-backend

# Nginx restart
sudo systemctl restart nginx

# Logları izle
sudo journalctl -u aradakifark-backend -f
```

### SSL Sertifikası (HTTPS)
```bash
sudo apt install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com -d www.your-domain.com
```

### Otomatik Backup
```bash
# Cron job ekle
crontab -e

# Şu satırı ekleyin (her gece saat 02:00):
0 2 * * * /var/www/aradakifark/vps-deployment/backup.sh >> /var/log/backup.log 2>&1
```

---

## ⚠️ Önemli Notlar

1. **MongoDB Atlas Bağlantısı:**
   - Connection string'de şifrenizde özel karakter varsa URL encode edin
   - Network Access'te VPS IP'nizi veya 0.0.0.0/0 ekleyin

2. **Domain Ayarları:**
   - DNS yayılması 5-30 dakika sürebilir
   - A Record: @ → VPS IP
   - A Record: www → VPS IP

3. **Güvenlik:**
   - Firewall aktif edin (UFW)
   - SSH root login kapatın
   - JWT_SECRET değiştirin
   - CORS ayarlarını production'a göre güncelleyin

4. **RAM Optimizasyonu:**
   - MongoDB Atlas kullanıldığı için 512MB RAM yeterli
   - Swap memory gerekirse eklenebilir

---

## 🆘 Sorun Giderme

### Backend başlamıyor
```bash
sudo journalctl -u aradakifark-backend -n 50
```

### Nginx 502 Bad Gateway
```bash
sudo systemctl status aradakifark-backend
sudo systemctl start aradakifark-backend
```

### MongoDB bağlantı hatası
- Connection string'i kontrol edin
- MongoDB Atlas Network Access ayarlarını kontrol edin

---

## 📞 Destek

- **Detaylı Kılavuz:** `DEPLOYMENT_GUIDE.md`
- **Hızlı Başlangıç:** `QUICKSTART.md`
- **Logları İnceleyin:** `sudo journalctl -u aradakifark-backend -f`

---

## ✅ Checklist

Deployment öncesi kontrol listesi:

- [ ] MongoDB Atlas hesabı oluşturuldu
- [ ] Database user oluşturuldu
- [ ] Network Access ayarlandı
- [ ] Connection string alındı
- [ ] VPS'e SSH ile bağlanıldı
- [ ] Uygulama dosyaları VPS'e yüklendi
- [ ] backend/.env dosyası yapılandırıldı
- [ ] frontend/.env dosyası yapılandırıldı
- [ ] Domain DNS ayarları yapıldı (opsiyonel)
- [ ] 01-setup-server.sh çalıştırıldı
- [ ] 02-deploy-app.sh çalıştırıldı
- [ ] Site test edildi
- [ ] SSL sertifikası kuruldu (opsiyonel)
- [ ] Backup cronjob eklendi (opsiyonel)

---

## 🎉 Deployment Başarılı!

Tebrikler! Siteniz artık canlı.

**Sonraki Adımlar:**
- Google Analytics ekleyin
- Google AdSense entegre edin (slot ID'leri güncelleyin)
- Monitoring kurun (UptimeRobot)
- Backup stratejisi oluşturun

İyi çalışmalar! 🚀
