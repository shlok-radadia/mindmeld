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
    document.getElementById('avg').innerText = `Average Reaction Time: ${user[0].attention.avg}`
    document.getElementById('highest').innerText = `Best Reaction Time: ${user[0].attention.best}`
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
    const gameArea = document.getElementById("game_area");
    const result = document.getElementById("result");
    const startTestButton = document.getElementById("start_test");
  
    let startTime; // Record the time the test starts
    const gridSize = 5; // 5x5 grid
    const totalItems = gridSize * gridSize;
  
    // Start the test
    startTestButton.addEventListener("click", () => {
      result.textContent = ""; // Clear previous results
      startTestButton.style.display = "none";
      generateGrid();
    });
  
    // Generate a grid of items with one odd item
    const generateGrid = () => {
      gameArea.innerHTML = ""; // Clear previous grid
      const oddItemIndex = Math.floor(Math.random() * totalItems);
  
      for (let i = 0; i < totalItems; i++) {
        const item = document.createElement("div");
        item.className = "item";
        if (i === oddItemIndex) {
          item.classList.add("odd");
          item.onclick = handleCorrectClick;
        } else {
          item.onclick = handleIncorrectClick;
        }
        gameArea.appendChild(item);
      }
  
      startTime = performance.now(); // Start timer
    };
  
    // Handle correct click
    const handleCorrectClick = () => {
      const endTime = performance.now();
      const reactionTime = (endTime - startTime).toFixed(2);
      result.textContent = `Correct! Your reaction time: ${reactionTime} ms`;

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
            
            let best = user_now[0].attention.best;
            if (parseFloat(best) > reactionTime) {
                best = reactionTime;
            }

            // Check if avg and number exist, else initialize them properly
            let avg = user_now[0].attention.avg || 0; // Default to 0 if undefined
            let number = user_now[0].attention.number || 0; // Default to 0 if undefined
            
            // Calculate the new average
            avg = ((avg * number) + parseFloat(reactionTime)) / (number + 1);
            console.log(`Initial Avg: ${user_now[0].attention.avg}\nInitial Number: ${user_now[0].attention.number}\nReaction Time: ${reactionTime}`);

            // Update Firestore document with the new avg and best
            updateDoc(docRef, {
                attention: {
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

      startTestButton.style.display = "block"; // Enable restart
      gameArea.innerHTML = "";
    };
  
    // Handle incorrect click
    const handleIncorrectClick = () => {
      result.textContent = "Wrong choice! Try again.";
    };
  });

document.getElementById('back').addEventListener('click', () => {
    window.open("../home/index.html", "_self")
})