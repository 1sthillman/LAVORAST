const admin = require('firebase-admin');
const { getDatabase } = require('firebase-admin/database');
console.log('Admin loaded:', typeof admin, Object.keys(admin || {}));
const fs = require('fs');
const path = require('path');

// Read service account manually
const serviceAccountPath = path.join(__dirname, 'design-ac717-firebase-adminsdk-fbsvc-3971439e65.json');
const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

admin.initializeApp({
  credential: admin.cert(serviceAccount),
  databaseURL: 'https://design-ac717-default-rtdb.firebaseio.com'
});

const db = getDatabase();

async function checkSystemAdmins() {
  console.log('🔍 Checking /system/admins node...\n');
  
  const adminUid = 'KVpS3osYEWY5nwToHVumK5Aw4M62';
  
  try {
    // Check if /system node exists
    const systemSnapshot = await db.ref('system').once('value');
    console.log('📁 /system node exists:', systemSnapshot.exists());
    
    if (systemSnapshot.exists()) {
      console.log('📋 /system data:', JSON.stringify(systemSnapshot.val(), null, 2));
    }
    
    // Check if /system/admins exists
    const adminsSnapshot = await db.ref('system/admins').once('value');
    console.log('\n📁 /system/admins node exists:', adminsSnapshot.exists());
    
    if (adminsSnapshot.exists()) {
      console.log('📋 /system/admins data:', JSON.stringify(adminsSnapshot.val(), null, 2));
    }
    
    // Check specific admin UID
    const adminSnapshot = await db.ref(`system/admins/${adminUid}`).once('value');
    console.log(`\n📁 /system/admins/${adminUid} exists:`, adminSnapshot.exists());
    
    if (adminSnapshot.exists()) {
      console.log('✅ Admin node found!');
      console.log('📋 Admin data:', JSON.stringify(adminSnapshot.val(), null, 2));
    } else {
      console.log('❌ Admin node NOT FOUND!');
      console.log('\n🔧 Creating admin node now...');
      
      await db.ref(`system/admins/${adminUid}`).set({
        email: 'minifinise@gmail.com',
        displayName: 'System Admin',
        status: 'active',
        createdAt: Date.now(),
        role: 'admin'
      });
      
      console.log('✅ Admin node created successfully!');
      
      // Verify
      const verifySnapshot = await db.ref(`system/admins/${adminUid}`).once('value');
      console.log('📋 Verified data:', JSON.stringify(verifySnapshot.val(), null, 2));
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  }
  
  process.exit(0);
}

checkSystemAdmins();
