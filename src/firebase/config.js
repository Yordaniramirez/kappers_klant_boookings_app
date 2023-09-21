// Import the required functions from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile } from "firebase/auth";

// Firebase configuration (Remove the apiKey when sharing!)
const firebaseConfig = {
  apiKey: "AIzaSyBCm9R96R1j2K4olpO_EUiGhLTVbiFkFaE",
  authDomain: "kapperbookingapp.firebaseapp.com",
  projectId: "kapperbookingapp",
  storageBucket: "kapperbookingapp.appspot.com",
  messagingSenderId: "1044018527265",
  appId: "1:1044018527265:web:186ac50318356ccf03f760",
  measurementId: "G-9LKZ2PWKC5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app); 
const auth = getAuth(app); 

export async function addAppointmentToFirestore(kapper, dienst, price, selectedDate) {
  const afspraakCollection = collection(db, "afspraak");
  return await addDoc(afspraakCollection, {
    kapper: kapper,
    date: selectedDate,
    price: price,
    dienst: dienst
  });
}

export async function registerUser(name, email, password) {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const user = userCredential.user;

    console.log("Name:", name);
    console.log("Email:", email);
    console.log("Password:", password);
  

    await updateProfile(user, {
      displayName: name
    });

    await sendEmailVerification(user);

    return user;
  } catch (error) {
    throw error;
  }
}

export { app, analytics, db, auth };
