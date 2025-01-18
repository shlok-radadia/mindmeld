import { initializeApp } from 'firebase/app'
import {
    getFirestore, collection, onSnapshot, getDocs,
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
    document.getElementById('avg').innerText = `Average Correctly Guessed Words: ${user[0].memory.avg_correct}`
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



document.addEventListener("DOMContentLoaded", () => {
    const memoryItems = document.getElementById("memory_items");
    const recallPhase = document.getElementById("recall_phase");
    const result = document.getElementById("result");
    const startTestButton = document.getElementById("start_test");
    const submitAnswersButton = document.getElementById("submit_answers");
    const userInput = document.getElementById("user_input");
  
    // Sample word list
    const words = ["carrot", "apple", "banana", "cherry", "grapes", "lemon", "mango", "orange", "pineapple", "strawberry", "blueberry", "watermelon", "papaya", "kiwi", "peach", "guava", "pear", "potato", "tomato", "spinach", "onion", "garlic", "radish", "pumpkin", "cucumber"];
    let correctWords = [];
    let timer;
  
    // Start the test
    startTestButton.addEventListener("click", () => {
      startTestButton.style.display = "none";
      result.textContent = "";
      correctWords = [...words].sort(() => 0.5 - Math.random()).slice(0, 7); // Randomize and pick 3 words
      memoryItems.textContent = correctWords.join(" ");
      memoryItems.style.display = "flex";
  
      // Show words for 5 seconds
      timer = setTimeout(() => {
        memoryItems.style.display = "none";
        recallPhase.style.display = "flex";
      }, 5000);
    });
  
    // Submit answers
    submitAnswersButton.addEventListener("click", () => {
      clearTimeout(timer);
      recallPhase.style.display = "none";
      const userAnswers = userInput.value.split(" ").map(word => word.toLowerCase());
      const correctCount = userAnswers.filter(word => correctWords.includes(word)).length;
  
      result.textContent = `You remembered ${correctCount} out of ${correctWords.length} words correctly!`;

      let docRef = doc(db, 'Users', id)
            
        const colRef = collection(db, 'Users')
        const q = query(colRef, where("email", "==", emailid))

        // get collection data
        getDocs(q)
        .then(snapshot => {
            let user_now = [];
            snapshot.docs.forEach(doc => {
                user_now.push({ ...doc.data(), id: doc.id });
            });
            let avg_correct = user_now[0].memory.avg_correct || 0; // Default to 0 if undefined
            let number = user_now[0].memory.number || 0;
            
            // Calculate the new average
            avg_correct = ((avg_correct * number) + correctCount) / (number + 1);

            // Update Firestore document with the new avg and best
            updateDoc(docRef, {
                memory: {
                    avg_correct: avg_correct.toFixed(2),
                    number: number + 1
                }
            })
            .then(() => {
                console.log("Updated successfully!");
            });
        })
        .catch(err => {
            console.log(err.message);
        });


      startTestButton.style.display = "flex";
      userInput.value = ""; // Reset input field
    });
});

document.getElementById('back').addEventListener('click', () => {
    window.open("../home/index.html", "_self")
})