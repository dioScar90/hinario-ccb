import { initializeApp } from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-app.js'
import { getFirestore, collection, query, where, getDocs, addDoc, updateDoc, serverTimestamp, doc, deleteDoc, onSnapshot, }
  from 'https://www.gstatic.com/firebasejs/9.23.0/firebase-firestore.js'

const firebaseConfig = {
  apiKey: 'AIzaSyDWvbYwZK6CrG1HRrzQzTryYpzsWrpxm-4',
  authDomain: 'hinario-ccb-c94f3.firebaseapp.com',
  projectId: 'hinario-ccb-c94f3',
  storageBucket: 'hinario-ccb-c94f3.appspot.com',
  messagingSenderId: '525179451222',
  appId: '1:525179451222:web:645112b1647301d30708f7',
  measurementId: 'G-8L1BJ8ZJ68',
  'Access-Control-Allow-Origin': '*',
}
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)
const collectionHymns = collection(db, 'hinos')

const getCurrentUrl = () => new URL(location)
const getUrlParam = strGet => getCurrentUrl().searchParams.get(strGet)
const issetHymnNumber = () => getUrlParam('number')

const formAddHymn = document.querySelector('[data-js="add-hymn-form"]')
const btnOpenPdf = document.querySelector('button[data-pdf]')

onSnapshot(collectionHymns, querySnapshot => {
  const { hasPendingWrites } = querySnapshot.metadata
  if (!hasPendingWrites)
    return
    
  console.log(querySnapshot)
})

const parseValue = (key, value) => ({
  'number': +value,
})[key] || value

const setTimestampValue = items => {
  const keyTime = items.id ? 'updatedAt' : 'createdAt'
  items[keyTime] = serverTimestamp()
}

const treatFormValues = (form, timestamp = false) => {
  const data = new FormData(form)
  const items = {}

  for (const [key, value] of data) {
    items[key] = parseValue(key, value)
  }

  if (timestamp === true) {
    setTimestampValue(items)
  }
  
  return items
}

function whenFormReset(e) {
  const inputId = this.querySelector('input[name="id"]')
  const inputNumber = this.querySelector('input[name="number"]')
  const btnSubmit = this.querySelector('button[type="submit"]')

  inputId?.remove()
  inputNumber.readOnly = false
  btnSubmit.innerText = 'Criar'
}

async function whenFormSubmit(e) {
  e.preventDefault()

  const items = treatFormValues(this, true)
  const idToUpdate = items?.id

  if (idToUpdate) {
    delete items.id
    const yes = await updateDoc(doc(db, 'hinos', idToUpdate), items)
    console.log(yes)

    const newUrl = getCurrentUrl()
    newUrl.searchParams('number', yes.id)

    this.reset()
    location = newUrl
    return
  }

  const { id: createdId } = await addDoc(collectionHymns, items)
  console.log('Document criado com o ID', createdId)

  this.reset()
} 

formAddHymn.addEventListener('reset', whenFormReset)
formAddHymn.addEventListener('submit', whenFormSubmit)

const prepareInputsToUpdate = hymnNumber => {
  onSnapshot(collectionHymns, querySnapshot => {
    const myDocs = []
    querySnapshot.forEach(doc => myDocs.push({ ...doc.data(), id: doc.id }))
    const hymn = myDocs.find(doc => doc.number == hymnNumber)

    console.log(hymn)
    
    for (const prop in hymn) {
      const inputOrSelect = formAddHymn.querySelector(`:is(input, select)[name="${prop}"]`)
      const docValue = hymn[prop]
  
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

      if (inputOrSelect.name === 'number')
        inputOrSelect.readOnly = true
    }

    formAddHymn.querySelector('button[type="submit"]').innerText = 'Atualizar'

    console.log(hymn)
  })
}

const init = () => {
  const hymnNumber = issetHymnNumber()

  if (hymnNumber) {
    prepareInputsToUpdate(hymnNumber)
  }
}

btnOpenPdf.addEventListener('click', () => open('hinario_5_organista.pdf', '_blank'))
document.addEventListener('DOMContentLoaded', init)