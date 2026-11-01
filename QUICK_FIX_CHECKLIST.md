# ✅ HIZLI ÇÖZÜM CHECKLIST

## Sorun
Admin proje yüklüyor ama refresh sonrası kayboluyor.  
Console hatası: `permission_denied`

## Root Cause
`/system/admins/KVpS3osYEWY5nwToHVumK5Aw4M62` kaydı Firebase'de YOK!

---

## 🔧 FIX ADIMLARI

### 1️⃣ Database Rules Güncelle (YAPILDI ✅)
- `database.rules.json` dosyası güncellendi
- `.exists()` → `.child('status').val() === 'active'` değiştirildi
- workflowStaff, media rules düzeltildi

### 2️⃣ Firebase Console'da Admin Kaydı Ekle (ŞİMDİ YAP!)

https://console.firebase.google.com/project/design-ac717/database/design-ac717-default-rtdb/data

**Eklenecek:**
```
/system/admins/KVpS3osYEWY5nwToHVumK5Aw4M62
  └── status: "active"
```

**Nasıl:**
1. Root'ta "system" node'u yoksa oluştur
2. "system" altına "admins" ekle
3. "admins" altına `KVpS3osYEWY5nwToHVumK5Aw4M62` ekle
4. UID altına `status: "active"` ekle

### 3️⃣ Database Rules Deploy Et

https://console.firebase.google.com/project/design-ac717/database/design-ac717-default-rtdb/rules

1. `database.rules.json` dosyasının tamamını kopyala
2. Firebase Console Rules sekmesine yapıştır
3. "Publish" butonuna tıkla

### 4️⃣ Test Et

1. Ctrl+Shift+R ile sayfayı yenile
2. Tekrar giriş yap (minifinise@gmail.com)
3. Proje yükle
4. Console'da:
   - ✅ `UID'ler eşleşiyor mu? ✅ EVET` görmeli
   - ❌ `permission_denied` OLMAMALI
5. Refresh at → Proje kaybolmamalı!

---

## 📋 Kontrol Listesi

- [x] database.rules.json güncellendi
- [ ] /system/admins/UID kaydı Firebase'e eklendi
- [ ] Database Rules Firebase'e deploy edildi
- [ ] Sayfa yenilendi
- [ ] Test projesi yüklendi
- [ ] permission_denied hatası YOK
- [ ] Refresh sonrası proje kaldı ✅

---

## 🆘 Acil Yardım

Hala sorun varsa Console'da çalıştır:

```javascript
// 1. UID kontrolü
console.log('UID:', firebase.auth().currentUser.uid);

// 2. System admin kontrolü
firebase.database().ref('/system/admins/KVpS3osYEWY5nwToHVumK5Aw4M62').once('value')
  .then(s => console.log('System Admin:', s.val()));

// 3. Member kontrolü
firebase.database().ref('/orgs/lavora-main/members/KVpS3osYEWY5nwToHVumK5Aw4M62').once('value')
  .then(s => console.log('Member:', s.val()));

// 4. Write testi
firebase.database().ref('/orgs/lavora-main/workflowStaff/test').set({
  items: {}, stages: {}, updatedAt: Date.now()
})
.then(() => console.log('✅ WRITE OK'))
.catch(e => console.error('❌ FAILED:', e.message));
```

---

Detaylı talimatlar: `FIREBASE_MANUEL_ADMIN_SETUP.md`
