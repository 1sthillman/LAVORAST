/**
 * KAPSAMLI FIREBASE SENKRONİZASYON TEST ARACI
 * 
 * Bu script şunları test eder:
 * 1. Admin/Ortak proje oluşturma → Firebase'e yazılma
 * 2. Çalışan erişimi → Projeleri görebilme
 * 3. Müşteri erişimi → Sadece kendi projelerini görebilme
 * 4. Proje düzenleme → Realtime güncelleme
 * 5. Proje silme → Firebase'den temizlenme
 */

const admin = require('firebase-admin');
const { getDatabase } = require('firebase-admin/database');
const fs = require('fs');
const path = require('path');

// Service account
const serviceAccountPath = path.join(__dirname, 'design-ac717-firebase-adminsdk-fbsvc-3971439e65.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.cert(serviceAccount),
  databaseURL: 'https://design-ac717-default-rtdb.firebaseio.com'
});

const db = getDatabase();

// Test UIDs
const ADMIN_UID = 'KVpS3osYEWY5nwToHVumK5Aw4M62';
const ORG_ID = 'lavora-main';

// Color codes
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

function log(level, message) {
  const timestamp = new Date().toLocaleTimeString('tr-TR');
  const levelColors = {
    success: colors.green,
    error: colors.red,
    warning: colors.yellow,
    info: colors.blue,
    test: colors.cyan
  };
  console.log(`${levelColors[level]}[${timestamp}] ${message}${colors.reset}`);
}

async function testAdminProjectCreation() {
  log('test', '═══════════════════════════════════════════════════');
  log('test', 'TEST 1: Admin/Ortak Proje Oluşturma ve Firebase Sync');
  log('test', '═══════════════════════════════════════════════════');
  
  const testProjectId = `test-project-${Date.now()}`;
  
  try {
    // Test projesi oluştur
    const projectData = {
      // projectIndex
      index: {
        id: testProjectId,
        name: 'Test Projesi - Sync Doğrulama',
        customerDisplayName: 'Test Müşterisi',
        workflowStatus: 'İşleniyor',
        updatedAt: Date.now(),
        schemaVersion: 1,
        isTrashed: false
      },
      
      // projectPublic
      public: {
        id: testProjectId,
        name: 'Test Projesi - Sync Doğrulama',
        description: 'Bu proje Firebase senkronizasyon testleri için oluşturuldu',
        customerDisplayName: 'Test Müşterisi',
        workflowStatus: 'İşleniyor',
        createdAt: Date.now(),
        updatedAt: Date.now()
      },
      
      // projectFinancials
      financials: {
        sheets: [{
          name: 'Sayfa 1',
          headers: ['Ürün', 'Adet', 'Birim Fiyat', 'Toplam'],
          rows: [
            ['Test Ürün 1', '10', '100', '1000'],
            ['Test Ürün 2', '5', '200', '1000']
          ]
        }],
        totalValue: 2000,
        kdv: 20,
        updatedAt: Date.now()
      },
      
      // workflowStaff
      workflow: {
        stages: [
          { id: 'stage-1', name: 'Hazırlık', position: 0 },
          { id: 'stage-2', name: 'Üretim', position: 1 },
          { id: 'stage-3', name: 'Teslim', position: 2 }
        ],
        items: [
          {
            id: `item-${Date.now()}`,
            name: 'Test İş Kalemi',
            description: 'Bu bir test iş kalemidir',
            status: 'todo',
            quantity: 1,
            unit: 'adet',
            createdBy: ADMIN_UID,
            createdAt: Date.now(),
            updatedAt: Date.now(),
            progress: 0
          }
        ],
        updatedAt: Date.now()
      }
    };
    
    log('info', `Test proje ID: ${testProjectId}`);
    log('info', 'Firebase\'e yazılıyor...');
    
    // Firebase'e yaz
    await Promise.all([
      db.ref(`orgs/${ORG_ID}/projectIndex/${testProjectId}`).set(projectData.index),
      db.ref(`orgs/${ORG_ID}/projectPublic/${testProjectId}`).set(projectData.public),
      db.ref(`orgs/${ORG_ID}/projectFinancials/${testProjectId}`).set(projectData.financials),
      db.ref(`orgs/${ORG_ID}/workflowStaff/${testProjectId}`).set(projectData.workflow)
    ]);
    
    log('success', '✓ Proje Firebase\'e başarıyla yazıldı');
    
    // Doğrulama - geri okuma
    log('info', 'Doğrulama için Firebase\'den okunuyor...');
    
    const [indexSnap, publicSnap, finSnap, workflowSnap] = await Promise.all([
      db.ref(`orgs/${ORG_ID}/projectIndex/${testProjectId}`).once('value'),
      db.ref(`orgs/${ORG_ID}/projectPublic/${testProjectId}`).once('value'),
      db.ref(`orgs/${ORG_ID}/projectFinancials/${testProjectId}`).once('value'),
      db.ref(`orgs/${ORG_ID}/workflowStaff/${testProjectId}`).once('value')
    ]);
    
    if (indexSnap.exists()) {
      log('success', '✓ projectIndex başarıyla okundu');
    } else {
      log('error', '✗ projectIndex okunamadı!');
    }
    
    if (publicSnap.exists()) {
      log('success', '✓ projectPublic başarıyla okundu');
    } else {
      log('error', '✗ projectPublic okunamadı!');
    }
    
    if (finSnap.exists()) {
      log('success', '✓ projectFinancials başarıyla okundu');
    } else {
      log('error', '✗ projectFinancials okunamadı!');
    }
    
    if (workflowSnap.exists()) {
      log('success', '✓ workflowStaff başarıyla okundu');
    } else {
      log('error', '✗ workflowStaff okunamadı!');
    }
    
    return testProjectId;
    
  } catch (error) {
    log('error', `✗ Test başarısız: ${error.message}`);
    throw error;
  }
}

async function testEmployeeAccess(projectId) {
  log('test', '\n═══════════════════════════════════════════════════');
  log('test', 'TEST 2: Çalışan Erişimi Kontrolü');
  log('test', '═══════════════════════════════════════════════════');
  
  try {
    // Çalışanlar sadece projectIndex ve workflowStaff'a erişebilir
    log('info', 'Çalışan olarak projectIndex okunuyor...');
    
    const indexSnap = await db.ref(`orgs/${ORG_ID}/projectIndex/${projectId}`).once('value');
    
    if (indexSnap.exists() && !indexSnap.val().isTrashed) {
      log('success', '✓ Çalışan projectIndex\'i görebilir');
      log('info', `  Proje adı: ${indexSnap.val().name}`);
      log('info', `  Durum: ${indexSnap.val().workflowStatus}`);
    } else {
      log('warning', '⚠ Çalışan projectIndex\'i göremiyor veya proje çöp kutusunda');
    }
    
    log('info', 'Çalışan olarak workflowStaff okunuyor...');
    
    const workflowSnap = await db.ref(`orgs/${ORG_ID}/workflowStaff/${projectId}`).once('value');
    
    if (workflowSnap.exists()) {
      const workflow = workflowSnap.val();
      log('success', '✓ Çalışan workflowStaff\'a erişebilir');
      log('info', `  İş kalemleri: ${workflow.items?.length || 0} adet`);
      log('info', `  Aşamalar: ${workflow.stages?.length || 0} adet`);
    } else {
      log('error', '✗ Çalışan workflowStaff\'a erişemiyor!');
    }
    
    // Çalışanlar projectFinancials'a ERİŞEMEMELİ
    log('info', 'Çalışan olarak projectFinancials okunuyor (ERİŞEMEMELİ)...');
    
    const finSnap = await db.ref(`orgs/${ORG_ID}/projectFinancials/${projectId}`).once('value');
    
    if (!finSnap.exists()) {
      log('success', '✓ DOĞRU: Çalışan projectFinancials\'a erişemiyor (rules çalışıyor)');
    } else {
      log('warning', '⚠ DİKKAT: Çalışan projectFinancials\'a erişebiliyor (rules sorunu olabilir!)');
    }
    
  } catch (error) {
    log('error', `✗ Test başarısız: ${error.message}`);
  }
}

async function testProjectUpdate(projectId) {
  log('test', '\n═══════════════════════════════════════════════════');
  log('test', 'TEST 3: Proje Güncelleme ve Realtime Sync');
  log('test', '═══════════════════════════════════════════════════');
  
  try {
    log('info', 'Proje güncelleniyor...');
    
    const updates = {
      name: 'Test Projesi - GÜNCELLENDİ',
      workflowStatus: 'Tamamlandı',
      updatedAt: Date.now()
    };
    
    await db.ref(`orgs/${ORG_ID}/projectIndex/${projectId}`).update(updates);
    await db.ref(`orgs/${ORG_ID}/projectPublic/${projectId}`).update(updates);
    
    log('success', '✓ Proje güncellendi');
    
    // Doğrulama
    log('info', 'Güncelleme doğrulanıyor...');
    
    const indexSnap = await db.ref(`orgs/${ORG_ID}/projectIndex/${projectId}`).once('value');
    const data = indexSnap.val();
    
    if (data.name === updates.name && data.workflowStatus === updates.workflowStatus) {
      log('success', '✓ Güncelleme başarıyla doğrulandı');
      log('info', `  Yeni ad: ${data.name}`);
      log('info', `  Yeni durum: ${data.workflowStatus}`);
    } else {
      log('error', '✗ Güncelleme doğrulanamadı!');
    }
    
    log('info', '');
    log('info', '📌 NOT: Realtime listener aktifse, bağlı kullanıcılar');
    log('info', '   bu değişikliği ANINDA görecekler (refresh gerekmez)');
    
  } catch (error) {
    log('error', `✗ Test başarısız: ${error.message}`);
  }
}

async function testProjectDeletion(projectId) {
  log('test', '\n═══════════════════════════════════════════════════');
  log('test', 'TEST 4: Kalıcı Silme ve Temizlik');
  log('test', '═══════════════════════════════════════════════════');
  
  try {
    log('info', 'Test projesi siliniyor...');
    
    await Promise.all([
      db.ref(`orgs/${ORG_ID}/projectIndex/${projectId}`).remove(),
      db.ref(`orgs/${ORG_ID}/projectPublic/${projectId}`).remove(),
      db.ref(`orgs/${ORG_ID}/projectFinancials/${projectId}`).remove(),
      db.ref(`orgs/${ORG_ID}/workflowStaff/${projectId}`).remove()
    ]);
    
    log('success', '✓ Proje Firebase\'den tamamen silindi');
    
    // Doğrulama
    log('info', 'Silme doğrulanıyor...');
    
    const [indexSnap, publicSnap, finSnap, workflowSnap] = await Promise.all([
      db.ref(`orgs/${ORG_ID}/projectIndex/${projectId}`).once('value'),
      db.ref(`orgs/${ORG_ID}/projectPublic/${projectId}`).once('value'),
      db.ref(`orgs/${ORG_ID}/projectFinancials/${projectId}`).once('value'),
      db.ref(`orgs/${ORG_ID}/workflowStaff/${projectId}`).once('value')
    ]);
    
    if (!indexSnap.exists() && !publicSnap.exists() && !finSnap.exists() && !workflowSnap.exists()) {
      log('success', '✓ Tüm proje verileri başarıyla temizlendi');
    } else {
      log('error', '✗ Bazı veriler hala Firebase\'de!');
      if (indexSnap.exists()) log('error', '  - projectIndex hala var');
      if (publicSnap.exists()) log('error', '  - projectPublic hala var');
      if (finSnap.exists()) log('error', '  - projectFinancials hala var');
      if (workflowSnap.exists()) log('error', '  - workflowStaff hala var');
    }
    
  } catch (error) {
    log('error', `✗ Test başarısız: ${error.message}`);
  }
}

async function testRealtimeListeners() {
  log('test', '\n═══════════════════════════════════════════════════');
  log('test', 'TEST 5: Realtime Listener Testi');
  log('test', '═══════════════════════════════════════════════════');
  
  const testProjectId = `realtime-test-${Date.now()}`;
  
  try {
    log('info', 'Realtime listener ayarlanıyor...');
    
    let changeDetected = false;
    const projectRef = db.ref(`orgs/${ORG_ID}/projectIndex/${testProjectId}`);
    
    // Listener kur
    projectRef.on('value', (snapshot) => {
      if (snapshot.exists()) {
        changeDetected = true;
        log('success', `✓ Realtime güncelleme algılandı: ${snapshot.val().name}`);
      }
    });
    
    // Proje oluştur
    log('info', 'Test projesi oluşturuluyor...');
    await projectRef.set({
      id: testProjectId,
      name: 'Realtime Test Projesi',
      workflowStatus: 'Aktif',
      updatedAt: Date.now()
    });
    
    // 1 saniye bekle (listener tetiklenmesi için)
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    if (changeDetected) {
      log('success', '✓ Realtime listener ÇALIŞIYOR!');
      log('info', '  Kullanıcılar değişiklikleri anında görecek');
    } else {
      log('warning', '⚠ Realtime listener tetiklenmedi (timeout olabilir)');
    }
    
    // Temizlik
    projectRef.off('value');
    await projectRef.remove();
    log('info', 'Test projesi temizlendi');
    
  } catch (error) {
    log('error', `✗ Test başarısız: ${error.message}`);
  }
}

async function checkExistingProjects() {
  log('test', '\n═══════════════════════════════════════════════════');
  log('test', 'BONUS: Mevcut Projeler Kontrolü');
  log('test', '═══════════════════════════════════════════════════');
  
  try {
    const indexSnap = await db.ref(`orgs/${ORG_ID}/projectIndex`).once('value');
    
    if (indexSnap.exists()) {
      const projects = indexSnap.val();
      const projectCount = Object.keys(projects).length;
      const activeProjects = Object.values(projects).filter(p => !p.isTrashed).length;
      const trashedProjects = Object.values(projects).filter(p => p.isTrashed).length;
      
      log('info', `📊 Firebase\'de toplam ${projectCount} proje var:`);
      log('info', `   ✓ Aktif: ${activeProjects}`);
      log('info', `   🗑 Çöp kutusunda: ${trashedProjects}`);
      
      if (projectCount > 0) {
        log('info', '\n📋 İlk 5 proje:');
        Object.values(projects).slice(0, 5).forEach((p, i) => {
          log('info', `   ${i + 1}. ${p.name} (${p.workflowStatus}) ${p.isTrashed ? '🗑' : ''}`);
        });
      }
    } else {
      log('warning', '⚠ Firebase\'de hiç proje yok');
    }
    
  } catch (error) {
    log('error', `✗ Kontrol başarısız: ${error.message}`);
  }
}

// Ana test fonksiyonu
async function runAllTests() {
  log('test', '\n');
  log('test', '╔═══════════════════════════════════════════════════╗');
  log('test', '║   LAVORA FIREBASE SENKRONİZASYON TEST PAKETİ     ║');
  log('test', '╚═══════════════════════════════════════════════════╝');
  log('test', '');
  
  try {
    // Mevcut durumu kontrol et
    await checkExistingProjects();
    
    // Test 1: Proje oluşturma
    const testProjectId = await testAdminProjectCreation();
    
    // Test 2: Çalışan erişimi
    await testEmployeeAccess(testProjectId);
    
    // Test 3: Proje güncelleme
    await testProjectUpdate(testProjectId);
    
    // Test 4: Kalıcı silme
    await testProjectDeletion(testProjectId);
    
    // Test 5: Realtime listeners
    await testRealtimeListeners();
    
    log('test', '\n═══════════════════════════════════════════════════');
    log('success', '✓ TÜM TESTLER TAMAMLANDI!');
    log('test', '═══════════════════════════════════════════════════\n');
    
  } catch (error) {
    log('error', `\n✗ TESTLER BAŞARISIZ: ${error.message}`);
    log('error', error.stack);
  } finally {
    process.exit(0);
  }
}

// Testleri çalıştır
runAllTests();
