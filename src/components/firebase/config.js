// Import the required functions from the Firebase SDKs
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore, collection, addDoc } from "firebase/firestore";
import { getAuth, createUserWithEmailAndPassword, sendEmailVerification, updateProfile, signInWithEmailAndPassword } from "firebase/auth";
//import { Timestamp } from "firebase/firestore";

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

export async function addAppointmentToFirestore({ userId, kapper,  dienst, price, selectedDate }) {
  console.log("Received values in addAppointmentToFirestore:", userId, kapper,  dienst, price, selectedDate);
  
  // Controleer of alle velden aanwezig zijn
  if (!userId || !kapper|| !price || !dienst || !selectedDate) {
    console.error('One or more fields are undefined');
    return;
  }
  
  try {
    // Voeg een nieuwe afspraak toe aan de 'afspraak' collectie
    const afspraakCollection = collection(db, "afspraak");
    const afspraakDoc = await addDoc(afspraakCollection, {
      userId: userId, // of klantId, hoe je het ook wilt noemen
      kapper: kapper,
      price: price,
      dienst: dienst,
      date: selectedDate
    }); 
    
    return afspraakDoc;
  } catch (error) {
    console.error("Error adding appointment:", error);
    throw error;
  }
}

export async function createCustomerInFirestore(userId, name, email) {
  try {
    const klantCollection = collection(db, "klant");
    await addDoc(klantCollection, {
      userId: userId,
      naam: name,
      email: email
    });
  } catch (error) {
    console.error("Error adding customer:", error);
    throw error;
  }
}





export async function signInUserWithEmailAndPassword(email, password) {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential;
  } catch (error) {
    throw error;
  }
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
