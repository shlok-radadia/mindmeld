import { initializeApp } from 'firebase/app'
import {
  getFirestore, collection, onSnapshot,
  addDoc, deleteDoc, doc,
  query, where,
  orderBy, serverTimestamp,
  updateDoc
} from 'firebase/firestore'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword, signOut,
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

// init firebase
initializeApp(firebaseConfig)

// init services
const db = getFirestore()
const auth = getAuth()

let emailid = ""
let user=[];
let id;

const unsubAuth = onAuthStateChanged(auth, (user) => {
    console.log('user status changed:', user)
    if(!user){
        window.open("../../login/index.html", "_self");
    }
    else{
        emailid = user.email
        console.log(emailid)
        get_user_data()
    }
})

function get_user_data(){
    const user_col = collection(db, 'Users')
    const user_data = query(user_col, where("email", "==", emailid))

    // realtime collection data
    onSnapshot(user_data, (snapshot) => {
        user=[]
        snapshot.docs.forEach(doc => {
            user.push({ ...doc.data(), id: doc.id })
    })
    console.log(user)
    document.getElementById('first_name').innerHTML = `First Name: ${user[0].first_name}`
    document.getElementById('last_name').innerHTML = `Last Name: ${user[0].last_name}`
    document.getElementById('age').innerHTML = `Age: ${user[0].age}`
    document.getElementById('email').innerHTML = `Email: ${user[0].email}`
    document.getElementById('gender').innerHTML = `Gender: ${user[0].gender}`

    document.getElementById('memory_avg_correct').innerHTML = `Average Correctly Guessed Words: ${user[0].memory.avg_correct}`
    document.getElementById('memory_number').innerHTML = `Number of Tests: ${user[0].memory.number}`

    document.getElementById('attention_avg').innerHTML = `Average Reaction Time: ${user[0].attention.avg}`
    document.getElementById('attention_best').innerHTML = `Best Reaction Time: ${user[0].attention.best}`
    document.getElementById('attention_number').innerHTML = `Number of Tests: ${user[0].attention.number}`

    document.getElementById('reaction_avg').innerHTML = `Average Reaction Time: ${user[0].reaction.avg}`
    document.getElementById('reaction_best').innerHTML = `Best Reaction Time: ${user[0].reaction.best}`
    document.getElementById('reaction_number').innerHTML = `Number of Tests: ${user[0].reaction.number}`

    document.getElementById('problem_avg_score').innerHTML = `Average Score: ${user[0].problem.avg_score}`
    document.getElementById('problem_avg_acc').innerHTML = `Average Accuracy: ${user[0].problem.avg_accuracy}`
    document.getElementById('problem_number').innerHTML = `Number of Tests: ${user[0].problem.number}`
    id = user[0].id
    })

    // getDocs(user_data)
    // .then(snapshot => {
    //     // console.log(snapshot.docs)
    //     snapshot.docs.forEach(doc => {
    //     user.push({ ...doc.data(), id: doc.id })
    //     })
    //     console.log(user)
    //     document.getElementById('avg').innerText = `Average Reaction Time: ${user[0].reaction.avg}`
    //     document.getElementById('highest').innerText = `Best Reaction Time: ${user[0].reaction.best}`
    //     id = user[0].id
    // })
    // .catch(err => {
    //     console.log(err.message)
    // })
}

const logoutButton = document.querySelector('#logout')
logoutButton.addEventListener('click', () => {
  signOut(auth)
    .then(() => {
      console.log('user signed out')
      window.open("../../login/index.html", "_self");
    })
    .catch(err => {
      console.log(err.message)
    })
})

document.getElementById('back').addEventListener('click', () => {
  window.open("../home/index.html", "_self")
})