import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"

let isFirebaseAvailable = false
let app: any = null
let db: any = null

const firebaseConfig = {
  apiKey: "AIzaSyD2RQd3V5QKYqShQdZm-nipGkWKfm4BD64",
  authDomain: "acad2-26302.firebaseapp.com",
  projectId: "acad2-26302",
  storageBucket: "acad2-26302.firebasestorage.app",
  messagingSenderId: "942758589288",
  appId: "1:942758589288:web:328b97f99e7592d3265cdd",
  measurementId: "G-BSBTKMLM4R",
}

try {
  app = initializeApp(firebaseConfig)
  db = getFirestore(app)
  isFirebaseAvailable = true
  console.log("[v0] Firebase initialized successfully")
} catch (error) {
  console.log("[v0] Firebase initialization failed, will use localStorage fallback:", error)
  isFirebaseAvailable = false
}

export { db, isFirebaseAvailable }