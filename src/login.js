import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc,
    query, where,
    orderBy, serverTimestamp,
    getDoc, updateDoc
} from 'firebase/firestore'
import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut, signInWithEmailAndPassword,
    onAuthStateChanged
} from 'firebase/auth'


const firebaseConfig = {
  apiKey: "AIzaSyBHPtESvf8eiZWtptO6yxsK3iQ8qPIVvuc",
  authDomain: "mindmeld-7cd54.firebaseapp.com",
  projectId: "mindmeld-7cd54",
  storageBucket: "mindmeld-7cd54.firebasestorage.app",
  messagingSenderId: "786288208702",
  appId: "1:786288208702:web:b80523be1b3dac0af89a6f"
};

initializeApp(firebaseConfig)

const db = getFirestore()
const auth = getAuth()

const user_col = collection(db, 'Users')

const unsubCol = onSnapshot(user_col, (snapshot) => {
  let users = []
  snapshot.docs.forEach((doc) => {
      users.push({ ...doc.data(), id: doc.id })
  })
  console.log(users)
})

const unsubAuth = onAuthStateChanged(auth, (user) => {
  console.log('user status changed:', user)
  if(user){
      window.open("../app/home/index.html", "_self");
  }
})


const login = document.querySelector('#login_form')
login.addEventListener('submit', (e) => {
  e.preventDefault()

  const email = login.email.value
  const password = login.password.value

  if(!email || !password){
    alert("Please fill the details correctly.")
  }
  else{
    signInWithEmailAndPassword(auth, email, password)
    .then(cred => {
      console.log('user logged in:', cred.user)
      login.reset()
      window.open("../app/home/index.html", "_self");
    })
    .catch(err => {
      alert("Incorrect credentials.")
    })
  }
})