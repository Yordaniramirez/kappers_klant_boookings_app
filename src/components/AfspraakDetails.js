// Importeer de benodigde bibliotheken en modules
import React, { useState, useEffect } from "react";
import { useParams, useNavigate} from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './CSS_STYLES/AfspraakDetails.css';
import { useAfspraak } from "./AfspraakContext";
import { addAppointmentToFirestore, db, auth } from "./firebase/config";
import { query, where, getDocs, collection } from "firebase/firestore";

// Definieer het hoofdcomponent AfspraakDetails
function AfspraakDetails() {
 
// Haal de setAfspraakDetails-functie uit de AfspraakContext
  const { setAfspraakDetails } = useAfspraak();

 // Initialiseren van de navigate-functie voor het veranderen van routes
  const navigate = useNavigate();
 
// Haal de parameters dienst en kapper uit de URL
  const { dienst, kapper } = useParams(); 

  // Initialiseren van de state-variabelen
  const [price, setPrice] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [busyDays, setBusyDays] = useState([]);

 
   // Gebruik useEffect om acties uit te voeren bij het laden van het component
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

    // Stel de prijs in op basis van de gekozen dienst
    setPrice(servicePrices[dienst] );
    
     // Roep een functie aan om de bezette afspraken op te halen
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
  
    // Deze functie wordt aangeroepen om een afspraak te maken zonder registratie
  const handleAfspraakZonderRegistratie = async () => {
    
     // Controleer of het gekozen tijdstip al bezet is
    const isBusy = busyDays.some(busyDate => 
      busyDate.getHours() === selectedDate.getHours() &&
      busyDate.getMinutes() === selectedDate.getMinutes() &&
      busyDate.toDateString() === selectedDate.toDateString()
    );
    
    // Als het tijdstip bezet is, geef een waarschuwing
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
  
  

    // Sla de details van de afspraak op
    setAfspraakDetails({
      price: price,
      dienst: dienst,
      kapper: kapper,
      selectedDate: selectedDate,
      
      
    });

     // Probeer de afspraak toe te voegen aan Firestore
    try {
      const user = auth.currentUser;
      const userId = user ? user.uid : null;
      console.log("Current User ID:", userId);  // Log de huidige User ID

      console.log(userId, kapper, price, dienst, selectedDate);

  await addAppointmentToFirestore({userId, kapper, price, dienst, selectedDate});
  
      
    } catch (error) {
      
      console.error("Error adding appointment: ", error);
    }

    
 // Ga naar de bevestigingspagina
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
     // Het daadwerkelijke JSX-component dat wordt weergegeven
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
        timeIntervals={30}
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
// Exporteer het component om het elders te kunnen gebruiken
export default AfspraakDetails;
