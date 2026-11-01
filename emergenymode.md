# 🚨 EMERGENCY ENGINEERING MODE
# FULL PROJECT FORENSIC AUDIT — FIREBASE — INDEXEDDB — GITHUB PAGES — DATA PERSISTENCE

Sen artık bu projede Senior Full-Stack Engineer, Firebase Architect, Database Engineer, Security Engineer, Performance Engineer ve QA Automation Engineer olarak çalışıyorsun.

Bu görev basit bir hata düzeltme değildir. Projenin tamamını incelemeni, veri akışını analiz etmeni, bütün mantık hatalarını bulmanı, gerçek sorunların kök nedenlerini tespit etmeni ve kontrollü biçimde düzeltmeni istiyorum.

## 1. EN ÖNEMLİ PROBLEMİMİZ

Şu anda uygulamada yeni proje oluşturabiliyoruz.

Oluşturma işlemi başarılı görünüyor. Ancak sayfayı REFRESH yaptığımızda oluşturduğumuz proje kayboluyor.

ÖNEMLİ AYRIM:

- Proje oluşturma işlemi çalışıyor.
- Proje silme işlemi çalışıyor.
- Ancak oluşturulan projenin refresh sonrasında kaybolması sorunu var.
- Bu durumun nedenini kesin olarak bulmanı istiyorum.
- Sadece bu soruna odaklanma. Projede başka görünmeyen hatalar da olabilir.

**AMAÇ: Uygulamanın tüm veri yaşam döngüsünü güvenilir hâle getirmek.**

Bir proje oluşturulduğunda:
1. Doğru verinin oluşturulması.
2. Verinin doğru yere kaydedilmesi.
3. Sunucuya gerçekten yazılması.
4. Arayüzde gösterilmesi.
5. Sayfa yenilendiğinde tekrar okunması.
6. Tarayıcı kapatılıp açıldığında korunması.
7. Başka bir oturumda doğru kullanıcıya gösterilmesi.

Bütün bu zinciri kontrol et.

---

# 2. PROJEYİ ASLA BOZMA

Mevcut projenin mimarisini, tasarımını ve çalışma mantığını koru.

Şunları kesinlikle yapma:

- Projeyi sıfırdan yazma.
- Bütün HTML dosyalarını yeniden oluşturma.
- Çalışan JavaScript fonksiyonlarını gereksiz yere değiştirme.
- CSS tasarımını değiştirme.
- Mevcut özellikleri kaldırma.
- Firebase projesini değiştirme.
- Veritabanını sıfırlama.
- Kullanıcı verilerini silme.
- Mevcut veri yollarını gerekçesiz değiştirme.
- Çalışan upload ve delete sistemini bozma.
- Sırf kodu daha güzel göstermek için büyük refactoring yapma.
- Kullanıcı değişikliklerini ezme.

Her değişikliğin bir gerekçesi olmalı.

Minimum müdahale, maksimum güvenilirlik prensibiyle çalış.

Mevcut sistemin çalışan parçalarını koru.

---

# 3. TÜM PROJEYİ BAŞTAN SONA İNCELE

Önce proje klasör yapısını çıkar.

Hiçbir dosyayı atlama.

Aşağıdakilerin tamamını kontrol et:

- HTML
- CSS
- JavaScript
- JSON
- Firebase config
- Database Rules
- Storage Rules
- Authentication
- API bağlantıları
- NPM yapılandırmaları
- package.json
- package-lock.json
- vite.config.js
- GitHub Actions
- GitHub Pages yapılandırması
- Router
- State management
- IndexedDB
- localStorage
- sessionStorage
- Cache mekanizmaları
- Service Worker
- Manifest
- Modüller
- Yardımcı fonksiyonlar
- Build ve deployment dosyaları

Bütün HTML dosyalarını başından sonuna kadar oku.

HTML içindeki inline JavaScript kodlarını da incele.

JavaScript modüllerinin tamamını oku.

Bir dosyayı yalnızca birkaç satırına bakarak değerlendirme.

Dosyalar büyükse parçalara ayırarak tamamını oku ve ilerlemeyi kaydet.

Her dosyanın:

- Görevini.
- Bağımlılıklarını.
- Çağırdığı fonksiyonları.
- Kendisine bağlı fonksiyonları.
- Veri akışını.
- Firebase bağlantılarını.
- Hata ihtimallerini.

incele.

Bir dosyaya erişemiyorsan bunu açıkça bildir.

**Okumadığın dosyayı okunmuş gibi gösterme.**

İnceleme tamamlanmadan projeyi sağlıklı ilan etme.

---

# 4. INDEXEDDB — ÖZEL VE DERİN DENETİM

IndexedDB kullanımını özellikle araştır.

Projenin IndexedDB kullanıp kullanmadığını belirle.

Kullanılıyorsa:

- Hangi dosyalarda kullanılıyor?
- Hangi veriler burada saklanıyor?
- Veritabanı nasıl oluşturuluyor?
- Object Store yapısı nasıl?
- Transaction yönetimi doğru mu?
- Veriler doğru zamanda commit ediliyor mu?
- Transaction hataları yakalanıyor mu?
- Version upgrade işlemleri doğru mu?
- Eski şema ile yeni şema uyumlu mu?
- Aynı verinin hem IndexedDB hem Firebase'de tutulması çakışma yaratıyor mu?
- Refresh sonrasında eski IndexedDB verisi yeni Firebase verisinin üzerine yazılıyor mu?
- Boş IndexedDB verisi gerçek Firebase kayıtlarını siliyor mu?
- IndexedDB'deki geçici veriler kalıcı veri gibi mi kullanılıyor?
- Birden fazla sekme arasında çakışma oluşuyor mu?
- Browser storage erişim hataları doğru yönetiliyor mu?
- Safari, Chrome ve farklı tarayıcılarda sorun çıkarabilecek işlemler var mı?

### INDEXEDDB KARAR PROTOKOLÜ

IndexedDB'nin mutlaka kaldırılmasını istemiyorum.

Ancak mevcut kullanımında veri kaybına, çakışmaya veya refresh sorununa neden olan bir yapı varsa bunu düzeltmeni istiyorum.

Şu karar ağacını uygula:

**DURUM A:** IndexedDB gerekli ve doğru çalışıyor.

Koru. Gereksiz değişiklik yapma.

**DURUM B:** IndexedDB hatalı kullanılıyor.

Kök nedenini bul ve minimum müdahaleyle düzelt.

**DURUM C:** IndexedDB gereksiz, çakışma yaratıyor veya uygulamanın veri mimarisine zarar veriyor.

Önce hangi özelliklerin ona bağımlı olduğunu belirle. Ardından güvenli geçiş planı oluştur. Verileri ve çalışan özellikleri koruyarak kaldır.

**DURUM D:** Firebase'in kendi IndexedDB cache mekanizması kullanılıyor.

Bunu uygulamanın kendi IndexedDB veri deposuyla karıştırma.

Firebase SDK'nın dahili cache'ini sırf isim olarak IndexedDB içeriyor diye kaldırma.

Firebase'in kendi cache mekanizması ile uygulamanın oluşturduğu IndexedDB yapısını ayrı ayrı değerlendir.

ÖNEMLİ: IndexedDB'yi kaldırmak tek başına kalıcı veri sorununu çözmez. Verilerin asıl kalıcı kaynağı doğru şekilde belirlenmeli.

---

# 5. FIREBASE — UÇTAN UCA VERİ DOĞRULAMA

Önce kullanılan Firebase ürününü belirle:

- Realtime Database
- Cloud Firestore
- Firebase Storage
- Firebase Authentication

Kullanılmayan Firebase ürünleri hakkında varsayım yapma.

Aşağıdaki dosyayı eksiksiz incele:

`C:\lavoraworklow\database.rules.json`

### Firebase bağlantısı

- Firebase config doğru mu?
- Project ID doğru mu?
- Database URL doğru mu?
- Storage bucket doğru mu?
- SDK sürümleri uyumlu mu?
- Birden fazla initializeApp var mı?
- Farklı dosyalarda farklı Firebase instance kullanılıyor mu?
- Yanlış environment değişkeni okunuyor mu?
- Local ve production yapılandırmaları karışmış mı?

### Veri oluşturma

- Proje oluşturma fonksiyonu doğru mu?
- Doğru Firebase referansına yazıyor mu?
- Yazma işlemi await ile bekleniyor mu?
- Promise sonucu doğru değerlendiriliyor mu?
- Hata olsa bile başarılı mesajı gösteriliyor mu?
- set, push, update, addDoc, setDoc işlemleri doğru mu?
- Yanlışlıkla mevcut verilerin üzerine yazılıyor mu?
- ID üretimi tutarlı mı?
- Oluşturulan proje için kalıcı ID saklanıyor mu?

### Veri okuma

- Sayfa açıldığında gerçek Firebase verileri çekiliyor mu?
- Doğru database path kullanılıyor mu?
- Auth state bekleniyor mu?
- Veriler yüklenmeden boş state uygulanıyor mu?
- Firebase cevabı doğru parse ediliyor mu?
- Listener doğru yerde kuruluyor mu?
- Listener gereksiz yere kaldırılıyor mu?
- Hatalı filtreleme nedeniyle projeler gizleniyor mu?
- State güncellemesi eski veriyi eziyor mu?

### Veri senkronizasyonu

Aynı proje için Firebase, IndexedDB, localStorage ve uygulama state'i arasında çakışma var mı?

Veri kaynağı önceliğini belirle.

Firebase'de mevcut bir kayıt varsa boş bir local cache nedeniyle kaybolmasına izin verme.

Bir veri kaynağındaki boş sonuç diğer kaynaklardaki gerçek veriyi otomatik silmemeli.

### Silme

Silme işlemini de koruyarak denetle.

- Doğru kayıt mı siliniyor?
- Sadece arayüzden mi kaldırılıyor?
- Storage dosyaları ile metadata uyumlu mu?
- Silme sonrası tekrar yükleme doğru mu?
- Aynı anda birden fazla silme güvenli mi?

---

# 6. GITHUB PAGES — PRODUCTION ORTAMINI DERİNLEMESİNE İNCELE

Projemiz GitHub Pages üzerinde yayınlanıyor.

Bu nedenle localhost'ta çalışıp GitHub Pages'te bozulan işlemleri özellikle araştır.

GitHub Pages kaynaklı sorunların olup olmadığını doğrula.

### Kontrol edilecek konular

1. Vite base path.
2. vite.config.js.
3. import.meta.env.BASE_URL.
4. Relative ve absolute asset yolları.
5. JavaScript module yolları.
6. CSS yolları.
7. Firebase config environment değişkenleri.
8. GitHub Actions workflow.
9. Build çıktısı.
10. dist klasörü.
11. index.html konumu.
12. SPA routing.
13. Direct URL erişimi.
14. Refresh sonrası 404.
15. Büyük/küçük harf duyarlı dosya yolları.
16. Yanlış import path.
17. Eksik asset.
18. Yanlış public path.
19. Service Worker cache.
20. Eski deployment dosyaları.
21. Production ve development davranış farkları.
22. HTTPS ve güvenli bağlantı sorunları.
23. Firebase Authentication authorized domains.
24. Firebase API erişim izinleri.
25. GitHub Pages ile Firebase Security Rules uyumsuzluğu.

Özellikle şunu araştır:

Localhost'ta doğru çalışan bir dosya yolu GitHub Pages üzerinde neden çalışmıyor?

Windows büyük/küçük harf konusunda toleranslı davranabilirken GitHub Pages'in Linux tabanlı build ortamı farklı davranabilir.

Bütün import yollarını ve dosya adlarını karşılaştır.

### Vite kontrolü

Eğer Vite kullanılıyorsa GitHub Pages URL yapısını incele.

Proje repository alt dizininde yayınlanıyorsa base path doğru olmalı.

Custom domain veya kullanıcı ana sayfasında yayınlanıyorsa base path farklı olabilir.

Gerçek yayın adresine göre karar ver. Tahminle değiştirme.

### GitHub Actions

- Build doğru çalışıyor mu?
- npm ci doğru mu?
- npm run build başarılı mı?
- Doğru klasör yayınlanıyor mu?
- Workflow eski dosyaları mı yayınlıyor?
- Yanlış branch kullanılıyor mu?
- Deployment sırasında eksik dosya oluşuyor mu?
- Build değişkenleri doğru aktarılıyor mu?

Production ortamında oluşan sorunları yerel ortamla karşılaştır.

---

# 7. NPM RUN DEV — GERÇEK UYGULAMA TESTİ

Bu aşama zorunlu.

Projeyi sadece statik kod incelemesiyle değerlendirme.

Terminal üzerinden çalıştır.

Önce package.json dosyasını oku.

Mevcut scriptleri incele.

Ardından:

1. npm bağımlılıklarını kontrol et.
2. node_modules durumunu kontrol et.
3. Gerekliyse npm install veya lockfile'a uygun npm ci kullan.
4. npm run dev komutunu çalıştır.
5. Yerel geliştirme sunucusunun gerçekten açıldığını doğrula.
6. Tarayıcıda uygulamayı aç.
7. Console hatalarını kontrol et.
8. Network isteklerini incele.
9. Firebase bağlantısını doğrula.
10. Proje oluşturma ve silme işlemlerini test et.

Komut başarısız olursa hatanın nedenini araştır.

Rastgele paket güncelleme yapma.

package-lock.json dosyasını sebepsiz değiştirme.

### TARAYICI TESTLERİ

Mümkünse Browser/Computer Use ile gerçek kullanıcı davranışını test et.

Aşağıdaki senaryoları uygula:

- Uygulama ilk açılışı.
- Proje oluşturma.
- Oluşturulan projenin arayüzde görünmesi.
- Firebase'de kayıt oluşması.
- Refresh.
- Refresh sonrası projenin tekrar görünmesi.
- Tarayıcıyı kapatıp tekrar açma.
- Yeni sekmede açma.
- Birden fazla proje oluşturma.
- Proje silme.
- Silme sonrası refresh.
- Ağ bağlantısını kesme.
- Ağ bağlantısını geri getirme.
- Firebase erişim hatası.
- Geçersiz veri gönderimi.
- Aynı anda birden fazla işlem.

Her işlemde console ve network sonuçlarını incele.

---

# 8. PRODUCTION VE DEVELOPMENT KARŞILAŞTIRMASI

İki ortamı birbirinden bağımsız değerlendir:

A. npm run dev

B. GitHub Pages production

Aşağıdaki karşılaştırmayı oluştur:

| Kontrol | Localhost | GitHub Pages |
|---|---|---|
| Uygulama açılışı | Test et | Test et |
| Firebase bağlantısı | Test et | Test et |
| Proje oluşturma | Test et | Test et |
| Firebase yazma | Test et | Test et |
| Veri okuma | Test et | Test et |
| Refresh | Test et | Test et |
| Silme | Test et | Test et |
| Authentication | Test et | Test et |
| Asset yükleme | Test et | Test et |
| Routing | Test et | Test et |

Bir ortamda çalışan bir özelliği diğer ortamda da çalışıyor kabul etme.

Özellikle GitHub Pages üzerinde refresh sonrası proje kaybolmasının farklı bir nedeni olup olmadığını araştır.

---

# 9. TÜM KODDA MANTIK HATALARI

Sadece Firebase'i inceleyip bırakma.

Bütün uygulamada şu hataları ara:

### JavaScript
- Null ve undefined hataları.
- Yanlış değişken kapsamı.
- Yanlış koşullar.
- Eksik await.
- Promise hataları.
- Race condition.
- Duplicate event listener.
- Yanlış callback.
- Yanlış state yönetimi.
- Eski state'in yeni state'i ezmesi.
- Yanlış ID eşleştirmesi.
- DOM elemanı bulunamaması.
- Sonsuz döngüler.
- Memory leak.
- Hatalı try/catch.
- Asenkron işlemlerin yanlış sıralanması.

### HTML
- Duplicate ID.
- Hatalı form.
- Yanlış buton türü.
- İstem dışı sayfa yenilenmesi.
- Yanlış script sırası.
- Eksik dosya bağlantıları.
- DOMContentLoaded sorunları.

### Veri mimarisi
- Tek kaydın birden fazla kez oluşması.
- Boş verinin gerçek veriyi ezmesi.
- Yanlış veri yolu.
- Yanlış kullanıcı ID'si.
- Eski cache'in yeni veriyi ezmesi.
- Silinen kayıtların geri gelmesi.
- Oluşturulan kayıtların kaybolması.
- Hatalı veri migrasyonu.
- Eş zamanlı işlem çakışmaları.

### Güvenlik
- Yetkisiz okuma.
- Yetkisiz yazma.
- Yetkisiz silme.
- Kullanıcılar arası veri sızıntısı.
- API anahtarı ile güvenlik kurallarının karıştırılması.
- Açık Firebase izinleri.
- İstemci tarafında güvenlik kontrolüne aşırı güvenilmesi.

---

# 10. DATABASE RULES — GERÇEK KODLA KARŞILAŞTIR

Şu dosyayı baştan sona incele:

C:\lavoraworklow\database.rules.json

Uygulamanın kullandığı bütün Firebase yollarını çıkar.

Rules ile karşılaştır.

Realtime Database kullanılıyorsa:
- .read
- .write
- .validate
- auth
- auth.uid
- data
- newData
- root
- parent/child izin mirası

Firestore kullanılıyorsa:
- match
- allow read
- allow write
- request.auth
- request.resource
- resource
- veri doğrulama

kullanılan sisteme göre incele.

Üst seviyedeki izinlerin alt düğümlere miras alınması gibi kritik davranışları kontrol et.

Rules dosyasını gereksiz yere gevşetme.

Üretim veritabanında deneysel değişiklik yapma.

Mümkünse Firebase Emulator Suite ile güvenlik testleri uygula.

---

# 11. HATA BULUNDUĞUNDA CERRAHİ MÜDAHALE

Herhangi bir dosyayı değiştirmeden önce:

1. Mevcut hâlini incele.
2. Bağımlılıklarını belirle.
3. Hatanın kök nedenini bul.
4. Değişikliğin etkilerini değerlendir.
5. Geri alınabilir bir yedek oluştur.
6. Minimum müdahaleyle düzelt.

Sonrasında:

- Build al.
- npm run dev çalıştır.
- Tarayıcıda tekrar test et.
- Firebase işlemlerini tekrar doğrula.
- Refresh testini tekrar uygula.
- Önceden çalışan özellikleri tekrar kontrol et.

Bir düzeltme başka bir yeri bozarsa bunu gizleme. Düzelt veya geri al.

**Çalışan sistemi sırf daha modern bir mimariye geçirmek için yeniden tasarlama.**

---

# 12. TESTLERİN GERÇEKLİĞİ

Test sonuçlarını kesinlikle uydurma.

Her test şu durumlardan biriyle işaretlenmeli:

- PASS: Gerçekten test edildi ve başarılı.
- FAIL: Test edildi ve başarısız.
- NOT TESTED: Test edilmedi.
- BLOCKED: Ortam veya erişim engeli nedeniyle test edilemedi.

Kod incelemesi ile gerçek çalışma testini birbirine karıştırma.

Firebase sunucusuna erişemiyorsan sunucuya yazıldığını iddia etme.

GitHub Pages'e erişemiyorsan production testini başarılı gösterme.

Tarayıcı testi yapamadıysan npm run dev komutunun açılmasını uçtan uca test olarak sunma.

---

# 13. SONUÇ RAPORU

İşlem sonunda ayrıntılı bir rapor oluştur.

### A. İnceleme kapsamı
- Toplam dosya sayısı.
- Tamamen okunan dosyalar.
- İncelenen fonksiyonlar.
- İncelenen veri yolları.
- İncelenen Firebase yapılandırmaları.
- İncelenen Rules dosyaları.
- İncelenemeyen dosyalar.

### B. Proje kaybolma sorunu
- Gerçek kök neden.
- İlgili dosya.
- İlgili fonksiyon.
- Hata satırları.
- Uygulanan düzeltme.
- Düzeltme sonrası test sonucu.

### C. IndexedDB
- Kullanım amacı.
- Tespit edilen sorunlar.
- Firebase ile çakışmalar.
- Kaldırıldı mı, düzeltildi mi, korundu mu?
- Kararın teknik gerekçesi.

### D. GitHub Pages
- Base path.
- Build.
- Deployment.
- Routing.
- Asset yolları.
- Firebase bağlantısı.
- Production hataları.

### E. NPM RUN DEV
- Sunucu açıldı mı?
- Build başarılı mı?
- Console hataları.
- Network hataları.
- Browser testleri.
- Firebase testleri.

### F. Bulunan diğer hatalar
Her birini önem derecesine göre listele.

### G. Değiştirilen dosyalar
Her dosyada ne değiştiğini açıkla.

### H. Test sonuçları
PASS / FAIL / NOT TESTED / BLOCKED.

### I. Kalan riskler
Düzeltilmeyen ve çözülmesi gereken sorunlar.

### J. Nihai karar
Proje güvenilir mi?
Veriler refresh sonrasında korunuyor mu?
Firebase kayıtları doğrulandı mı?
GitHub Pages doğru çalışıyor mu?
Upload ve delete hâlâ çalışıyor mu?
Başka kritik hata kaldı mı?
Production'a hazır mı?

---

# 14. SON VE EN ÖNEMLİ TALİMAT

Bu projeyi yeniden yazmanı istemiyorum.

Mevcut çalışan sistemi koruyarak bütün hataları ortaya çıkarmanı istiyorum.

Özellikle proje oluşturma işleminin ardından refresh yapıldığında verinin neden kaybolduğunu gerçek kök nedenine kadar araştır.

IndexedDB sorun yaratıyorsa bağımlılıklarıyla birlikte değerlendir ve gerekiyorsa güvenli şekilde kaldır.

GitHub Pages kaynaklı bir problem varsa bunu localhost probleminden ayır.

npm run dev ile uygulamayı gerçekten çalıştır ve tarayıcıda test et.

Bütün HTML ve JavaScript dosyalarını baştan sona incele.

Hiçbir kritik işlemi atlama.

Önce teşhis, sonra kontrollü müdahale, ardından regresyon testi.

**VERİ KAYBI KABUL EDİLEMEZ. ÇALIŞAN ÖZELLİKLERİN BOZULMASI KABUL EDİLEMEZ. TEST EDİLMEMİŞ İŞLEMİN BAŞARILI GÖSTERİLMESİ KABUL EDİLEMEZ.**

Bu görevi profesyonel bir production incident müdahalesi olarak ele al.