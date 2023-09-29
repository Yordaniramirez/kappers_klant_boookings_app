import React, { useState } from "react";
import { signInUserWithEmailAndPassword, addAppointmentToFirestore } from "./firebase/config";
import './CSS_STYLES/LoginPage.css';
import { useNavigate} from "react-router-dom";


function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  // const location = useLocation();
  

  // In de loginfunctie, na succesvolle login
  const handleLogin = () => {
    signInUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Debug: Log userCredential for more details
        console.log("User Credential:", userCredential);
  
        // Haal de 'pending' afspraak op uit localStorage
        const pendingAppointment = localStorage.getItem('pendingAppointment');
  
        // Debug: Log the pendingAppointment
        console.log("Pending Appointment:", pendingAppointment);
  
        if (pendingAppointment) {
          const afspraakDetails = JSON.parse(pendingAppointment);
             
          afspraakDetails.selectedDate = new Date(afspraakDetails.selectedDate);
          // Debug: Log the afspraakDetails
          console.log("Parsed Afspraak Details:", afspraakDetails);
  
          const userId = userCredential.user.uid;
  
          // Voeg afspraak toe aan Firestore
          addAppointmentToFirestore({ userId, ...afspraakDetails });
  
          // Debug: Validate the afspraakDetails
          console.log("Sending to Firestore:", { userId, ...afspraakDetails });
  
          // Verwijder de 'pending' afspraak uit localStorage
          localStorage.removeItem('pendingAppointment');
        }
  
        // Navigeer naar dashboard
        navigate("/user-dashboard");
      })
      .catch((error) => {
        // Inloggen mislukt, toon de foutmelding aan de gebruiker
        setError(error.message);
        console.error("Inloggen fout:", error.message); // Log the error message
      });
  };
  

  

  return (
    <div className="login-container">
      <h2>Inloggen</h2>
      <input
        type="email"
        placeholder="E-mail"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        placeholder="Wachtwoord"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <button onClick={handleLogin}>Inloggen</button>
      {error && <p className="error-message">{error}</p>}
    </div>
  );
}

export default LoginPage;
