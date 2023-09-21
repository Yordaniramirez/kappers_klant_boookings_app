import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './AfspraakDetails.css';
import { useNavigate } from 'react-router-dom';
import { useAfspraak } from "./AfspraakContext";
import { addAppointmentToFirestore, db, auth } from "./firebase/config";
import { query, where, getDocs, collection } from "firebase/firestore";

function AfspraakDetails() {
  const { setAfspraakDetails } = useAfspraak();
  const navigate = useNavigate();
  const { dienst, kapper } = useParams();
  const [price, setPrice] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [busyDays, setBusyDays] = useState([]);

  useEffect(() => {
    // Bepaal de prijs van de dienst op basis van de dienstnaam
    const servicePrices = {
      'Knippen heren': 35,
      'Scheren heren': 25,
      'Baard en scheren': 37.5,
      'Contour': 10,
      'Knippen': 42,
      'Drogen': 30,
      'Knippen kinderen 13 tot met 16': 28,
      'Knippen kinderen tot 12': 25,
    };
    setPrice(servicePrices[dienst] || 0);

    // Haal de afspraken op voor de geselecteerde kapper
    async function fetchAppointments() {
      const afspraakCollection = collection(db, "afspraak");
      const q = query(afspraakCollection, where("kapper", "==", kapper));
      const querySnapshot = await getDocs(q);
      const dates = {};
      querySnapshot.forEach(doc => {
        const data = doc.data();
        const appointmentDate = new Date(data.date.seconds * 1000).toDateString();
        dates[appointmentDate] = (dates[appointmentDate] || 0) + 1;
      });
      setBusyDays(Object.keys(dates).filter(date => dates[date] >= 10));
    }
    fetchAppointments();

  }, [dienst, kapper]);  // Voeg 'kapper' toe aan de dependency array omdat we het gebruiken binnen de useEffect

  // Maak een afspraak zonder registratie
  const handleAfspraakZonderRegistratie = async () => {
    // Sla de afspraakgegevens op in de context
    setAfspraakDetails({
      price: price,
      dienst: dienst,
      kapper: kapper,
      selectedDate: selectedDate
    });
  
    // Sla de afspraakgegevens op in Firebase Firestore
    try {
      // Haal de huidige ingelogde gebruiker op
      const user = auth.currentUser;
  
      // Controleer of de gebruiker is ingelogd
      if (user) {
        // Als de gebruiker is ingelogd, voeg de afspraak toe met de gebruikers-ID
        await addAppointmentToFirestore(user.uid, kapper, dienst, price, selectedDate);
      } else {
        // Als de gebruiker niet is ingelogd, voeg de afspraak toe zonder gebruikers-ID
        await addAppointmentToFirestore(null, kapper, dienst, price, selectedDate);
      }
    } catch (error) {
      console.error("Fout bij het toevoegen van afspraak: ", error);
    }
  
    // Navigeer naar de bevestigingspagina
    navigate('/bevestiging-zonder-registratie');
  };

  // Maak een afspraak met registratie
  function handleAfspraakMetRegistratie() {

    setAfspraakDetails({
        price: price,
        dienst: dienst,
        kapper: kapper,
        selectedDate: selectedDate
      });

      const user = auth.currentUser;
    
     // Haal de afspraakgegevens op uit de context
  
    // Stuur de gebruiker naar de registratiepagina
    navigate('/registratie');
  
    // Sla de afspraakgegevens op in de database wanneer de gebruiker zich registreert
    const saveAppointmentToDatabase = async () => {
      try {
        // Roep de functie aan om naar de database te schrijven
        await addAppointmentToFirestore(user.uid, kapper, dienst, price, selectedDate);
        console.log('Afspraakgegevens zijn opgeslagen in de database.');
      } catch (error) {
        console.error('Fout bij het opslaan van afspraakgegevens:', error);
      }
    };
  
    // Roep de functie aan om de afspraakgegevens op te slaan wanneer de gebruiker zich registreert
    saveAppointmentToDatabase();
  }

  return (
    <div className="afspraak-details-container">
      <h2>Afspraak Details</h2>
      <p>Gekozen dienst: {dienst}</p>
      <p>Prijs voor de dienst: €{price.toFixed(2)}</p>
      <p>Gekozen kapper: {kapper}</p>

      <DatePicker 
        selected={selectedDate}
        onChange={date => setSelectedDate(date)}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={30}
        timeCaption="time"
        dateFormat="MMMM d, yyyy h:mm aa"
        minDate={new Date()}
        excludeDates={busyDays.map(date => new Date(date))}
      />

      <button className="button" onClick={handleAfspraakMetRegistratie}>Maak afspraak met registratie</button>
      
      <button className="button" onClick={handleAfspraakZonderRegistratie}>Maak afspraak zonder registratie</button>
    </div>
  );
}

export default AfspraakDetails;
