import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js'
import { getFirestore, collection, addDoc, updateDoc, serverTimestamp, doc, deleteDoc, onSnapshot, } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js'

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

onSnapshot(collectionHymns, querySnapshot => console.log(querySnapshot))

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
    const doc = await updateDoc(doc(db, 'hinos', idToUpdate), newItems)
    console.log('Document atualizado no ID', doc.id)

    this.reset()
    return
  }

  const doc = await addDoc(collectionHymns, items)
  console.log('Document criado com o ID', doc.id)

  this.reset()
})

const init = () => {
  const hymnNumber = issetHymnNumber()

  if (hymnNumber) {
    onSnapshot(collectionHymns, ({ docs }) => {
      const checkHymnNumber = doc => {
        return doc._document.data.value.mapValue.fields.number?.integerValue == hymnNumber ||
        doc._document.data.value.mapValue.fields.number?.stringValue == hymnNumber
      }

      const docOfHymnNumber = docs.find(checkHymnNumber)
      const rightDoc = docOfHymnNumber._document.data.value.mapValue.fields

      for (const prop in rightDoc) {
        const inputOrSelect = formAddHymn.querySelector(`:is(input, select)[name="${prop}"]`)
        const docValue = Object.values(rightDoc[prop]).at(0)

        if (!inputOrSelect) {
          if (prop === 'id')
            formAddHymn.insertAdjacentHTML('afterbegin', `<input type="hidden" name="id" value="${docValue}">`)
          
          continue
        }

        if (inputOrSelect.tagName === 'SELECT') {
          for (const option of inputOrSelect.options) {
            if (option.value === docValue) {
              option.selected = true
              break
            }
          }

          continue
        }

        inputOrSelect.value = docValue
      }
    })
  }
}

document.addEventListener('DOMContentLoaded', init)