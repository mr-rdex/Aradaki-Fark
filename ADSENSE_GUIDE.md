# Google AdSense Entegrasyonu Kılavuzu

## Reklam Alanları Nereye Eklendi?

Sitenizde **toplam 9 stratejik konumda** reklam alanları oluşturuldu:

### 1. Anasayfa (HomePage.js) - 3 Reklam Alanı
- **Konum 1**: Son görüntülenen araçların üstü (eğer kullanıcı araç görüntülemişse)
- **Konum 2**: "En Popüler Araçlar" bölümünün üstü
- **Konum 3**: "En İyi Araçlar" bölümünün üstü
- **Format**: Leaderboard (728x90)

### 2. Araç Detay Sayfası (CarDetailPage.js) - 1 Reklam Alanı
- **Konum**: Teknik Özelliklerin hemen üstü
- **Format**: Leaderboard (728x90)

### 3. Karşılaştırma Sonuç Sayfası (ComparePage.js) - 2 Reklam Alanı
- **Konum 1**: Sayfa başlığının altı
- **Konum 2**: Araç fotoğraflarının altı
- **Format**: Leaderboard (728x90)

### 4. Tüm Araçlar Sayfası (AllCarsPage.js) - 1 Reklam Alanı
- **Konum**: Sayfa başında, "Tüm Araçlar" başlığından önce
- **Format**: Leaderboard (728x90)

### 5. Forum Sayfası (ForumPage.js) - 1 Reklam Alanı
- **Konum**: Kategorilerin hemen altı, konu listesinin üstü
- **Format**: Leaderboard (728x90)

### 6. Popüler Karşılaştırmalar Sayfası (PopularComparisonsPage.js) - 1 Reklam Alanı
- **Konum**: Sayfa başında, başlıktan önce
- **Format**: Leaderboard (728x90)

---

## Google AdSense Nasıl Entegre Edilir?

### Adım 1: Google AdSense Hesabı Oluşturun
1. [Google AdSense](https://www.google.com/adsense/) sitesine gidin
2. Hesap oluşturun ve sitenizi ekleyin
3. Onay bekleyin (birkaç gün sürebilir)

### Adım 2: AdSense Kodunu HTML'e Ekleyin

`/app/frontend/public/index.html` dosyasını açın ve `<head>` bölümüne AdSense scriptini ekleyin:

```html
<head>
  <!-- Diğer scriptler... -->
  
  <!-- Google AdSense Script -->
  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-XXXXXXXXXXXXXXXX"
       crossorigin="anonymous"></script>
</head>
```

**Not:** `ca-pub-XXXXXXXXXXXXXXXX` kısmını kendi AdSense Publisher ID'niz ile değiştirin.

### Adım 3: Reklam Birimlerini Oluşturun

1. AdSense hesabınızda "Reklamlar" > "Reklam Birimleri"ne gidin
2. 3 adet "Display Ad" (Görüntülü Reklam) birimi oluşturun:
   - **Anasayfa Reklam** (Leaderboard - 728x90)
   - **Araç Detay Reklam** (Leaderboard - 728x90)
   - **Karşılaştırma Reklam** (Leaderboard - 728x90)
3. Her biri için bir **Ad Slot ID** alacaksınız

### Adım 4: Reklam Slot ID'lerini Ekleyin

#### 1. AdSlot Component'ini Güncelleyin

`/app/frontend/src/components/AdSlot.js` dosyasını açın ve **15. satırda** bulunan kendi Publisher ID'nizi ekleyin:

```javascript
data-ad-client="ca-pub-1234567890123456" // ← Buraya kendi ID'nizi yazın
```

#### 2. Her Sayfadaki Reklam Alanına Slot ID Ekleyin

**HomePage.js** (Satır ~115):
```jsx
<AdSlot slot="1111111111" />  // ← AdSense'den aldığınız Slot ID
```

**CarDetailPage.js** (Satır ~226):
```jsx
<AdSlot slot="2222222222" />  // ← AdSense'den aldığınız Slot ID
```

**ComparePage.js** (Satır ~236):
```jsx
<AdSlot slot="3333333333" />  // ← AdSense'den aldığınız Slot ID
```

### Adım 5: Frontend'i Yeniden Başlatın

```bash
sudo supervisorctl restart frontend
```

---

## Test Etme

AdSense reklamlarının görünmesi **birkaç saat** sürebilir. Test modu için:

1. AdSense hesabınızda "Test Ads" özelliğini aktifleştirin
2. Tarayıcınızda siteyi inceleyin
3. Reklam alanlarını kontrol edin

---

## Reklam Performansını İzleme

- AdSense kontrol panelinden reklam performansını takip edin
- Hangi sayfalarda daha fazla tıklama aldığını görün
- Gerekirse reklam konumlarını optimize edin

---

## Ek Reklam Alanı Eklemek İsterseniz

Başka sayfalara da reklam eklemek için:

```jsx
import AdSlot from '../components/AdSlot';

// Sayfanızda istediğiniz yere ekleyin:
<AdSlot slot="YENI_SLOT_ID" />
```

---

## Sorun Giderme

### Reklamlar Görünmüyor
- Publisher ID ve Slot ID'lerin doğru olduğundan emin olun
- AdSense hesabınızın onaylandığından emin olun
- Tarayıcı konsolunda hata olup olmadığını kontrol edin
- Ad blocker kapalı olduğundan emin olun

### Reklamlar Yavaş Yükleniyor
- AdSense scriptinin `async` olduğundan emin olun
- Sayfa yükleme hızını optimize edin

---

## Önemli Notlar

⚠️ **AdSense Politikalarına Uyun:**
- Kendi reklamlarınıza tıklamayın
- Reklamları manipüle etmeyin
- İçerik politikalarına uygun içerik üretin

✅ **Mobil Uyumlu:**
- Reklamlar otomatik olarak responsive
- `data-full-width-responsive="true"` ayarı aktif

✅ **Dark Mode Uyumlu:**
- Reklam konteynerleri dark mode'a uyumlu
- Kenarlık ve arka plan renkleri otomatik ayarlanır

---

## İletişim

Sorularınız için: info@aradakifark.com
