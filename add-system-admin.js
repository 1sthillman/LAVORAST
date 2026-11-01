#!/usr/bin/env node

/**
 * Add System Admin to Firebase
 * 
 * Bu script /system/admins/{UID} kaydını Firebase'e ekler
 */

const admin = require('firebase-admin');
const serviceAccount = require('./design-ac717-firebase-adminsdk-fbsvc-903bdca875.json');

const ADMIN_UID = 'KVpS3osYEWY5nwToHVumK5Aw4M62';
const ADMIN_EMAIL = 'minifinise@gmail.com';

console.log('═══════════════════════════════════════════════════════════');
console.log('🔧 FIREBASE SYSTEM ADMIN SETUP');
console.log('═══════════════════════════════════════════════════════════');
console.log('');

// Initialize Firebase Admin
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://design-ac717-default-rtdb.firebaseio.com'
});

const db = admin.database();

async function setupAdmin() {
  try {
    console.log('📋 Admin bilgileri:');
    console.log('   UID:', ADMIN_UID);
    console.log('   Email:', ADMIN_EMAIL);
    console.log('');

    // 1. Check /system/admins/{UID}
    console.log('1️⃣ Kontrol: /system/admins/' + ADMIN_UID);
    const systemAdminRef = db.ref(`/system/admins/${ADMIN_UID}`);
    const systemAdminSnap = await systemAdminRef.once('value');
    const systemAdminData = systemAdminSnap.val();
    
    if (systemAdminData) {
      console.log('   ✅ Zaten var:', JSON.stringify(systemAdminData));
    } else {
      console.log('   ❌ Yok - şimdi ekleniyor...');
      await systemAdminRef.set({
        status: 'active',
        addedAt: Date.now(),
        email: ADMIN_EMAIL
      });
      console.log('   ✅ EKLENDI!');
    }
    console.log('');

    // 2. Check /orgs/lavora-main/members/{UID}
    console.log('2️⃣ Kontrol: /orgs/lavora-main/members/' + ADMIN_UID);
    const memberRef = db.ref(`/orgs/lavora-main/members/${ADMIN_UID}`);
    const memberSnap = await memberRef.once('value');
    const memberData = memberSnap.val();
    
    if (memberData) {
      console.log('   ✅ Zaten var:', JSON.stringify(memberData));
      
      if (memberData.role !== 'admin' || memberData.status !== 'active') {
        console.log('   ⚠️  Role veya status yanlış - düzeltiliyor...');
        await memberRef.update({
          role: 'admin',
          status: 'active',
          updatedAt: Date.now()
        });
        console.log('   ✅ GÜNCELLENDİ!');
      }
    } else {
      console.log('   ❌ Yok - şimdi ekleniyor...');
      await memberRef.set({
        role: 'admin',
        status: 'active',
        assignedBy: ADMIN_UID,
        assignedAt: Date.now(),
        updatedAt: Date.now()
      });
      console.log('   ✅ EKLENDI!');
    }
    console.log('');

    // 3. Verify
    console.log('3️⃣ Doğrulama testleri:');
    
    const finalSystemAdmin = await systemAdminRef.once('value');
    const finalMember = await memberRef.once('value');
    
    console.log('');
    console.log('📊 Final durum:');
    console.log('   /system/admins/' + ADMIN_UID + ':', JSON.stringify(finalSystemAdmin.val()));
    console.log('   /orgs/lavora-main/members/' + ADMIN_UID + ':', JSON.stringify(finalMember.val()));
    console.log('');

    // Test write permissions
    console.log('4️⃣ Write permission testi:');
    const testProjectId = 'test-' + Date.now();
    
    try {
      // Test workflowStaff write
      await db.ref(`/orgs/lavora-main/workflowStaff/${testProjectId}`).set({
        items: {},
        stages: {},
        updatedAt: Date.now(),
        dueDate: ''
      });
      console.log('   ✅ workflowStaff write: SUCCESS');
      
      // Cleanup
      await db.ref(`/orgs/lavora-main/workflowStaff/${testProjectId}`).remove();
      
    } catch (error) {
      console.log('   ❌ workflowStaff write: FAILED');
      console.log('   Error:', error.message);
    }

    console.log('');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ ADMIN SETUP TAMAMLANDI!');
    console.log('═══════════════════════════════════════════════════════════');
    console.log('');
    console.log('📋 Sonraki adımlar:');
    console.log('1. Tarayıcıda Ctrl+Shift+R ile sayfayı yenile');
    console.log('2. Google hesabınla tekrar giriş yap');
    console.log('3. Proje yüklemeyi dene');
    console.log('4. Console\'da permission_denied hatası olmamalı!');
    console.log('');

  } catch (error) {
    console.error('❌ HATA:', error.message);
    console.error('Stack:', error.stack);
    process.exit(1);
  } finally {
    process.exit(0);
  }
}

setupAdmin();
