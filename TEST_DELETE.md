# DELETE TEST SCRIPT

Console'a yapıştır ve test et:

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

## Expected Result:
- İlk check: 8 proje
- Delete işlemi: ✅ Silindi
- İkinci check: 7 proje

## If Delete Fails:
- permission_denied hatası → rules sorunu
- Başka hata → Firebase bağlantı sorunu
