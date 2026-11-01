const rules = require('./database.rules.json');

console.log('═══════════════════════════════════════════════════════════');
console.log('Media Rules Admin Check');
console.log('═══════════════════════════════════════════════════════════');
console.log('');

const mediaMetadata = rules.rules.orgs.$orgId.mediaMetadata?.staff?.$projectId?.$mediaId;
const mediaThumbnails = rules.rules.orgs.$orgId.mediaThumbnails?.staff?.$projectId?.$mediaId;
const mediaPayloads = rules.rules.orgs.$orgId.mediaPayloads?.staff?.$projectId?.$mediaId;

console.log('📋 mediaMetadata/staff/$projectId/$mediaId:');
if (mediaMetadata) {
  const writeRule = mediaMetadata['.write'];
  console.log('  .write:', writeRule);
  console.log('  Has system/admins:', writeRule.includes('system/admins') ? '✅' : '❌');
  console.log('  Has .child("status").val():', writeRule.includes('.child("status").val()') ? '✅' : '❌');
} else {
  console.log('  ❌ NOT FOUND');
}
console.log('');

console.log('📋 mediaThumbnails/staff/$projectId/$mediaId:');
if (mediaThumbnails) {
  const writeRule = mediaThumbnails['.write'];
  console.log('  .write:', writeRule);
  console.log('  Has system/admins:', writeRule.includes('system/admins') ? '✅' : '❌');
  console.log('  Has .child("status").val():', writeRule.includes('.child("status").val()') ? '✅' : '❌');
} else {
  console.log('  ❌ NOT FOUND');
}
console.log('');

console.log('📋 mediaPayloads/staff/$projectId/$mediaId:');
if (mediaPayloads) {
  const writeRule = mediaPayloads['.write'];
  console.log('  .write:', writeRule);
  console.log('  Has system/admins:', writeRule.includes('system/admins') ? '✅' : '❌');
  
  if (writeRule.includes('.exists()')) {
    console.log('  ❌ PROBLEM: Uses .exists() instead of .child("status").val() === "active"');
    console.log('');
    console.log('Expected:');
    console.log('  root.child("system/admins/" + auth.uid).child("status").val() === "active"');
    console.log('');
    console.log('Found:');
    console.log('  root.child("system/admins/" + auth.uid).exists()');
    console.log('');
    console.log('This will cause permission_denied!');
  } else if (writeRule.includes('.child("status").val()')) {
    console.log('  ✅ Correct: Uses .child("status").val() === "active"');
  } else {
    console.log('  ⚠️  Cannot determine admin check pattern');
  }
} else {
  console.log('  ❌ NOT FOUND');
}

console.log('');
console.log('═══════════════════════════════════════════════════════════');
