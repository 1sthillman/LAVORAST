# 👥 LAVORA KULLANICI YÖNETİMİ REHBERİ

## 🎯 Özet

**Çalışan/Ortak/Müşteri eklemek için HTML'e DOKUNMANA GEREK YOK!**

Tüm kullanıcı yönetimi **Firebase Admin Panel'den** yapılıyor.

---

## 📋 Kullanıcı Rolleri

| Rol | Erişim | Açıklama |
|-----|--------|----------|
| **Admin** | ✓ Tüm veriler | Tek yönetici (hardcoded UID) |
| **Partner (Ortak)** | ✓ Projeler, Finansal, Defteri | Tam erişim (admin hariç) |
| **Employee (Çalışan)** | ✓ Projeler, İş Akışı | Finansal verilere erişemez |
| **Customer (Müşteri)** | ✓ Sadece kendi projeleri | Kısıtlı görünüm |
| **Pending** | ❌ Hiçbir şey | Onay bekliyor |
| **Disabled** | ❌ Devre dışı | Hesap kapatıldı |

---

## 🔐 Nasıl Çalışır?

### 1. **Kullanıcı İlk Kez Giriş Yapar (Google ile)**

```
Kullanıcı → Google Login
    ↓
Firebase Authentication → UID üretir
    ↓
readMembership(user) fonksiyonu çağrılır
    ↓
Firebase: /orgs/lavora-main/members/{UID} kontrol edilir
    ↓
Kayıt VAR mı?
    ├─ EVET → Rol ve status okunur → Uygulama açılır
    └─ HAYIR → role='pending', "Onay Bekliyor" ekranı gösterilir
```

### 2. **Admin Kullanıcıya Rol Atar**

```
Admin → "Bulut Butonu" tıklar
    ↓
Admin Panel açılır
    ↓
"Kullanıcılar" tab'ına gider
    ↓
Kullanıcı listesinde yeni girişi görür
    ↓
Dropdown'dan rol seçer:
    - Partner (Ortak)
    - Employee (Çalışan)
    - Customer (Müşteri)
    - Disabled (Devre dışı)
    ↓
"Rolü Kaydet" butonuna basar
    ↓
Firebase: /orgs/lavora-main/members/{UID} güncellenir
    ↓
Kullanıcı refresh yapar → Rolüne göre uygulama açılır!
```

---

## 🛠️ Admin Panel Kullanımı

### **Adım 1: Admin Olarak Giriş Yap**

1. Uygulamayı aç: `lavora-calisma-masasi-v38-firebase.html`
2. **Google ile giriş yap** (minifinise@gmail.com)
3. Admin UID'si kontrol edilir → Admin olarak giriş yaparsın

### **Adım 2: Admin Panel'i Aç**

1. Sağ üstte **"Bulut" butonu** var (cloud icon)
2. Tıkla → Admin Panel açılır

### **Adım 3: Kullanıcıları Görüntüle**

1. **"Kullanıcılar"** tab'ına tıkla
2. Tüm Google ile giriş yapmış kullanıcıları görürsün:
   ```
   ┌────────────────────────────────────────┐
   │ 👤 SEDAT DAĞLI                         │
   │    2sthillman@gmail.com                │
   │    UID: TPnq5vqzXiUfuwCsM8n9LXid1a92  │
   │                                        │
   │    Rol: [Çalışan ▼]  [Rolü Kaydet]    │
   └────────────────────────────────────────┘
   ```

### **Adım 4: Rol Ata**

1. Dropdown'dan rol seç:
   - **Partner** → Tüm projelere, finansal verilere erişir
   - **Employee** → Projelere ve iş akışına erişir (finansal yok)
   - **Customer** → Sadece kendine atanan projeleri görür
   - **Disabled** → Hesabı devre dışı bırak

2. **"Rolü Kaydet"** butonuna bas

3. ✅ Rol Firebase'e kaydedildi!

### **Adım 5: Kullanıcı Giriş Yapar**

1. Kullanıcı uygulamayı yeniler (F5)
2. Artık rolüne göre uygulama açılır! 🎉

---

## 🧪 Test Senaryoları

### **Senaryo 1: Yeni Çalışan Ekle**

1. **Yeni kullanıcı (örn: ahmet@firma.com):**
   - Google ile giriş yapar
   - "Onay Bekliyor" ekranı görür
   - UID'sini kopyalar (ekranda gösterilir)

2. **Admin:**
   - Admin Panel → Kullanıcılar
   - Ahmet'i listede görür
   - Rol: "Çalışan" seçer
   - "Rolü Kaydet" basar

3. **Ahmet:**
   - Sayfayı yeniler (F5)
   - Artık tüm projeleri görebilir! ✅
   - İş akışını düzenleyebilir
   - **Finansal verileri GÖREMEZ** (bu doğru!)

---

### **Senaryo 2: Ortak Ekle**

1. **Yeni kullanıcı (örn: mehmet@firma.com):**
   - Google ile giriş yapar
   - "Onay Bekliyor" ekranı görür

2. **Admin:**
   - Rol: "Partner (Ortak)" seçer
   - "Rolü Kaydet" basar

3. **Mehmet:**
   - Sayfayı yeniler
   - **TÜM verilere erişir:**
     - ✅ Projeler
     - ✅ Finansal veriler
     - ✅ Masraf defteri
     - ✅ Proje oluşturma/düzenleme/silme

---

### **Senaryo 3: Müşteri Ekle**

1. **Admin projede "Müşteri Erişim Kodu" oluşturur**
2. **Müşteri (örn: fatma@gmail.com):**
   - Google ile giriş yapar
   - Erişim kodunu girer
3. **Admin:**
   - Müşteri'yi "Customer" rolüne atar
4. **Fatma:**
   - Sayfayı yeniler
   - **Sadece kendine atanan projeleri görür**
   - Finansal/Defteri GÖREMEZ

---

## 🔥 Firebase Yapısı

### `/orgs/lavora-main/members/{UID}`

```json
{
  "role": "employee",        // "admin" | "partner" | "employee" | "customer" | "pending" | "disabled"
  "status": "active",        // "active" | "pending" | "disabled"
  "assignedBy": "KVpS...",   // Admin UID
  "assignedAt": 1793566000000,
  "updatedAt": 1793566000000
}
```

### `/userProfiles/{UID}`

```json
{
  "displayName": "Ahmet Yılmaz",
  "email": "ahmet@firma.com",
  "photoURL": "https://...",
  "createdAt": 1793566000000,
  "lastSeenAt": 1793566000000
}
```

---

## 🚀 Script ile Toplu Kullanıcı Ekleme

**Manuel yerine script ile:**

```bash
node add-test-employee.js
```

**Veya custom script:**

```javascript
// add-custom-users.js
const users = [
  { uid: 'user1-uid', email: 'ahmet@firma.com', role: 'employee', displayName: 'Ahmet Y.' },
  { uid: 'user2-uid', email: 'mehmet@firma.com', role: 'partner', displayName: 'Mehmet K.' }
];

// Firebase'e ekle
for (const user of users) {
  await db.ref(`orgs/lavora-main/members/${user.uid}`).set({
    role: user.role,
    status: 'active',
    assignedBy: 'ADMIN_UID',
    assignedAt: Date.now(),
    updatedAt: Date.now()
  });
}
```

---

## ⚠️ Önemli Notlar

### **1. Admin UID Hardcoded (Bu Doğru!)**

```javascript
"adminUid": "KVpS3osYEWY5nwToHVumK5Aw4M62"
```

**Neden?**
- Güvenlik! Admin değiştirilememeli
- Sadece 1 admin olmalı
- Database rules admin UID'sine bağlı

**Diğer kullanıcılar?**
- Firebase'den dinamik okunuyor ✅
- HTML'e gömülü DEĞİL ✅
- Admin panelden yönetiliyor ✅

---

### **2. Realtime Güncelleme**

**Admin rol atadığında:**
```javascript
// Satır 2978-2980
profileRef.on('child_changed', userHandler);
```

**Yani:**
- Admin rol atar → Firebase güncellenir
- Diğer kullanıcılar **ANINDA** bilgilendirilir
- **Refresh gerekmez!** (ama ilk rollendirmede gerekir)

---

### **3. Database Rules Koruması**

**Örnek: Çalışan finansal verilere erişemez**

```json
"projectFinancials": {
  "$projectId": {
    ".read": "auth != null && (
      root.child('system/admins/' + auth.uid).exists() || 
      (root.child('orgs').child($orgId).child('members').child(auth.uid).child('role').val() === 'partner')
    )"
  }
}
```

**Yani:**
- Çalışan `projectFinancials` path'ini okuyamaz
- Sadece Admin ve Partner erişebilir
- Güvenlik Firebase tarafında! ✅

---

## 📊 Mevcut Kullanıcılar (Test)

| Kullanıcı | Email | UID | Rol |
|-----------|-------|-----|-----|
| Sedat Dağlı | minifinise@gmail.com | `KVpS3osYEWY5nwToHVumK5Aw4M62` | Admin |
| SEDAT DAĞLI | 2sthillman@gmail.com | `TPnq5vqzXiUIwwCsM8n9LXid1a92` | Employee |
| Test Çalışan | 2sthillman@gmail.com | `TPnq5vqzXiUfuwCsM8n9LXid1a92` | Employee |
| Ortak 1 | ortak1@test.com | `test-partner-001` | Partner |
| Çalışan 1 | calisan1@test.com | `test-employee-001` | Employee |
| Müşteri 1 | musteri1@test.com | `test-customer-001` | Customer |

---

## ✅ Sonuç

**SİSTEM TAM ÇALIŞIYOR!**

1. ✅ Admin HTML'de hardcoded (güvenlik)
2. ✅ Diğer kullanıcılar Firebase'den dinamik
3. ✅ Admin Panel'den rol yönetimi
4. ✅ Realtime güncelleme
5. ✅ Database rules koruması
6. ✅ Çalışan/Ortak/Müşteri rolleri çalışıyor

**Yapman gereken:**
1. Admin olarak giriş yap
2. "Bulut" butonuna bas
3. "Kullanıcılar" tab'ına git
4. Rol ata, kaydet
5. Kullanıcı refresh atsın → ÇALIŞIYOR! 🎉

---

Generated: ${new Date().toISOString()}
