import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";
import './CSS_STYLES/LoginPage.css';
import { useNavigate } from "react-router-dom";
import { addAppointmentToFirestore } from "./firebase/config"; 

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const auth = getAuth();

  const handleLogin = () => {

    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Log voor debug
        console.log("User Credential:", userCredential);

        // Haal de 'pending' afspraak op uit localStorage
        const pendingAppointment = localStorage.getItem('pendingAppointment');
        console.log("Pending Appointment:", pendingAppointment);

        if (pendingAppointment) {
          const afspraakDetails = JSON.parse(pendingAppointment);
          afspraakDetails.selectedDate = new Date(afspraakDetails.selectedDate);
          console.log("Parsed Afspraak Details:", afspraakDetails);

          const userId = userCredential.user.uid;

          // Voeg afspraak toe aan Firestore
          addAppointmentToFirestore({ userId, ...afspraakDetails });

          // Verwijder de 'pending' afspraak uit localStorage
          localStorage.removeItem('pendingAppointment');
        }

        // Navigeer naar dashboard
        navigate("/user-dashboard");
      })
      .catch((error) => {
        setError(error.message);
      });
  };

  const handlePasswordReset = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        alert('Een wachtwoord reset e-mail is verzonden naar ' + email);
      })
      .catch((error) => {
        setError("Fout bij het verzenden van de wachtwoord reset e-mail: " + error.message);
      });
  };

  return (
    <div className="login-container">
      <h2>Inloggen</h2>
      <input type="email" placeholder="E-mail" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input type="password" placeholder="Wachtwoord" value={password} onChange={(e) => setPassword(e.target.value)} />
      <div className="button-container">
      <button className="login-button" onClick={handleLogin}>Inloggen</button>
      <button className="password-reset-button" onClick={handlePasswordReset}>Wachtwoord Vergeten</button>
      {error && <p className="error-message">{error}</p>}
      </div>
    </div>
  );
}

export default LoginPage;
