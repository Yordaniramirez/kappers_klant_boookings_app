import React from 'react';
import './DienstenPage.css';
import { useNavigate } from 'react-router-dom';

// Dummy kapper afbeeldingen
import Mohamed from './images/Men.png';
import Jasper from './images/Jasper-kapper.png';
import Joselito from './images/Joselito-kapper.png';
import Shenice from './images/Scheren.png';

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
      name: 'Shenice',
      image: Shenice
    },
  ];

  return (
    <div className="App-header">
      <h2 className="category-title">Kies een kapper</h2>
      {kappers.map(kapper => (
      <div className="category-card" key={kapper.name} onClick={() => handleServiceClick(kapper.name)}>

          <h3>{kapper.name}</h3>
          <img src={kapper.image} alt={kapper.name} />
        </div>
      ))}
    </div>
  );
}

export default KapperKiezenPage;
