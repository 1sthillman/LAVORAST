#!/usr/bin/env node

/**
 * Database Rules Workflow Fix Verification
 * 
 * Bu script sadece rules dosyasını kontrol eder ve deployment talimatları verir.
 */

const fs = require('fs');
const path = require('path');

console.log('═══════════════════════════════════════════════════════════');
console.log('🔍 LAVORA WORKFLOW FIX VERIFICATION');
console.log('═══════════════════════════════════════════════════════════');
console.log('');

// Database rules dosyasını oku
const rulesPath = path.join(__dirname, 'database.rules.json');

try {
  const rulesContent = fs.readFileSync(rulesPath, 'utf8');
  const rules = JSON.parse(rulesContent);
  
  console.log('✅ database.rules.json başarıyla yüklendi');
  console.log('📏 Rules boyutu:', JSON.stringify(rules).length, 'bytes');
  console.log('');
  
  // Validation: workflowStaff $other kuralını kontrol et
  const workflowStaff = rules.rules?.orgs?.$orgId?.workflowStaff;
  
  if (!workflowStaff) {
    console.log('❌ HATA: workflowStaff kuralları bulunamadı!');
    process.exit(1);
  }
  
  const projectIdRules = workflowStaff.$projectId;
  
  if (!projectIdRules) {
    console.log('❌ HATA: workflowStaff/$projectId kuralları bulunamadı!');
    process.exit(1);
  }
  
  // $other kuralını kontrol et
  const hasOtherRule = projectIdRules.$other;
  
  if (hasOtherRule && hasOtherRule['.validate'] === true) {
    console.log('✅ WORKFLOW FIX DETECTED!');
    console.log('   rules.orgs.$orgId.workflowStaff.$projectId.$other[".validate"] = true');
    console.log('');
    console.log('✅ Fix detayları:');
    console.log('   - .read kuralı:', projectIdRules['.read'] ? 'Var ✅' : 'Yok ❌');
    console.log('   - .write kuralı:', projectIdRules['.write'] ? 'Var ✅' : 'Yok ❌');
    console.log('   - items kuralı:', projectIdRules.items ? 'Var ✅' : 'Yok ❌');
    console.log('   - stages kuralı:', projectIdRules.stages ? 'Var ✅' : 'Yok ❌');
    console.log('   - $other kuralı:', hasOtherRule ? 'Var ✅' : 'Yok ❌');
    console.log('');
  } else {
    console.log('❌ WORKFLOW FIX BULUNAMADI!');
    console.log('');
    console.log('Beklenen:');
    console.log('  rules.orgs.$orgId.workflowStaff.$projectId.$other = { ".validate": true }');
    console.log('');
    console.log('Bulunan:');
    console.log('  $other:', hasOtherRule || 'undefined');
    console.log('');
    process.exit(1);
  }
  
  // Diğer önemli kuralları kontrol et
  console.log('📋 Diğer kritik kurallar:');
  console.log('   - system.admins:', rules.rules?.system?.admins ? 'Var ✅' : 'Yok ❌');
  console.log('   - orgs.$orgId.members:', rules.rules?.orgs?.$orgId?.members ? 'Var ✅' : 'Yok ❌');
  console.log('   - orgs.$orgId.projectIndex:', rules.rules?.orgs?.$orgId?.projectIndex ? 'Var ✅' : 'Yok ❌');
  console.log('   - orgs.$orgId.projectPublic:', rules.rules?.orgs?.$orgId?.projectPublic ? 'Var ✅' : 'Yok ❌');
  console.log('   - orgs.$orgId.mediaMetadata:', rules.rules?.orgs?.$orgId?.mediaMetadata ? 'Var ✅' : 'Yok ❌');
  console.log('');
  
  console.log('═══════════════════════════════════════════════════════════');
  console.log('✅ VERIFICATION BAŞARILI - RULES HAZIR');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('');
  
} catch (error) {
  console.error('❌ Dosya okuma hatası:', error.message);
  process.exit(1);
}

// Deployment talimatları
console.log('');
console.log('🚀 DEPLOYMENT TALİMATLARI:');
console.log('');
console.log('Seçenek 1: Firebase Console (Manuel - ÖNERİLEN)');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('1. https://console.firebase.google.com/project/design-ac717/database/design-ac717-default-rtdb/rules');
console.log('2. Mevcut rules\'u YEDEKLE (kopyala-yapıştır yaparak güvenli bir yere kaydet)');
console.log('3. database.rules.json dosyasının TAMAMINI kopyala');
console.log('4. Firebase Console\'a yapıştır');
console.log('5. "Publish" butonuna tıkla');
console.log('6. Başarı mesajını bekle');
console.log('');
console.log('Seçenek 2: Firebase CLI');
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
console.log('npm install -g firebase-tools');
console.log('firebase login');
console.log('firebase deploy --only database');
console.log('');
console.log('═══════════════════════════════════════════════════════════');
console.log('');
console.log('📋 DEPLOYMENT SONRASI TEST ADIMLARI:');
console.log('');
console.log('1. lavora-calisma-masasi-v38-firebase.html dosyasını aç');
console.log('2. Admin olarak giriş yap (minifinise@gmail.com)');
console.log('3. Yeni bir proje yükle (Excel ile)');
console.log('4. Console\'u aç (F12) ve şunu KONTROL ET:');
console.log('   ❌ "permission_denied" hatası OLMAMALI');
console.log('   ✅ "Görsel raporu: bulunan X, eklenen Y" görmeli');
console.log('   ✅ "Proje kaydedildi" mesajı görmeli');
console.log('5. Sayfayı REFRESH at (F5)');
console.log('6. Proje listesinde KAYBOLMAMALI ✅');
console.log('');
console.log('═══════════════════════════════════════════════════════════');
console.log('');
console.log('Admin UID: KVpS3osYEWY5nwToHVumK5Aw4M62');
console.log('Org ID: lavora-main');
console.log('Database: https://design-ac717-default-rtdb.firebaseio.com');
console.log('');
console.log('═══════════════════════════════════════════════════════════');

process.exit(0);
