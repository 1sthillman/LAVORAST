#!/usr/bin/env node

/**
 * Workflow Permission Fix Deployment Script
 * 
 * Bu script database.rules.json dosyasını Firebase'e deploy eder.
 * 
 * Sorun: workflowStaff/{projectId} node'unda validation eksikti
 * Çözüm: $other: {.validate: true} kuralı eklendi
 */

const fs = require('fs');
const path = require('path');

// Import admin - dynamicimport yerine require kullan
let admin;
try {
  admin = require('firebase-admin');
} catch (error) {
  console.error('❌ firebase-admin yüklenemedi:', error.message);
  console.log('');
  console.log('🔧 Çözüm: npm install firebase-admin');
  process.exit(1);
}

// Admin SDK credentials
let serviceAccount;
try {
  serviceAccount = require('./design-ac717-firebase-adminsdk-fbsvc-903bdca875.json');
} catch (error) {
  console.error('❌ Service account dosyası yüklenemedi:', error.message);
  process.exit(1);
}

// Firebase Admin initialize
try {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: 'https://design-ac717-default-rtdb.firebaseio.com'
  });
} catch (error) {
  console.error('❌ Firebase Admin init failed:', error.message);
  process.exit(1);
}

console.log('🚀 Firebase Admin SDK initialized');
console.log('📦 Project ID:', serviceAccount.project_id);
console.log('🔑 Client Email:', serviceAccount.client_email);
console.log('');

// Database rules dosyasını oku
const rulesPath = path.join(__dirname, 'database.rules.json');
const rulesContent = fs.readFileSync(rulesPath, 'utf8');
const rules = JSON.parse(rulesContent);

console.log('📄 Database rules loaded from:', rulesPath);
console.log('📏 Rules size:', JSON.stringify(rules).length, 'bytes');
console.log('');

// Validation: workflowStaff $other kuralını kontrol et
const hasWorkflowFix = rules.rules?.orgs?.$orgId?.workflowStaff?.$projectId?.$other;
if (hasWorkflowFix && hasWorkflowFix['.validate'] === true) {
  console.log('✅ Workflow fix detected: $other validation rule exists');
} else {
  console.error('❌ ERROR: Workflow fix not found in rules!');
  console.error('Expected: rules.orgs.$orgId.workflowStaff.$projectId.$other[".validate"] === true');
  process.exit(1);
}

console.log('');
console.log('⚠️  NOT: Firebase Admin SDK ile rules deploy edilemez.');
console.log('⚠️  Rules sadece Firebase Console veya Firebase CLI ile deploy edilebilir.');
console.log('');
console.log('🔧 Firebase CLI ile deploy için:');
console.log('   npm install -g firebase-tools');
console.log('   firebase login');
console.log('   firebase deploy --only database');
console.log('');
console.log('🌐 Manuel deployment için:');
console.log('   1. https://console.firebase.google.com/project/design-ac717/database/design-ac717-default-rtdb/rules');
console.log('   2. Mevcut rules\'u yedekle');
console.log('   3. database.rules.json içeriğini yapıştır');
console.log('   4. "Publish" butonuna tıkla');
console.log('');

// Test: Admin UID kontrolü
console.log('🔍 Verification Tests:');
console.log('');

const ADMIN_UID = 'KVpS3osYEWY5nwToHVumK5Aw4M62';
const db = admin.database();

async function runTests() {
  try {
    // Test 1: System admins kontrolü
    console.log('Test 1: System admins check...');
    const adminSnap = await db.ref(`/system/admins/${ADMIN_UID}`).once('value');
    const adminData = adminSnap.val();
    
    if (adminData && adminData.status === 'active') {
      console.log('  ✅ Admin UID exists and active');
      console.log('  📋 Data:', JSON.stringify(adminData));
    } else {
      console.log('  ❌ Admin UID not found or inactive');
      console.log('  📋 Data:', adminData);
    }
    console.log('');

    // Test 2: Members kontrolü
    console.log('Test 2: Organization members check...');
    const memberSnap = await db.ref(`/orgs/lavora-main/members/${ADMIN_UID}`).once('value');
    const memberData = memberSnap.val();
    
    if (memberData) {
      console.log('  ✅ Member data exists');
      console.log('  📋 Role:', memberData.role);
      console.log('  📋 Status:', memberData.status);
    } else {
      console.log('  ⚠️  Member data not found (optional)');
    }
    console.log('');

    // Test 3: Mevcut projeler
    console.log('Test 3: Existing projects check...');
    const projectsSnap = await db.ref('/orgs/lavora-main/projectIndex').once('value');
    const projects = projectsSnap.val();
    
    if (projects) {
      const projectCount = Object.keys(projects).length;
      console.log(`  ✅ Found ${projectCount} projects`);
      
      if (projectCount > 0) {
        const firstProject = Object.values(projects)[0];
        console.log('  📋 First project:', firstProject.name);
      }
    } else {
      console.log('  ℹ️  No projects found (empty database)');
    }
    console.log('');

    // Test 4: WorkflowStaff kontrolü
    console.log('Test 4: WorkflowStaff data check...');
    const workflowSnap = await db.ref('/orgs/lavora-main/workflowStaff').once('value');
    const workflows = workflowSnap.val();
    
    if (workflows) {
      const workflowCount = Object.keys(workflows).length;
      console.log(`  ✅ Found ${workflowCount} workflow entries`);
    } else {
      console.log('  ℹ️  No workflow data found (empty)');
    }
    console.log('');

    console.log('═══════════════════════════════════════════════════════════');
    console.log('✅ Verification tests completed');
    console.log('');
    console.log('📋 NEXT STEPS:');
    console.log('   1. Deploy rules via Firebase Console (see instructions above)');
    console.log('   2. Refresh HTML page and login as admin');
    console.log('   3. Upload a test project with Excel');
    console.log('   4. Check console - NO permission_denied errors');
    console.log('   5. Refresh page - project should PERSIST');
    console.log('═══════════════════════════════════════════════════════════');

  } catch (error) {
    console.error('❌ Test error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    process.exit(0);
  }
}

// Run tests
runTests();
