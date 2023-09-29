import React from 'react';
import { useParams } from 'react-router-dom'; // <- Importeer useParams
import './CSS_STYLES/DienstenPage.css';
import { useNavigate } from 'react-router-dom';

import vrouwenKnippen from './images/haar-knippenvrouwen.jpg';
import vrouwenDrogen from './images/Fohnvrouwen.jpg';
import mannenKnippen from './images/knippenheren.png';
import mannenScheren from './images/Scheren.png';
import mannenBaardScheren from './images/BaarenScheren.png';
import mannenContour from './images/contour.jpg';
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
        image: vrouwenKnippen
      },
      {
        name: 'Drogen',
        image: vrouwenDrogen
      }
    ];
  } else if (category === 'Man') {
    services = [
      {
        name: 'Knippen heren',
        image: mannenKnippen
      },
      {
        name: 'Scheren heren',
        image: mannenScheren
      },
      {
        name: 'Baard en scheren',
        image: mannenBaardScheren
      },
      {
        name: 'Contour',
        image: mannenContour
      }
    ];
  } else if (category === 'Kinderen') {
    services = [
      {
        name: 'Knippen kinderen tot 12',
        image: kinderenKnippenTot12Jaar
      },
      {
        name: 'Knippen kinderen 13 tot met 16',
        image: kinderenKnippenVan12Tot16Jaar
      }
    ];
  }

  return (
    <div className="App-header">
      <button onClick={() => navigate(-1)}>Terug</button>
      <h2 className="category-title">Diensten voor {category}</h2>
      
       
      {services.map(service => (
        <div className="category-card" key={service.name} onClick={() => handleServiceClick(service.name)}>

          <h3>{service.name}</h3>
          <img src={service.image} alt={service.name} />
        </div>
      ))}
    </div>
    

  );
}

export default DienstenPage;
