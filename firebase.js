import firebase from 'firebase/compat/app'
import 'firebase/compat/database'
import 'firebase/compat/auth'

const instance = firebase.initializeApp({
    apiKey: "AIzaSyAK6qAx4V7iW5gQBWfYMsPIuyLYfRirkIg",
      authDomain: "dungeon-app-alpha.firebaseapp.com",
      databaseURL: "https://dungeon-app-alpha.firebaseio.com",
      projectId: "dungeon-app-alpha",
      storageBucket: "dungeon-app-alpha.appspot.com",
      messagingSenderId: "563307771863",
      appId: "1:563307771863:web:9cb4c2f3a1764e04173d92"
})
const db = instance.database()
const auth = instance.auth()

export { db, auth }
