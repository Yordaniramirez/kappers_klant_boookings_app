import React, { useState } from 'react';
import { registerUser } from './firebase/config';
import './Registratie.css';

function Registratie() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [name, setName] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const user = await registerUser(name, email, password);
      setMessage(`Registratie gelukt voor ${user.email}. Controleer uw e-mail om uw account te verifiëren.`);
    } catch (error) {
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
    </div>
  );
}

export default Registratie;
