import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { addAppointmentToFirestore, createCustomerInFirestore, registerUser } from './firebase/config';
import './CSS_STYLES/Registratie.css';
import { useNavigate } from 'react-router-dom';


function Registratie() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');
  const location = useLocation(); // Haal de locatie op om gegevens vanuit de vorige pagina te ontvangen
  const afspraakGegevens = location.state ? location.state.afspraakGegevens : null; // Haal afspraakgegevens op uit de locatie
  const [isRegistered, setIsRegistered] = useState(false);  // Nieuwe state variabele
  const navigate = useNavigate();


  const handleRegister = async (e) => {
    e.preventDefault();
   
    try {
      const user = await registerUser(name, email, password);
    
      console.log("User:", user);
      console.log("User ID:", user.uid);
      console.log(`User ${user.uid} registered. Attempting to add to Firestore.`);

      
      
      await createCustomerInFirestore(user.uid, name, email);
      console.log(`User ${user.uid} added to Firestore.`);
    
      if (afspraakGegevens) {
        // Hier is de gewijzigde regel
        await addAppointmentToFirestore({
          userId: user.uid, 
          kapper: afspraakGegevens.kapper, 
          dienst: afspraakGegevens.dienst, 
          price: afspraakGegevens.price, 
          selectedDate: afspraakGegevens.selectedDate,
         // time: afspraakGegevens.time
        });
        console.log('Afspraakgegevens:', afspraakGegevens);
        console.log(`Appointment added for ${user.uid}.`);
      }
    
      setMessage(`Registratie gelukt voor ${user.email}. Controleer uw e-mail om uw account te verifiëren.`);

      setIsRegistered(true);  // Zet op true na succesvolle registratie

    } catch (error) {
      console.error("Error during registration:", error);
      setMessage(`Registratie fout: ${error.message}`);
    }
  };

  return (
    <div className="registratieContainer">

     

      <form onSubmit={handleRegister} className="registratieForm">
        <h2>Registreren</h2>

        <div className="inputContainer">
          <label>Naam:</label>
          <input type="text" value={name} onChange={(e) => setName(e.target.value)} required />
        </div>

        <div className="inputContainer">
          <label>Email:</label>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </div>

        <div className="inputContainer">
          <label>Wachtwoord:</label>
          <input type="password" autoComplete="current-password" onChange={(e) => setPassword(e.target.value)} required />
        </div>

        <button type="submit">Registreren</button>
      </form>
      {message && <p className="message">{message}</p>}

       {/* Toon knoppen alleen als de registratie succesvol was */}
       {isRegistered && (
        <>
          <button onClick={() => navigate('/')}>Terug naar de Homepage</button>
          <button onClick={() => navigate('/login')}>Inloggen</button>
        </>
      )}

      
    </div>
  );
}

export default Registratie;
