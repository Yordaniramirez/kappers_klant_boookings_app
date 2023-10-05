import React from 'react';
import './CSS_STYLES/DienstenPage.css';
import { useNavigate } from 'react-router-dom';

// Dummy kapper afbeeldingen
import Mohamed from './images/Men.png';
import Jasper from './images/Jasper-kapper.png';
import Joselito from './images/Mohamed-kapper.png';
import Yailin from './images/Shenice-Kapster.png';

function KapperKiezenPage({ selectedDienst }) {

  const navigate = useNavigate();
  const handleServiceClick = (kapperName) => {

         navigate(`/afspraak-details/${selectedDienst}/kapper/${kapperName}`);
}
  const kappers = [
    {
      name: 'Mohamed',
      image: Mohamed
    },
    {
      name: 'Jasper',
      image: Jasper
    },
    {
      name: 'Joselito',
      image: Joselito
    },
    {
      name: 'Yailin',
      image: Yailin
    },
  ];

  return (
    <div className="App-header">
       <button className="back-button" onClick={() => navigate(-1)}>Terug</button>
      <h2 className="category-title">Kies een kapper</h2>
      <div className="service-container">
      {kappers.map(kapper => (
      <div className="category-card" key={kapper.name} onClick={() => handleServiceClick(kapper.name)}>

          <h3>{kapper.name}</h3>
          <img src={kapper.image} alt={kapper.name} />
        </div>
      ))}
    </div>
    </div>
  );
}

export default KapperKiezenPage;
