import React, { useState, useEffect } from "react";
import { useParams, useNavigate} from "react-router-dom";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import './CSS_STYLES/AfspraakDetails.css';
import { useAfspraak } from "./AfspraakContext";
import { addAppointmentToFirestore, db, auth } from "./firebase/config";
import { query, where, getDocs, collection } from "firebase/firestore";

function AfspraakDetails() {
  const { setAfspraakDetails } = useAfspraak();
  const navigate = useNavigate();
  //const location = useLocation();
  const { dienst, kapper } = useParams();  // Hier krijg je kapperId van de URL
  const [price, setPrice] = useState(0);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [busyDays, setBusyDays] = useState([]);


  useEffect(() => {
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
    setPrice(servicePrices[dienst] );

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
  }, [dienst, kapper]);

  const handleAfspraakZonderRegistratie = async () => {
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
        timeIntervals={30}
        timeCaption="time"
        dateFormat="MMMM d, yyyy h:mm aa"
        minDate={new Date()}
        excludeDates={busyDays.map(date => new Date(date))}
      />

      <button className="button" onClick={handleLogin}>Inloggen als bestaande klant</button>
      <button className="button" onClick={handleAfspraakMetRegistratie}>Registreren als nieuwe klant</button>
      <button className="button" onClick={handleAfspraakZonderRegistratie}>Doorgaan zonder registratie</button>
    </div>
  );
}

export default AfspraakDetails;
