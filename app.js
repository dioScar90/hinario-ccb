import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js'
import { getFirestore, collection, query, where, addDoc, updateDoc, serverTimestamp, doc, deleteDoc, onSnapshot, } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js'

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

const getUrlParam = strGet => new URL(location).searchParams.get(strGet)
const issetHymnNumber = () => getUrlParam('number')

const formAddHymn = document.querySelector('[data-js="add-hymn-form"]')
// const hymnsList = document.querySelector('[data-js="hymns-list"]')

onSnapshot(collectionHymns, querySnapshot => {
  const { hasPendingWrites } = querySnapshot.metadata
  if (!hasPendingWrites)
    return
    
  console.log(querySnapshot)
})

const treatFormValues = (form, timestamp = false) => {
  const data = new FormData(form)
  const items = {}

  for (const [key, value] of data) {
    items[key] = key === 'number' ? +value : value
  }

  if (timestamp === true) {
    items.createdAt = serverTimestamp()
  }

  return items
}

formAddHymn.addEventListener('submit', async function(e) {
  e.preventDefault()

  const items = treatFormValues(this, true)
  const idToUpdate = items?.id

  if (idToUpdate) {
    const newItems = { ...items }
    newItems.updatedAt = newItems.createdAt
    delete newItems.createdAt
    // const { id: updatedId } = await updateDoc(doc(db, 'hinos', idToUpdate), newItems)
    // console.log('Document atualizado no ID', updatedId)
    const yes = await updateDoc(doc(db, 'hinos', idToUpdate), newItems)
    console.log(yes)

    this.reset()
    return
  }

  const { id: createdId } = await addDoc(collectionHymns, items)
  console.log('Document criado com o ID', createdId)

  this.reset()
})

const prepareInputsToUpdate = hymnNumber => {
  const hymn = query(collectionHymns, where('number', '==', hymnNumber))

  console.log(hymn)
  // onSnapshot(collectionHymns, ({ docs }) => {
  //   const checkHymnNumber = collectionDoc => {
  //     return collectionDoc._document.data.value.mapValue.fields.number?.integerValue == hymnNumber ||
  //     collectionDoc._document.data.value.mapValue.fields.number?.stringValue == hymnNumber
  //   }
  
  //   const docOfHymnNumber = docs.find(checkHymnNumber)
  //   const fields = docOfHymnNumber._document.data.value.mapValue.fields
  //   const docId = docOfHymnNumber.id
  
  //   formAddHymn.insertAdjacentHTML('afterbegin', `<input type="hidden" name="id" value="${docId}">`)
  //   formAddHymn.querySelector('button[type="submit"]').innerText = 'Atualizar'
  
  //   for (const prop in fields) {
  //     const inputOrSelect = formAddHymn.querySelector(`:is(input, select)[name="${prop}"]`)
  //     const docValue = Object.values(fields[prop]).at(0)
  
  //     if (!inputOrSelect) {
  //       continue
  //     }
  
  //     if (inputOrSelect.tagName === 'SELECT') {
  //       for (const option of inputOrSelect.options) {
  //         if (option.value === docValue) {
  //           option.selected = true
  //           break
  //         }
  //       }
  
  //       continue
  //     }
  
  //     inputOrSelect.value = docValue

  //     if (inputOrSelect.name === 'number')
  //       inputOrSelect.readOnly = true
  //   }
  // })
}

const init = () => {
  const hymnNumber = issetHymnNumber()

  if (hymnNumber) {
    prepareInputsToUpdate(hymnNumber)
  }
}

document.addEventListener('DOMContentLoaded', init)