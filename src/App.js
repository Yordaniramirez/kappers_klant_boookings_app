import React, { useState } from "react";
import './App.css';
import CategoryCard from "./components/CategoryCard";
import DienstenPage from './DienstenPage';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import KapperKiezenPage from "./KapperKiezenPage";
import AfspraakDetails from "./AfspraakDetails";
import Bevestiging from "./Bevestiging";
import { useNavigate } from "react-router-dom";
import { AfspraakProvider } from "./AfspraakContext";
import Registratie from "./Registratie";
import LoginPage from "./LoginPage";
import UserDashboard from "./UserDashboard";


import manImage from './images/Black Men Fashion Magazine Cover Your Story (200 x 300 px).png';
import vrouwImage from './images/women.jpg';
import kinderenImage from './images/kinderen.jpg';

function HomePage() {
  
  const navigate = useNavigate();

  const handleCategoryClick = (category) => {
    navigate(`/diensten/${category}`);
  }

  return (
    <>
      <CategoryCard image={manImage} title="Man" onClick={() => handleCategoryClick('Man')} />
      <CategoryCard image={vrouwImage} title="Vrouw" onClick={() => handleCategoryClick('Vrouw')} />
      <CategoryCard image={kinderenImage} title="Kinderen" onClick={() => handleCategoryClick('Kinderen')} />
      <Link to="/login" className="login-button">Afspraak Beheren</Link> {/* Voeg className "login-button" toe */}

    </>
    
  );
}

function App() {
  const [selectedDienst, setSelectedDienst] = useState(null);

  return (
    <Router>
       <AfspraakProvider>
      <div className="App">
        <header className="App-header">
          <Routes>
            <Route path="/diensten/:category" element={<DienstenPage setSelectedDienst={setSelectedDienst} />} />
            <Route path="/kapper-kiezen" element={<KapperKiezenPage selectedDienst={selectedDienst} />} />
            <Route path="/afspraak-details/:dienst/kapper/:kapper" element={<AfspraakDetails />} /> 
            <Route path="/bevestiging-zonder-registratie" element={<Bevestiging />} />
            <Route path="/registratie" element={<Registratie />} />
            <Route path="/login" element={<LoginPage />} /> 
            <Route path="/user-dashboard" element={<UserDashboard />} /> {/* Voeg deze route toe */}
            <Route path="/" element={<HomePage />} />
          </Routes>
        </header>
      </div>
      </AfspraakProvider>
    </Router>
  );
}

export default App;
