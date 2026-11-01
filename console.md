image-page.js:53 Loaded!😎
index.ts:189 Getir yüklemeyi bitirdi: POST "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyCwQjDdDHqHfGKYgSA5yI51fQfgFwc8cVU"
(anonim) @ index.ts:189
await in (anonim)
_performFetchWithErrorHandling @ index.ts:206
_performApiRequest @ index.ts:146
(anonim) @ account.ts:93
_reloadWithoutSaving @ reload.ts:36
await in _reloadWithoutSaving
reloadAndSetCurrentUserOrClear @ auth_impl.ts:394
initializeCurrentUser @ auth_impl.ts:331
await in initializeCurrentUser
(anonim) @ auth_impl.ts:196
Promise.then
queue @ auth_impl.ts:838
_initializeWithPersistence @ auth_impl.ts:163
(anonim) @ initialize.ts:86
getOrInitializeService @ provider.ts:318
initialize @ provider.ts:242
constructor @ auth.ts:71
(anonim) @ index.ts:82
getOrInitializeService @ provider.ts:318
getImmediate @ provider.ts:115
_getService @ firebaseApp.ts:138
(anonim) @ firebaseNamespaceCore.ts:185
(anonim) @ firebaseNamespaceCore.ts:166
startCloudMode @ LAVORAST/:2948
await in startCloudMode
(anonim) @ LAVORAST/:3059
(anonim) @ LAVORAST/:3060
LAVORAST/:2513 🔑 SENIN FIREBASE UID'N: KVpS3osYEWY5nwToHVumK5Aw4M62
LAVORAST/:2514 📧 Email: minifinise@gmail.com
LAVORAST/:2515 📋 Admin UID beklenen: KVpS3osYEWY5nwToHVumK5Aw4M62
LAVORAST/:2516 ⚠️ UID'ler eşleşiyor mu? ✅ EVET
LAVORAST/:2513 🔑 SENIN FIREBASE UID'N: KVpS3osYEWY5nwToHVumK5Aw4M62
LAVORAST/:2514 📧 Email: minifinise@gmail.com
LAVORAST/:2515 📋 Admin UID beklenen: KVpS3osYEWY5nwToHVumK5Aw4M62
LAVORAST/:2516 ⚠️ UID'ler eşleşiyor mu? ✅ EVET
iframe.js:277 XHR yüklemeyi bitirdi: GET "https://www.googleapis.com/identitytoolkit/v3/relyingparty/getProjectConfig?key=AIzaSyCwQjDdDHqHfGKYgSA5yI51fQfgFwc8cVU&cb=1793571741703"
k.send @ iframe.js:277
Rm.jm @ iframe.js:375
Ym @ iframe.js:373
(anonim) @ iframe.js:379
G @ iframe.js:160
bn @ iframe.js:379
(anonim) @ iframe.js:387
a @ iframe.js:159
(anonim) @ iframe.js:159
c @ iframe.js:159
e.Sc @ iframe.js:167
Cg @ iframe.js:170
yg @ iframe.js:170
G.Ck @ iframe.js:169
a @ iframe.js:159
(anonim) @ iframe.js:159
c @ iframe.js:159
gg @ iframe.js:160
a
$f @ iframe.js:160
tg @ iframe.js:166
G.then @ iframe.js:163
R @ iframe.js:387
hn @ iframe.js:379
(anonim) @ iframe.js:579
is.start @ iframe.js:578
js.start @ iframe.js:579
ls.start @ iframe.js:581
os @ iframe.js:583
(anonim) @ iframe.js:584
Zi @ iframe.js:243
b @ iframe.js:241
LAVORAST/:1 Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.
```javascript
// 1️⃣ ÖNCE: Firebase'de kaç proje var kontrol et
const checkProjects = async () => {
  const index = await firebase.database().ref('orgs/lavora-main/projectIndex').once('value');
  const projects = index.val() || {};
  console.log('📊 Firebase projectIndex:', Object.keys(projects).length, 'proje');
  Object.keys(projects).forEach(id => {
    console.log('  -', id, ':', projects[id].name);
  });
};

await checkProjects();

// 2️⃣ BİR PROJEYİ SİL (ilk duplicate'i seç)
const projectIdToDelete = 'mvyawkwi0br'; // İlk proje ID'si

const deleteOneProject = async (projectId) => {
  console.log('🗑️ Siliniyor:', projectId);
  
  try {
    await Promise.all([
      firebase.database().ref(`orgs/lavora-main/projectIndex/${projectId}`).remove(),
      firebase.database().ref(`orgs/lavora-main/projectPublic/${projectId}`).remove(),
      firebase.database().ref(`orgs/lavora-main/projectFinancials/${projectId}`).remove(),
      firebase.database().ref(`orgs/lavora-main/workflowStaff/${projectId}`).remove()
    ]);
    console.log('✅ Silindi:', projectId);
  } catch (e) {
    console.error('❌ Silme hatası:', e.message, e.code);
  }
};

await deleteOneProject(projectIdToDelete);

// 3️⃣ SONRA: Kontrol et
await checkProjects();
```
VM1776:22 Uncaught SyntaxError: Unexpected identifier 'orgs' (at VM1776:22:32)
LAVORAST/:1 Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.
LAVORAST/:1 Uncaught (in promise) Error: Could not establish connection. Receiving end does not exist.
```javascript
// 1️⃣ ÖNCE: Firebase'de kaç proje var kontrol et
const checkProjects = async () => {
  const index = await firebase.database().ref('orgs/lavora-main/projectIndex').once('value');
  const projects = index.val() || {};
  console.log('📊 Firebase projectIndex:', Object.keys(projects).length, 'proje');
  Object.keys(projects).forEach(id => {
    console.log('  -', id, ':', projects[id].name);
  });
};

await checkProjects();

// 2️⃣ BİR PROJEYİ SİL (ilk duplicate'i seç)
const projectIdToDelete = 'mvyawkwi0br'; // İlk proje ID'si

const deleteOneProject = async (projectId) => {
  console.log('🗑️ Siliniyor:', projectId);
  
  try {
    await Promise.all([
      firebase.database().ref(`orgs/lavora-main/projectIndex/${projectId}`).remove(),
      firebase.database().ref(`orgs/lavora-main/projectPublic/${projectId}`).remove(),
      firebase.database().ref(`orgs/lavora-main/projectFinancials/${projectId}`).remove(),
      firebase.database().ref(`orgs/lavora-main/workflowStaff/${projectId}`).remove()
    ]);
    console.log('✅ Silindi:', projectId);
  } catch (e) {
    console.error('❌ Silme hatası:', e.message, e.code);
  }
};

await deleteOneProject(projectIdToDelete);

// 3️⃣ SONRA: Kontrol et
await checkProjects();
```
VM1792:22 Uncaught SyntaxError: Unexpected identifier 'orgs' (at VM1792:22:32)
