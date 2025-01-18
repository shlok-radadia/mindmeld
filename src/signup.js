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


const emailDomains = [
    ".com",  // Commercial
    ".org",  // Organization
    ".net",  // Network
    ".edu",  // Educational institutions
    ".gov",  // Government
    ".mil",  // Military
    ".int",  // International organizations
    ".info", // Information services
    ".biz",  // Business
    ".name", // Personal names
    ".pro",  // Professionals
    ".aero", // Aviation industry
    ".coop", // Cooperatives
    ".museum", // Museums
    ".io",  // Tech startups, developers
    ".tech", // Technology services
    ".me",  // Personal branding
    ".online", // General online services
    ".xyz", // General use
    ".store", // E-commerce
    ".app",  // Mobile and web applications
    ".ai",  // Artificial intelligence, startups
    ".co",  // Business, tech, global use
    ".uk",  // United Kingdom
    ".us",  // United States
    ".in",  // India
    ".de",  // Germany
    ".cn",  // China
    ".au",  // Australia
    ".ca",  // Canada
    ".jp",  // Japan
    ".fr",  // France
    ".ru",  // Russia
    ".br",  // Brazil
    ".za"   // South Africa
];

const isValidDomain = (email) => {
    const emailDomain = email.split("@")[1]?.split(".").slice(-2).join(".");
    return emailDomains.includes("." + emailDomain.split(".").slice(-1)[0]);
};

const is_single_word = str => /^[^\s]+$/.test(str);

const signup = document.querySelector('#signup_form')
signup.addEventListener('submit', (e) => {
    e.preventDefault()

    const email = signup.email.value
    const first_name = signup.first_name.value
    const last_name = signup.last_name.value
    const age = signup.age.value
    const occupation = signup.occupation.value
    const gender = signup.gender.value
    const password = signup.password.value

    if(!email || !first_name || !last_name || !age || !occupation || !gender){
        alert("Please enter the details correctly.")
    }
    else if(isValidDomain(email) == false){
        alert("Please enter a valid email address.")
    }
    else if(password.length <= 6){
        alert("Password should atleast have 7 characters.")
    }
    else{

        addDoc(user_col, {
            first_name: first_name,
            last_name: last_name,
            gender: gender,
            age: parseInt(age),
            occupation: occupation,
            email: email,
            reaction: {
                best: 1000,
                avg: 0,
                number: 0
            },
            memory: {
                avg_correct: 0,
                number: 0
            },
            attention: {
                avg: 0,
                best: 0,
                number: 0
            },
            problem: {
                avg_accuracy: 0,
                avg_score: 0,
                number: 0
            }
        })
        .then(() => {
            createUserWithEmailAndPassword(auth, email, password)
            .then(cred => {
                console.log('user created:', cred.user)
                window.open("../app/home/index.html", "_self");
            })
            .catch(err => {
                console.log(err.message)
            })
            signup.reset()
        })
    }
})