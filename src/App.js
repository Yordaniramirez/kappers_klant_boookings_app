// Importeer benodigde modules en componenten
import React, { useState } from "react";
import './App.css';
import CategoryCard from "./components/CategoryCard";
import DienstenPage from './components/DienstenPage';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import KapperKiezenPage from "./components/KapperKiezenPage";
import AfspraakDetails from "./components/AfspraakDetails";
import Bevestiging from "./components/Bevestiging";
import { useNavigate } from "react-router-dom";
import { AfspraakProvider } from "./components/AfspraakContext";
import Registratie from "./components/Registratie";
import LoginPage from "./components/LoginPage";
import UserDashboard from "./components/UserDashboard";
import KapperAfsprakenPage from "./components/KapperAfsprakenPage";


// HomePage Component
import manImage from './components/images/Black Men Fashion Magazine Cover Your Story (200 x 300 px).png';
import vrouwImage from './components/images/women.jpg';
import kinderenImage from './components/images/kinderen.jpg';

function HomePage() {
  
   // Navigatie functie
  const navigate = useNavigate();

   // Functie die wordt aangeroepen bij het klikken op een categorie
  const handleCategoryClick = (category) => {
    console.log("Category:", category); 
    navigate(`/diensten/${category}`);
  }

  return (
    <>
    <div className="App-header">
      <div className="title-container">
        <h1 className="category-title">Kies Categorie</h1>
      </div>
      <header className="category-container">
      <CategoryCard image={manImage} title="Man" onClick={() => handleCategoryClick('Man')} />
      <CategoryCard image={vrouwImage} title="Vrouw" onClick={() => handleCategoryClick('Vrouw')} />
      <CategoryCard image={kinderenImage} title="Kinderen" onClick={() => handleCategoryClick('Kinderen')} />
      </header>
      <div className="link-container">
        <Link to="/login" className="special-link">Afspraak Beheren</Link>
        <Link to="/kapper-afspraken" className="special-link">Alleen voor kappers</Link>
      </div>
      </div>
      
    </>
    
  );
}

// Hoofd App Component
function App() {
  const [selectedDienst, setSelectedDienst] = useState(null);

  return (
    <Router>
       <AfspraakProvider>
      <div className="App-header">
        <header className="category-container">
          
          <Routes>
            <Route path="/diensten/:category" element={<DienstenPage setSelectedDienst={setSelectedDienst} />} />
            <Route path="/kapper-kiezen" element={<KapperKiezenPage selectedDienst={selectedDienst} />} />
            <Route path="/afspraak-details/:dienst/kapper/:kapper" element={<AfspraakDetails />} /> 
            <Route path="/bevestiging-zonder-registratie" element={<Bevestiging />} />
            <Route path="/registratie" element={<Registratie />} />
            <Route path="/login" element={<LoginPage />} /> 
            <Route path="/user-dashboard" element={<UserDashboard />} /> {/* Voeg deze route toe */}
            <Route path="/kapper-afspraken" element={<KapperAfsprakenPage />} />
            <Route path="/" element={<HomePage />} />
          </Routes>
        </header>
      </div>
      </AfspraakProvider>
    </Router>
  );
}

export default App;
