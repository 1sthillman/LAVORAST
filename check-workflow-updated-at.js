const rules = require('./database.rules.json');
const workflowUpdatedAt = rules.rules.orgs.$orgId.projectIndex.$projectId.workflowUpdatedAt;

console.log('═══════════════════════════════════════════════════════════');
console.log('workflowUpdatedAt Rule Analysis');
console.log('═══════════════════════════════════════════════════════════');
console.log('');

if (workflowUpdatedAt) {
  const writeRule = workflowUpdatedAt['.write'];
  const validateRule = workflowUpdatedAt['.validate'];
  
  console.log('✅ workflowUpdatedAt node exists');
  console.log('');
  console.log('📋 .validate rule:');
  console.log(validateRule);
  console.log('');
  console.log('📋 .write rule:');
  console.log(writeRule);
  console.log('');
  console.log('═══════════════════════════════════════════════════════════');
  console.log('🔍 Analysis:');
  console.log('');
  
  const hasExists = writeRule && writeRule.includes('.exists()');
  const hasStatusCheck = writeRule && writeRule.includes('.child("status").val()');
  const hasAdminCheck = writeRule && writeRule.includes('system/admins');
  
  console.log('Has .exists() check:', hasExists ? '❌ YES (WRONG!)' : '✅ NO (GOOD)');
  console.log('Has .child("status").val() check:', hasStatusCheck ? '✅ YES (GOOD)' : '❌ NO (MISSING!)');
  console.log('Has system/admins check:', hasAdminCheck ? '✅ YES' : '❌ NO');
  console.log('');
  
  if (hasExists && !hasStatusCheck) {
    console.log('❌ PROBLEM FOUND:');
    console.log('   Admin check uses .exists() instead of .child("status").val() === "active"');
    console.log('');
    console.log('Expected pattern:');
    console.log('  root.child("system/admins/" + auth.uid).child("status").val() === "active"');
    console.log('');
    console.log('Current pattern includes:');
    console.log('  root.child("system/admins/" + auth.uid).exists()');
    console.log('');
    console.log('This will cause permission_denied because .exists() returns false!');
  } else if (hasStatusCheck) {
    console.log('✅ RULE IS CORRECT');
    console.log('   Admin check properly uses .child("status").val() === "active"');
  }
} else {
  console.log('❌ workflowUpdatedAt node NOT FOUND!');
}

console.log('═══════════════════════════════════════════════════════════');
