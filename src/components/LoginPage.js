import React, { useState } from "react";
import { getAuth, signInWithEmailAndPassword, sendPasswordResetEmail } from "firebase/auth";

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [resetPassword, setResetPassword] = useState(false);
  const auth = getAuth();

  // Functie om de gebruiker in te loggen
  const handleLogin = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        // Inloggen succesvol
        console.log("Inloggen succesvol:", userCredential);
      })
      .catch((error) => {
        console.error("Fout bij inloggen:", error);
        // Toon eventueel een foutmelding aan de gebruiker
      });
  };

  // Functie om wachtwoord reset e-mail te sturen
  const handleResetPassword = () => {
    sendPasswordResetEmail(auth, email)
      .then(() => {
        console.log("Wachtwoord reset e-mail verstuurd");
        setResetPassword(false);
        // Toon een bericht aan de gebruiker dat een e-mail is verzonden
      })
      .catch((error) => {
        console.error("Fout bij versturen wachtwoord reset e-mail:", error);
        // Toon een foutmelding aan de gebruiker
      });
  };

  return (
    <div>
      {resetPassword ? (
        <>
          <input
            type="email"
            placeholder="Voer uw e-mailadres in"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleResetPassword}>Stuur wachtwoord reset e-mail</button>
          <button onClick={() => setResetPassword(false)}>Terug naar inloggen</button>
        </>
      ) : (
        <>
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
          <button onClick={() => setResetPassword(true)}>Wachtwoord vergeten?</button>
        </>
      )}
    </div>
  );
}

export default LoginPage;
