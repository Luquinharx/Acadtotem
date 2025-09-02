import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyD2RQd3V5QKYqShQdZm-nipGkWKfm4BD64",
  authDomain: "acad2-26302.firebaseapp.com",
  projectId: "acad2-26302",
  storageBucket: "acad2-26302.firebasestorage.app",
  messagingSenderId: "942758589288",
  appId: "1:942758589288:web:328b97f99e7592d3265cdd",
  measurementId: "G-BSBTKMLM4R",
}

const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export { db }
