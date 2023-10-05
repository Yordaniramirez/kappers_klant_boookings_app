import React from 'react';
import { useParams } from 'react-router-dom'; // <- Importeer useParams
import './CSS_STYLES/DienstenPage.css';
import { useNavigate } from 'react-router-dom';

import vrouwenKnippen from './images/haar-knippenvrouwen.jpg';
import vrouwenDrogen from './images/Fohnvrouwen.jpg';
import mannenKnippen from './images/Herenknippen.jpg';
import mannenScheren from './images/HerenScheren.jpg';
import mannenBaardScheren from './images/BaardEnScheren.jpg';
import mannenContour from './images/Contour2.jpg';
import kinderenKnippenTot12Jaar from './images/kinderentot12.jpg';
import kinderenKnippenVan12Tot16Jaar from './images/vanaf12tot16.jpg';

function DienstenPage({ setSelectedDienst }) {
  const { category } = useParams(); // <- Gebruik useParams om de category te verkrijgen
  let services = [];
  const navigate = useNavigate();

  const handleServiceClick = (selectedService) => {
    setSelectedDienst(selectedService);
    navigate("/kapper-kiezen");
}

  if (category === 'Vrouw') {
    services = [
      {
        name: 'Knippen',
        image: vrouwenKnippen,
        duration: 45 //duur minuten
      },
      {
        name: 'Drogen',
        image: vrouwenDrogen,
        duration: 30 //minuten

      }
    ];
  } else if (category === 'Man') {
    services = [
      {
        name: 'Knippen heren',
        image: mannenKnippen,
        duration: 60
      },
      {
        name: 'Scheren heren',
        image: mannenScheren,
        duration: 60 // Duur in minuten

      },
      {
        name: 'Baard en scheren',
        image: mannenBaardScheren,
        duration: 75 // Duur in minuten
      },
      {
        name: 'Contour',
        image: mannenContour,
        duration: 30 // Duur in minuten
      }
    ];
  } else if (category === 'Kinderen') {
    services = [
      {
        name: 'Knippen kinderen tot 12',
        image: kinderenKnippenTot12Jaar,
        duration: 30 // Duur in minuten
      },

      {
        name: 'Knippen kinderen 13 tot met 16',
        image: kinderenKnippenVan12Tot16Jaar,
        duration: 45 // Duur in minuten
      }
    ];
  }

  return (
    <div className="App-header">
          <button className="back-button" onClick={() => navigate(-1)}>Terug</button> {/* Nieuwe klasse toegevoegd */}
    <h2 className="category-title">Diensten voor {category}</h2>
    <div className="service-container"> {/* Nieuwe container voor de kaarten */}
      {services.map(service => (
        <div className="category-card" key={service.name} onClick={() => handleServiceClick(service.name)}>
          <h3>{service.name}</h3>
          <img src={service.image} alt={service.name} />
        </div>
      ))}
    </div> 
  </div>
    

  );
}

export default DienstenPage;
