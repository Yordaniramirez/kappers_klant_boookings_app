import React, { useState } from "react";
import { signInUserWithEmailAndPassword } from "./firebase/config";
import './LoginPage.css';
import { useNavigate } from "react-router-dom";

function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleLogin = () => {
    console.log('Inloggen met:', email, password);

    signInUserWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Inloggen gelukt, je kunt hier de gebruiker doorsturen naar het dashboard of andere pagina
        const user = userCredential.user;
        console.log("Inloggen gelukt voor:", user.email);
        // Voeg navigatielogica toe naar de dashboardpagina of waar je de gebruiker wilt sturen
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
