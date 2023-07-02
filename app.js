import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js'
import { getFirestore, collection, addDoc, serverTimestamp, doc, deleteDoc, onSnapshot, } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js'

const firebaseConfig = {
  apiKey: 'AIzaSyDWvbYwZK6CrG1HRrzQzTryYpzsWrpxm-4',
  authDomain: 'hinario-ccb-c94f3.firebaseapp.com',
  projectId: 'hinario-ccb-c94f3',
  storageBucket: 'hinario-ccb-c94f3.appspot.com',
  messagingSenderId: '525179451222',
  appId: '1:525179451222:web:645112b1647301d30708f7',
  measurementId: 'G-8L1BJ8ZJ68',
}
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const collectionHymns = collection(db, 'hinos')

const formAddHymn = document.querySelector('[data-js="add-hymn-form"]')
// const hymnsList = document.querySelector('[data-js="hymns-list"]')

onSnapshot(collectionHymns, querySnapshot => console.log(querySnapshot))

const treatFormValues = (form, timestamp = false) => {
  const data = new FormData(form)
  const items = {}

  for (const [key, value] of data) items[key] = value

  if (timestamp === true) items.createdAt = serverTimestamp()

  return items
}

formAddHymn.addEventListener('submit', async (e) => {
  e.preventDefault()

  const items = treatFormValues(formAddHymn, true)

  const doc = await addDoc(collectionHymns, items)
  console.log('Document criado com o ID', doc.id)
})
