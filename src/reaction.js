function pfp_square() {
    const testContainer = document.getElementById('test_container');
    const reaction_box = document.getElementById('reaction_box');
    const start_button = document.getElementById('start_button');
    const height = reaction_box.offsetHeight;
    reaction_box.style.width = `${height}px`;
    start_button.style.width = `${height}px`;
    const containerWidth = testContainer.offsetWidth;
    const centerX = (containerWidth - height) / 2;
    reaction_box.style.left = `${centerX}px`;
    start_button.style.left = `${centerX}px`;
}
window.addEventListener('load', pfp_square);
window.addEventListener('resize', pfp_square);
  

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
    document.getElementById('avg').innerText = `Average Reaction Time: ${user[0].reaction.avg}`
    document.getElementById('highest').innerText = `Best Reaction Time: ${user[0].reaction.best}`
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
    const reactionBox = document.getElementById("reaction_box");
    const instructions = document.getElementById("instructions");
    const result = document.getElementById("result");
    const startButton = document.getElementById("start_button");
  
    let startTime; // For calculating reaction time
    let isClickable = false;
  
    // Start Test
    startButton.addEventListener("click", () => {
      startButton.style.display = "none";
      result.textContent = "";
      instructions.textContent = "Wait for the box to turn green...";
      startButton.disabled = true;
      isClickable = false;
      reactionBox.style.backgroundColor = "red";
  
      // Randomize delay (2-5 seconds)
      const delay = Math.floor(Math.random() * 3000) + 2000;
  
      setTimeout(() => {
        instructions.textContent = "Click now!";
        reactionBox.style.backgroundColor = "#00ff00";
        startTime = performance.now();
        isClickable = true;
      }, delay);
    });
  
    // Handle User Click
    reactionBox.addEventListener("click", () => {
      startButton.style.display = "flex";
      if (!isClickable) {
        result.textContent = "Too soon! Wait for the box to turn green.";
      } else {
        const reactionTime = performance.now() - startTime;
        result.textContent = `Your reaction time: ${reactionTime.toFixed(2)} ms`;

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
            
            let best = user_now[0].reaction.best;
            if (parseFloat(best) > reactionTime.toFixed(2)) {
                best = reactionTime.toFixed(2);
            }

            // Check if avg and number exist, else initialize them properly
            let avg = user_now[0].reaction.avg || 0; // Default to 0 if undefined
            let number = user_now[0].reaction.number || 0; // Default to 0 if undefined
            
            // Calculate the new average
            avg = ((avg * number) + parseFloat(reactionTime.toFixed(2))) / (number + 1);
            console.log(`Initial Avg: ${user_now[0].reaction.avg}\nInitial Number: ${user_now[0].reaction.number}\nReaction Time: ${reactionTime.toFixed(2)}`);

            // Update Firestore document with the new avg and best
            updateDoc(docRef, {
                reaction: {
                    avg: parseFloat(avg).toFixed(2), // Ensure avg is a float
                    best: parseFloat(best).toFixed(2),
                    number: number + 1 // Increment the number of tries
                }
            })
            .then(() => {
                console.log("Updated successfully!");
            });
        })
        .catch(err => {
            console.log(err.message);
        });

        isClickable = false; // Prevent further clicks until restart
        startButton.disabled = false; // Enable restart
      }
    });
});


document.getElementById('back').addEventListener('click', () => {
    window.open("../home/index.html", "_self")
})