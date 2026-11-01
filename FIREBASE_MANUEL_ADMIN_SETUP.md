# 🔥 Firebase Manuel Admin Setup - ADIM ADIM

## ⚠️ ÖNEMLİ: Bu Adımları Sırayla Takip Et!

Firebase Console'da **iki kayıt** eklemeniz gerekiyor.

---

## ADIM 1: System Admins Kaydı Ekle

### 1.1 Firebase Console'a Git
```
https://console.firebase.google.com/project/design-ac717/database/design-ac717-default-rtdb/data
```

### 1.2 Root'ta "system" Node'u Oluştur (Yoksa)

- Sol tarafta `/` (root) seçili olmalı
- Sağ üstteki **"+"** butonuna tıkla
- **Name:** `system`
- **Value:** (boş bırak, object olacak)
- **Add** butonuna tıkla

### 1.3 "system" Altına "admins" Ekle

- Sol tarafta `/system` node'una tıkla
- Sağ üstteki **"+"** butonuna tıkla
- **Name:** `admins`
- **Value:** (boş bırak, object olacak)
- **Add** butonuna tıkla

### 1.4 Admin UID'sini Ekle

- Sol tarafta `/system/admins` node'una tıkla
- Sağ üstteki **"+"** butonuna tıkla
- **Name:** `KVpS3osYEWY5nwToHVumK5Aw4M62`
- **Value:** (boş bırak, object olacak)
- **Add** butonuna tıkla

### 1.5 "status" Field'ını Ekle

- Sol tarafta `/system/admins/KVpS3osYEWY5nwToHVumK5Aw4M62` node'una tıkla
- Sağ üstteki **"+"** butonuna tıkla
- **Name:** `status`
- **Value:** `active`
- **Add** butonuna tıkla

### 1.6 "addedAt" Field'ını Ekle (Opsiyonel)

- Yine aynı node'da **"+"** butonuna tıkla
- **Name:** `addedAt`
- **Value:** `1730419200000` (herhangi bir timestamp)
- **Add** butonuna tıkla

### ✅ Sonuç:

```
/system/admins/KVpS3osYEWY5nwToHVumK5Aw4M62
  ├── status: "active"
  └── addedAt: 1730419200000
```

---

## ADIM 2: Organization Member Kaydını Kontrol Et

### 2.1 Member Kaydını Bul
```
https://console.firebase.google.com/project/design-ac717/database/design-ac717-default-rtdb/data/orgs/lavora-main/members/KVpS3osYEWY5nwToHVumK5Aw4M62
```

### 2.2 Kontrol Et

Eğer kayıt **VAR** ve şu şekildeyse **DEVAM ET** (değiştirme):
```json
{
  "role": "admin",
  "status": "active"
}
```

Eğer kayıt **YOK** veya **FARKLI** ise:

1. `/orgs/lavora-main/members` node'una git
2. **"+"** butonuna tıkla
3. **Name:** `KVpS3osYEWY5nwToHVumK5Aw4M62`
4. **Value:** (boş bırak, object olacak)
5. **Add** butonuna tıkla

6. UID node'unun içine:
   - **Name:** `role` → **Value:** `admin`
   - **Name:** `status` → **Value:** `active`
   - **Name:** `assignedAt` → **Value:** `1730419200000`
   - **Name:** `updatedAt` → **Value:** `1730419200000`

### ✅ Sonuç:

```
/orgs/lavora-main/members/KVpS3osYEWY5nwToHVumK5Aw4M62
  ├── role: "admin"
  ├── status: "active"
  ├── assignedAt: 1730419200000
  └── updatedAt: 1730419200000
```

---

## ADIM 3: Doğrulama

### 3.1 System Admin Kontrolü

Firebase Console → Realtime Database → Data:
```
/system/admins/KVpS3osYEWY5nwToHVumK5Aw4M62
```

Görmeli:
```json
{
  "status": "active",
  "addedAt": 1730419200000
}
```

### 3.2 Member Kontrolü

```
/orgs/lavora-main/members/KVpS3osYEWY5nwToHVumK5Aw4M62
```

Görmeli:
```json
{
  "role": "admin",
  "status": "active",
  "assignedAt": 1730419200000,
  "updatedAt": 1730419200000
}
```

---

## ADIM 4: Test Et!

### 4.1 Sayfayı Yenile
- Tarayıcıda **Ctrl + Shift + R** bas (hard refresh)
- Veya F12 → Console'da: `location.reload(true)`

### 4.2 Tekrar Giriş Yap
- Google hesabınla (minifinise@gmail.com) tekrar giriş yap

### 4.3 Console'u İzle
- F12 → Console sekmesi
- Network sekmesi

### 4.4 Proje Yükle
- Yeni bir proje yükle (Excel ile)
- Console'da şunu görmeli:
  ```
  🔑 SENIN FIREBASE UID'N: KVpS3osYEWY5nwToHVumK5Aw4M62
  ⚠️ UID'ler eşleşiyor mu? ✅ EVET
  ```

### 4.5 Başarı Kriterleri

✅ Console'da **permission_denied hatası YOK**  
✅ `[Lavora] Excel görselleri ürünlere eklendi: X` mesajı var  
✅ `[Lavora] Proje kaydedildi` mesajı var  
✅ Network sekmesinde Firebase PUT istekleri **200 OK**  
✅ Refresh sonrası proje **kaybolmuyor**

---

## 🐛 Sorun Giderme

### Hala permission_denied Alıyorsan:

#### 1. Console'da UID'yi Kontrol Et
F12 → Console:
```javascript
console.log('Current UID:', firebase.auth().currentUser.uid);
console.log('Expected UID:', 'KVpS3osYEWY5nwToHVumK5Aw4M62');
```

İki UID **AYNI** olmalı!

#### 2. System Admin Kaydını Test Et
```javascript
firebase.database().ref('/system/admins/KVpS3osYEWY5nwToHVumK5Aw4M62').once('value')
  .then(snap => console.log('System Admin:', snap.val()))
```

Sonuç: `{status: "active", ...}` görmeli

#### 3. Member Kaydını Test Et
```javascript
firebase.database().ref('/orgs/lavora-main/members/KVpS3osYEWY5nwToHVumK5Aw4M62').once('value')
  .then(snap => console.log('Member:', snap.val()))
```

Sonuç: `{role: "admin", status: "active", ...}` görmeli

#### 4. Write Test Et
```javascript
firebase.database().ref('/orgs/lavora-main/workflowStaff/test123').set({
  items: {},
  stages: {},
  updatedAt: Date.now(),
  dueDate: ''
})
.then(() => console.log('✅ WRITE SUCCESS'))
.catch(e => console.error('❌ WRITE FAILED:', e))
```

Bu başarılı olmalı!

---

## 📸 Ekran Görüntüleri Rehberi

### Adım 1: Root'a System Ekle
![](Root → + button → Name: system)

### Adım 2: System'a Admins Ekle
![](system → + button → Name: admins)

### Adım 3: Admins'a UID Ekle
![](admins → + button → Name: KVpS3osYEWY5nwToHVumK5Aw4M62)

### Adım 4: UID'ye Status Ekle
![](UID → + button → Name: status, Value: active)

### Sonuç:
```
┌─ /
│  └─ system
│     └─ admins
│        └─ KVpS3osYEWY5nwToHVumK5Aw4M62
│           ├─ status: "active"
│           └─ addedAt: 1730419200000
│
└─ orgs
   └─ lavora-main
      └─ members
         └─ KVpS3osYEWY5nwToHVumK5Aw4M62
            ├─ role: "admin"
            └─ status: "active"
```

---

## ✅ Başarı Mesajı

Eğer her şey doğru yapıldıysa:

1. ✅ Console'da UID eşleşmesi mesajı görürsün
2. ✅ permission_denied hatası OLMAZ
3. ✅ Projeler yüklenip kaydedilir
4. ✅ Refresh sonrası projeler kaybolmaz
5. ✅ Excel görselleri başarıyla eklenir

---

**ÖNEMLI NOT:** Database Rules'u da deploy etmeyi unutma!  
→ `database.rules.json` dosyasını Firebase Console → Rules sekmesine yapıştır ve Publish et!

---

Manuel setup bittikten sonra test sonuçlarını paylaş!
