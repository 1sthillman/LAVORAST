# CACHE VE LOAD ANALİZİ

## Sorun: Silinen projeler refresh sonrası geri geliyor

### Olası Nedenler:

#### 1️⃣ **IndexedDB Cache'te eski kayıtlar var**
```javascript
// Console'da test et:
const checkCache = () => {
  const req = indexedDB.open('lavora', 5);
  req.onsuccess = (event) => {
    const db = event.target.result;
    const tx = db.transaction('cloudCache', 'readonly');
    const store = tx.objectStore('cloudCache');
    
    store.getAll().onsuccess = (e) => {
      const cached = e.target.result;
      const projects = cached.filter(x => x.kind === 'project');
      console.log('📦 IndexedDB cloudCache projects:', projects.length);
      projects.forEach(p => {
        console.log('  -', p.key, ':', p.payload?.name);
      });
    };
  };
};

checkCache();
```

#### 2️⃣ **`loadCloudProjectsPrivileged` cache'ten yüklüyor**
- Satır 2555-2565: Offline mode'da cache'ten yükler
- Satır 2575: `if(cp && sync && cachedProjectTs>=remoteProjectTs ...)` → Cache'teki proje remote'dan yeniyse cache kullanılır
- **PROBLEM:** Silinen proje cache'te varsa ve timestamp güncel görünüyorsa, Firebase'den kontrol edilmeden yüklenir!

#### 3️⃣ **`deleteProject` fonksiyonu cache'i temizlemiyor mu?**
Satır 2315-2318:
```javascript
await deleteStore('cloudCache',`${uid0}|project|${String(projectId)}`).catch(()=>{});
await deleteStore('cloudMeta',`${uid0}|snap|${String(projectId)}`).catch(()=>{});
```
✅ Cache temizliyor ANCAK sadece silinen proje için!

#### 4️⃣ **Duplicate projeler için cache temizlenmiyor**
- 8 duplicate proje var: mvyawkwi0br, mvybibeoadp, mvybo81hvrs, mvybpq5brz5, mvybzu45rrq, mvyd6neymx2, mvydik3vwkx, mvydxss7j2n
- Sadece 1 proje silmeye çalışıyorsun ama diğer 7 tanesi cache'te kalıyor!

### 🔧 ÇÖZÜM:

#### Hızlı Fix: Tüm cache'i temizle
```javascript
// Console'da çalıştır:
const clearAllCache = async () => {
  const req = indexedDB.open('lavora', 5);
  req.onsuccess = async (event) => {
    const db = event.target.result;
    const tx = db.transaction(['cloudCache', 'cloudQueue', 'cloudMeta'], 'readwrite');
    
    await tx.objectStore('cloudCache').clear();
    await tx.objectStore('cloudQueue').clear();
    await tx.objectStore('cloudMeta').clear();
    
    console.log('✅ Cache temizlendi');
    console.log('🔄 Şimdi sayfayı yenile (F5)');
  };
};

await clearAllCache();
```

#### Kalıcı Fix: Firebase'ten duplicate projeleri sil
Firebase Console'a git:
1. Database → orgs/lavora-main/projectIndex
2. 8 duplicate projeyi TEK TEK SİL
3. Aynısını projectPublic, projectFinancials, workflowStaff için yap

### Test:
1. Cache'i temizle
2. F5 ile refresh
3. Firebase'den güncel veri gelsin
4. Artık sadece gerçek projeler görülür
