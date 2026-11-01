/**
 * Test Çalışanı Ekleme Scripti
 * 
 * Bu script Firebase'e test çalışanı ekler.
 * Gerçek kullanımda admin panelden eklenecek.
 */

const admin = require('firebase-admin');
const { getDatabase } = require('firebase-admin/database');
const fs = require('fs');
const path = require('path');

const serviceAccountPath = path.join(__dirname, 'design-ac717-firebase-adminsdk-fbsvc-3971439e65.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.cert(serviceAccount),
  databaseURL: 'https://design-ac717-default-rtdb.firebaseio.com'
});

const db = getDatabase();
const ORG_ID = 'lavora-main';

async function addTestUsers() {
  console.log('🔧 Test kullanıcıları ekleniyor...\n');
  
  // Test kullanıcıları
  const users = [
    {
      uid: 'TPnq5vqzXiUfuwCsM8n9LXid1a92',
      email: '2sthillman@gmail.com',
      role: 'employee',
      status: 'active',
      displayName: 'Test Çalışan'
    },
    {
      uid: 'test-employee-001',
      email: 'calisan1@test.com',
      role: 'employee',
      status: 'active',
      displayName: 'Çalışan 1'
    },
    {
      uid: 'test-partner-001',
      email: 'ortak1@test.com',
      role: 'partner',
      status: 'active',
      displayName: 'Ortak 1'
    },
    {
      uid: 'test-customer-001',
      email: 'musteri1@test.com',
      role: 'customer',
      status: 'active',
      displayName: 'Müşteri 1'
    }
  ];
  
  for (const user of users) {
    try {
      console.log(`➕ ${user.displayName} (${user.role}) ekleniyor...`);
      
      // Firebase'e members altına ekle
      await db.ref(`orgs/${ORG_ID}/members/${user.uid}`).set({
        role: user.role,
        status: user.status,
        assignedBy: 'KVpS3osYEWY5nwToHVumK5Aw4M62', // Admin UID
        assignedAt: Date.now(),
        updatedAt: Date.now()
      });
      
      // userProfiles'a ekle (opsiyonel ama önerilen)
      await db.ref(`userProfiles/${user.uid}`).set({
        displayName: user.displayName,
        email: user.email,
        createdAt: Date.now(),
        lastSeenAt: Date.now()
      });
      
      console.log(`✅ ${user.displayName} başarıyla eklendi!`);
      console.log(`   Email: ${user.email}`);
      console.log(`   UID: ${user.uid}`);
      console.log(`   Rol: ${user.role}`);
      console.log('');
      
    } catch (error) {
      console.error(`❌ ${user.displayName} eklenemedi:`, error.message);
    }
  }
  
  console.log('\n═══════════════════════════════════════════════════');
  console.log('✅ İşlem tamamlandı!');
  console.log('═══════════════════════════════════════════════════\n');
  
  // Doğrulama
  console.log('🔍 Doğrulama yapılıyor...\n');
  
  const membersSnap = await db.ref(`orgs/${ORG_ID}/members`).once('value');
  const members = membersSnap.val() || {};
  
  console.log(`📊 Toplam ${Object.keys(members).length} üye var:\n`);
  
  for (const [uid, member] of Object.entries(members)) {
    const profile = await db.ref(`userProfiles/${uid}`).once('value');
    const profileData = profile.val();
    
    console.log(`👤 ${profileData?.displayName || 'İsimsiz'}`);
    console.log(`   Email: ${profileData?.email || 'Yok'}`);
    console.log(`   UID: ${uid}`);
    console.log(`   Rol: ${member.role}`);
    console.log(`   Durum: ${member.status}`);
    console.log('');
  }
  
  process.exit(0);
}

addTestUsers();
