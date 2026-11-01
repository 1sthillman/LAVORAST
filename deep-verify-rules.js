#!/usr/bin/env node

/**
 * DEEP DATABASE RULES VERIFICATION
 * 
 * Bu script BÜTÜN kritik kuralları tek tek kontrol eder
 */

const fs = require('fs');
const path = require('path');

console.log('═══════════════════════════════════════════════════════════');
console.log('🔍 DEEP LAVORA RULES VERIFICATION');
console.log('═══════════════════════════════════════════════════════════');
console.log('');

// Database rules dosyasını oku
const rulesPath = path.join(__dirname, 'database.rules.json');
const rulesContent = fs.readFileSync(rulesPath, 'utf8');
const rules = JSON.parse(rulesContent);

console.log('✅ database.rules.json loaded');
console.log('');

let errors = [];
let warnings = [];

// Helper function
function checkRule(path, rule, expected) {
  if (!rule) {
    errors.push(`❌ ${path}: MISSING`);
    return false;
  }
  
  const actual = JSON.stringify(rule);
  if (expected && actual.indexOf(expected) === -1) {
    errors.push(`❌ ${path}: Beklenen pattern bulunamadı`);
    errors.push(`   Aranan: ${expected}`);
    errors.push(`   Bulunan: ${actual.substring(0, 200)}...`);
    return false;
  }
  
  console.log(`✅ ${path}: OK`);
  return true;
}

console.log('🔍 CHECKING CRITICAL RULES:');
console.log('');

// 1. System admins
console.log('1. System Admins:');
const systemAdmins = rules.rules?.system?.admins;
checkRule('system/admins [.read]', systemAdmins?.['.read'], 'auth != null');
checkRule('system/admins [.write]', systemAdmins?.['.write'], "status').val() === 'active'");
console.log('');

// 2. Org members
console.log('2. Org Members:');
const orgMembers = rules.rules?.orgs?.$orgId?.members;
checkRule('orgs/$orgId/members [.read]', orgMembers?.['.read'], "system/admins");
const memberUid = orgMembers?.$uid;
checkRule('orgs/$orgId/members/$uid [.write]', memberUid?.['.write'], "status').val() === 'active'");
console.log('');

// 3. Project Index
console.log('3. Project Index:');
const projectIndex = rules.rules?.orgs?.$orgId?.projectIndex;
checkRule('projectIndex [.read]', projectIndex?.['.read'], 'system/admins');

const projectIdIndex = projectIndex?.$projectId;
checkRule('projectIndex/$projectId [.write]', projectIdIndex?.['.write'], 'system/admins');
checkRule('projectIndex/$projectId [.validate]', projectIdIndex?.['.validate'], 'hasChildren');

// CRITICAL: workflowUpdatedAt sub-write rule
const workflowUpdatedAt = projectIdIndex?.workflowUpdatedAt;
if (workflowUpdatedAt) {
  const writeRule = workflowUpdatedAt['.write'];
  if (writeRule && writeRule.indexOf('.exists()') > -1) {
    errors.push('❌ projectIndex/$projectId/workflowUpdatedAt: .exists() kullanılmamalı!');
    errors.push('   Doğru: root.child("system/admins/" + auth.uid).child("status").val() === "active"');
    errors.push('   Yanlış: root.child("system/admins/" + auth.uid).exists()');
  } else if (writeRule && writeRule.indexOf('.child("status").val()') > -1) {
    console.log('✅ projectIndex/$projectId/workflowUpdatedAt [.write]: FIXED ✓');
  } else {
    warnings.push('⚠️  projectIndex/$projectId/workflowUpdatedAt: write rule check edilemedi');
  }
} else {
  errors.push('❌ projectIndex/$projectId/workflowUpdatedAt: MISSING');
}
console.log('');

// 4. WorkflowStaff
console.log('4. WorkflowStaff:');
const workflowStaff = rules.rules?.orgs?.$orgId?.workflowStaff;
const workflowProject = workflowStaff?.$projectId;
checkRule('workflowStaff/$projectId [.read]', workflowProject?.['.read'], 'system/admins');
checkRule('workflowStaff/$projectId [.write]', workflowProject?.['.write'], 'system/admins');

// CRITICAL: $other validation
const workflowOther = workflowProject?.$other;
if (workflowOther && workflowOther['.validate'] === true) {
  console.log('✅ workflowStaff/$projectId/$other [.validate]: true ✓');
} else {
  errors.push('❌ workflowStaff/$projectId/$other: .validate !== true');
}
console.log('');

// 5. Media Rules
console.log('5. Media Rules:');
const mediaMetadata = rules.rules?.orgs?.$orgId?.mediaMetadata;
const mediaStaffProject = mediaMetadata?.staff?.$projectId;
const mediaStaffMedia = mediaStaffProject?.$mediaId;

checkRule('mediaMetadata/staff/$projectId/$mediaId [.read]', mediaStaffMedia?.['.read'], 'system/admins');
checkRule('mediaMetadata/staff/$projectId/$mediaId [.write]', mediaStaffMedia?.['.write'], 'system/admins');

const mediaThumbnails = rules.rules?.orgs?.$orgId?.mediaThumbnails;
const thumbMedia = mediaThumbnails?.staff?.$projectId?.$mediaId;
checkRule('mediaThumbnails/staff/$projectId/$mediaId [.write]', thumbMedia?.['.write'], 'system/admins');

const mediaPayloads = rules.rules?.orgs?.$orgId?.mediaPayloads;
const payloadMedia = mediaPayloads?.staff?.$projectId?.$mediaId;
checkRule('mediaPayloads/staff/$projectId/$mediaId [.write]', payloadMedia?.['.write'], 'system/admins');
console.log('');

// 6. ProjectPublic
console.log('6. ProjectPublic:');
const projectPublic = rules.rules?.orgs?.$orgId?.projectPublic?.$projectId;
checkRule('projectPublic/$projectId [.write]', projectPublic?.['.write'], 'system/admins');
console.log('');

// 7. ProjectFinancials
console.log('7. ProjectFinancials:');
const projectFin = rules.rules?.orgs?.$orgId?.projectFinancials?.$projectId;
checkRule('projectFinancials/$projectId [.write]', projectFin?.['.write'], 'system/admins');
console.log('');

// Summary
console.log('═══════════════════════════════════════════════════════════');
if (errors.length === 0 && warnings.length === 0) {
  console.log('✅✅✅ ALL CHECKS PASSED! ✅✅✅');
  console.log('');
  console.log('Database rules are ready for deployment.');
} else {
  if (errors.length > 0) {
    console.log('❌ ERRORS FOUND:');
    errors.forEach(e => console.log(e));
    console.log('');
  }
  
  if (warnings.length > 0) {
    console.log('⚠️  WARNINGS:');
    warnings.forEach(w => console.log(w));
    console.log('');
  }
}
console.log('═══════════════════════════════════════════════════════════');
console.log('');

if (errors.length > 0) {
  console.log('🛑 FIX REQUIRED - Rules cannot be deployed');
  process.exit(1);
} else {
  console.log('🚀 READY TO DEPLOY');
  console.log('');
  console.log('Next steps:');
  console.log('1. https://console.firebase.google.com/project/design-ac717/database/design-ac717-default-rtdb/rules');
  console.log('2. Backup current rules');
  console.log('3. Paste database.rules.json content');
  console.log('4. Click "Publish"');
  console.log('5. Test: Upload project → Refresh → Project should persist');
  process.exit(0);
}
