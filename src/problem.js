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
    document.getElementById('avg_score').innerText = `Average Score: ${user[0].problem.avg_score}`
    document.getElementById('avg_accuracy').innerText = `Average Accuracy: ${user[0].problem.avg_accuracy}`
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




function rand_op(){
    let op = ["+", "-", "*", "/"];
    const randomElement = op[Math.floor(Math.random() * op.length)];
    return randomElement;
}

function rand_num(){
    return Math.floor(Math.random() * 9) + 1;
}

function generate_question(){
    const num = Math.floor(Math.random() * 3) + 1;
    let str = `${num}`
    let i = 0
    for(i; i<=num; i++){
        str += `${rand_op()}${rand_num()}`
    }
    return str;
}

function generate(){
    let question = generate_question();
    let correctAnswer = eval(question);
    let array = [(correctAnswer + Math.floor(Math.random() * 10) - 5).toFixed(2), (correctAnswer + Math.floor(Math.random() * 10) - 5).toFixed(2), (correctAnswer + Math.floor(Math.random() * 10) - 5).toFixed(2)]
    const randomIndex = Math.floor(Math.random() * (3 + 1));
    array.splice(randomIndex, 0, correctAnswer.toFixed(2));
    return {
        question: question,
        options: array,
        correctAnswer: randomIndex
    }
}


function updateUserData(score, accuracy) {
    // Ensure we are properly fetching and updating the user data
    const docRef = doc(db, 'Users', id);
    const colRef = collection(db, 'Users');
    const q = query(colRef, where("email", "==", emailid));

    // Get collection data
    getDocs(q)
    .then(snapshot => {
        let user_now = [];
        snapshot.docs.forEach(doc => {
            user_now.push({ ...doc.data(), id: doc.id });
        });

        // Initialize variables and handle NaN values
        let avg_score = user_now[0].problem.avg_score || 0; // Default to 0 if undefined
        let avg_accuracy = user_now[0].problem.avg_accuracy || 0; // Default to 0 if undefined
        let number = user_now[0].problem.number || 0; // Default to 0 if undefined

        // Calculate the new average for score
        avg_score = ((avg_score * number) + parseFloat(score)) / (number + 1);
        
        // Calculate the new average for accuracy
        avg_accuracy = ((avg_accuracy * number) + parseFloat(accuracy)) / (number + 1);

        // Round averages to two decimal places
        avg_score = avg_score.toFixed(2);
        avg_accuracy = avg_accuracy.toFixed(2);

        // Update Firestore document with the new avg_score and avg_accuracy
        updateDoc(docRef, {
            problem: {
                avg_score: parseFloat(avg_score), // Ensure avg_score is a float
                avg_accuracy: parseFloat(avg_accuracy), // Ensure avg_accuracy is a float
                number: number + 1 // Increment the number of tries
            }
        })
        .then(() => {
            console.log("User data updated successfully!");
        });
    })
    .catch(err => {
        console.log(err.message);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const questionArea = document.getElementById("question_area");
    const optionsArea = document.getElementById("options");
    const feedback = document.getElementById("feedback");
    const startButton = document.getElementById("start_button");
    const timerDisplay = document.getElementById("time_left");

    let currentQuestion = 0;
    let correct_questions = 0;
    let score = 0;
    let accuracy = 0;
    let timer;
    const timeLimit = 100; // in seconds
    const questions = [generate(), generate(), generate(), generate(), generate(), generate(), generate(), generate(), generate(), generate()];

    // Start Test
    startButton.addEventListener("click", () => {
        currentQuestion = 0;
        feedback.textContent = "";
        startButton.style.display = "none";
        loadQuestion();
        startTimer();
    });

    // Load Question
    const loadQuestion = () => {
        if (currentQuestion < questions.length) {
            const questionData = questions[currentQuestion];
            questionArea.querySelector("#question").textContent = questionData.question;
            optionsArea.innerHTML = ""; // Clear old options

            questionData.options.forEach((option, index) => {
                const li = document.createElement("li");
                li.textContent = option;
                li.onclick = () => checkAnswer(index);
                optionsArea.appendChild(li);
            });
        } else {
            accuracy = ((correct_questions / 10) * 100).toFixed(2);
            document.getElementById("score").innerText = `Score: ${score}`;
            document.getElementById("accuracy").innerText = `Accuracy: ${accuracy}`;

            // Update the user's data after the test
            updateUserData(score, accuracy);

            // Display the result
            document.getElementById("from_above").classList.remove("close");
            document.getElementById("from_above").classList.add("open");

            clearInterval(timer);
            startButton.disabled = false;
        }
    };

    // Check Answer
    const checkAnswer = (selectedIndex) => {
        const correctIndex = questions[currentQuestion].correctAnswer;

        if (selectedIndex === correctIndex) {
            feedback.textContent = "Correct!";
            correct_questions += 1;
            score += 1;
        } else {
            feedback.textContent = `Wrong! The correct answer is: ${questions[currentQuestion].options[correctIndex]}`;
            score -= 0.5;
        }

        currentQuestion++;
        loadQuestion();
    };

    // Start Timer
    const startTimer = () => {
        let timeLeft = timeLimit;
        timerDisplay.textContent = timeLeft;
        timer = setInterval(() => {
            timeLeft--;
            timerDisplay.textContent = timeLeft;

            if (timeLeft <= 0) {
                clearInterval(timer);

                accuracy = ((correct_questions / 10) * 100).toFixed(2);
                document.getElementById("score").innerText = `Score: ${score}`;
                document.getElementById("accuracy").innerText = `Accuracy: ${accuracy}`;

                // Update the user's data after time is up
                updateUserData(score, accuracy);

                // Display the result
                document.getElementById("from_above").classList.remove("close");
                document.getElementById("from_above").classList.add("open");
                startButton.disabled = false;
            }
        }, 1000);
    };
});


document.getElementById("again").addEventListener("click", () => {
    location.reload();
})

document.getElementById('back').addEventListener('click', () => {
    window.open("../home/index.html", "_self")
})