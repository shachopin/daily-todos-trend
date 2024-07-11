import firebase from "firebase";

const firebaseConfig = {
  apiKey: "AIzaSyDYaJmtuk7opKOAQ5oDW7cr-hSMgzTzcog",
  authDomain: "daily-todos-7a4bd.firebaseapp.com",
  projectId: "daily-todos-7a4bd",
  storageBucket: "daily-todos-7a4bd.appspot.com",
  messagingSenderId: "160169110450",
  appId: "1:160169110450:web:400be985cc2094c15492ab"
};

firebase.initializeApp(firebaseConfig);

const db = firebase.firestore();

export { db };