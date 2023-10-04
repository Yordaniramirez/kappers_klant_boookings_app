//Importeer de benodigde depensies
import React, { useState, useEffect } from "react";
import { useParams, useNavigate} from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './CSS_STYLES/AfspraakDetails.css';
import { useAfspraak } from "./AfspraakContext";
import { addAppointmentToFirestore, db, auth } from "./firebase/config";
import { query, where, getDocs, collection } from "firebase/firestore";

// Definieer de function AfspraakDetails
function AfspraakDetails() {
 
// Gebruik de aangepaste hook useAfspraak om de functie `setAfspraakDetails` te verkrijgen
  const { setAfspraakDetails } = useAfspraak();

// Initialiseer navigatieobject voor routewijzigingen
  const navigate = useNavigate();
 
// Destructureer de `dienst` en `kapper` params van de URL
  const { dienst, kapper } = useParams();  // Hier krijg je kapper, en welke dienst
  
  // Initialiseer statusvariabelen. Toestandsvariabelen zijn variabelen die de toestand van een systeem op een bepaald moment definiëren. Ze worden gebruikt om de kenmerken te beschrijven van een systeem dat in de loop van de tijd kan veranderen.
  const [price, setPrice] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [busyDays, setBusyDays] = useState([]);

 
  // Bijwerking om bestaande afspraken op te halen en drukke dagen te berekenen
  //Wat doet useEffect? Door deze Hook te gebruiken, vertel je React dat je component iets moet doen na het renderen. React onthoudt de functie die u hebt doorgegeven (we noemen dit ons “effect”) en roept deze later aan na het uitvoeren van de DOM-updates
  useEffect(() => {
    const servicePrices = {
    // Voorgedefinieerde serviceprijzen
      'Knippen heren': 35,
      'Scheren heren': 25,
      'Baard en scheren': 37.5,
      'Contour': 10,
      'Knippen': 42,
      'Drogen': 30,
      'Knippen kinderen 13 tot met 16': 28,
      'Knippen kinderen tot 12': 25,
    };
    // Update de prijs op basis van de gekozen dienst
    setPrice(servicePrices[dienst] );
    
    // Haal afspraken op uit Firestore
    async function fetchAppointments() {
      // Bereid een Firestore-aanvraag voor om afspraken te krijgen bij een kapper/afspraak
      const afspraakCollection = collection(db, "afspraak");
      const q = query(afspraakCollection, where("kapper", "==", kapper));
      const querySnapshot = await getDocs(q);

      // Initialize an array to hold busy time slots
      const busyTimeslots = [];

      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const appointmentDate = new Date(data.date.seconds * 1000);
        const duration = data.duration;

        // Calculate the end time of the appointment
        const endAppointmentDate = new Date(appointmentDate.getTime() + duration * 60000);

        // Add this busy slot to the array
        busyTimeslots.push({ start: appointmentDate, end: endAppointmentDate });
      });

      // Update busyDays state using your custom logic (use busyTimeslots)
      setBusyDays(updateAvailableTimeslots(busyTimeslots));
    }

    // Invoke fetchAppointments
    fetchAppointments();
  }, [dienst, kapper]);

  // Custom function to update available time slots
  const updateAvailableTimeslots = (busyTimeslots) => {
    const busyTimes = busyTimeslots.map(slot => slot.start);
    return busyTimes;
  };
  

  const handleAfspraakZonderRegistratie = async () => {

    const isBusy = busyDays.some(busyDate => 
      busyDate.getHours() === selectedDate.getHours() &&
      busyDate.getMinutes() === selectedDate.getMinutes() &&
      busyDate.toDateString() === selectedDate.toDateString()
    );

    if (isBusy) {
      alert("Dit tijdslot is al bezet. Kies een andere tijd.");
      return;
    }
    
    const sameDayAppointments = busyDays.filter(busyDate => 
      busyDate.toDateString() === selectedDate.toDateString()
    );
    
    if (sameDayAppointments.length >= 10) {
      alert("Er kunnen niet meer dan 10 afspraken op dezelfde dag worden gemaakt.");
      return;
    }
  
  


    setAfspraakDetails({
      price: price,
      dienst: dienst,
      kapper: kapper,
      selectedDate: selectedDate,
      
      
    });

  
    try {
      const user = auth.currentUser;
      const userId = user ? user.uid : null;
      console.log("Current User ID:", userId);  // Log de huidige User ID

      console.log(userId, kapper, price, dienst, selectedDate);

  await addAppointmentToFirestore({userId, kapper, price, dienst, selectedDate});
  
      
    } catch (error) {
      
      console.error("Error adding appointment: ", error);
    }

    

    navigate('/bevestiging-zonder-registratie');
  };

  const handleAfspraakMetRegistratie = () => {
    const afspraakGegevens = {
      price: price,
      dienst: dienst,
      kapper: kapper,
      selectedDate: selectedDate
    };

    navigate('/registratie', { state: { afspraakGegevens } });
  };

  const handleLogin = () => {
    const afspraakGegevens = {
      price: price,
      dienst: dienst,
      kapper: kapper,
      // Converteer het Date object naar een ISO string voordat je het opslaat
      selectedDate: selectedDate.toISOString()
    };
  
    // Opslaan in localStorage
    if (afspraakGegevens) {
      localStorage.setItem('pendingAppointment', JSON.stringify(afspraakGegevens));
    }
    
    navigate('/login');
  };


  return (
    <div className="afspraak-details-container">
      <button onClick={() => navigate(-1)}>Terug</button>
      <h2>Afspraak Details</h2>
      <p>Gekozen dienst: {dienst}</p>
      <p>Prijs voor de dienst: €{price.toFixed(2)}</p>
      <p>Gekozen kapper: {kapper}</p>

      <DatePicker 
        selected={selectedDate}
        onChange={date => setSelectedDate(date)}
        showTimeSelect
        timeFormat="HH:mm"
        timeIntervals={40}
        timeCaption="Tijd"
        dateFormat="MMMM d, yyyy HH:mm"
        minDate={new Date()}
        // Exclude timeslots that are busy
        excludeTimes={busyDays}
        minTime={new Date().setHours(9, 0, 0)}
        maxTime={new Date().setHours(19, 0, 0)}
      />

      <button className="button" onClick={handleLogin}>Inloggen als bestaande klant</button>
      <button className="button" onClick={handleAfspraakMetRegistratie}>Registreren als nieuwe klant</button>
      <button className="button" onClick={handleAfspraakZonderRegistratie}>Doorgaan zonder registratie</button>
    </div>
  );
}

export default AfspraakDetails;
