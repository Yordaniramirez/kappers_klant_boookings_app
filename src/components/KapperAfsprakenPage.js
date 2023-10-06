// Importeer nodige modules en CSS
import React, { useState, useEffect } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "./firebase/config";
import "./CSS_STYLES/KapperAfsprakenPage.css";

function KapperAfsprakenPage() {
  // Initialisatie van state variabelen
  const [afspraken, setAfspraken] = useState([]);
  const [kappers, setKappers] = useState({});

  // Asynchrone functie om kappers op te halen
  const getKappers = async () => {
    try {
      // Haal documenten op
      const kappersQuery = query(collection(db, "kapper"));  // Wijzig naar de juiste collectie voor kappers
      
      
      const querySnapshot = await getDocs(kappersQuery);
      const kappersData = {};

        // Verwerk de opgehaalde documenten
      querySnapshot.forEach((doc) => {
        kappersData[doc.id] = doc.data();
      });
     
       // Zet de kappersdata in de state
      setKappers(kappersData);
    } catch (error) {
      console.error("Fout bij ophalen kappers:", error);
    }
  };

   // Asynchrone functie om afspraken op te halen
  const getAfspraken = async () => {
    try {
      // Query om afspraken te verkrijgen uit Firestore
      const afsprakenQuery = query(collection(db, "afspraak"));
  
      // Haal documenten op
      const querySnapshot = await getDocs(afsprakenQuery);
      const afsprakenData = [];
    
       // Verwerk de opgehaalde documenten
      querySnapshot.forEach((doc) => {
        afsprakenData.push({ id: doc.id, ...doc.data() });
      });
  
     // Sorteer de afspraken op datum (aflopend)
      afsprakenData.sort((a, b) => {
        const dateA = new Date(a.date.seconds * 1000);
        const dateB = new Date(b.date.seconds * 1000);
  
        // Zet tijd van beide datums naar middernacht voor de vergelijking
        dateA.setHours(0, 0, 0, 0);
        dateB.setHours(0, 0, 0, 0);
  
       // Vergelijk de datums
        return dateB.getTime() - dateA.getTime();
      });
  
       // Zet de afspraakdata in de state
      setAfspraken(afsprakenData);
    } catch (error) {
      console.error("Fout bij ophalen afspraken:", error);
    }
  };
  
  // Haal de gegevens op wanneer de component wordt geladen
  useEffect(() => {
    getAfspraken();
    getKappers();
  }, []);

  console.log("Kappers:", kappers);
  console.log("Afspraken:", afspraken);

   // Transformatie van kappers object voor gemakkelijkere toegang
  const transformedKappers = {};
  Object.values(kappers).forEach(kapper => {
    transformedKappers[kapper.naam] = kapper;
  });

  // Functies om de datum en tijd te formatteren
  const formatDate = (timestamp) => {
        // Formatteer datum
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleDateString(); // Alleen de datum
    }
    return "Onbekende datum";
  };

  const formatTime = (timestamp) => {
    // Formatteer tijd
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}); // Alleen de tijd
    }
    return "Onbekende tijd";
  };
   // De UI van de pagina
  return (
    <div className="kapper-afspraken-container">
      <h2>Mijn afspraken</h2>

      <table>
        <thead>
          <tr>
            <th>Datum</th>
            <th>Tijd</th>
            <th>Kapper</th>
            <th>Dienst</th>
            <th>Prijs</th>
          </tr>
        </thead>

        <tbody>
          {afspraken.map((afspraak) => (
            <tr key={afspraak.id}>
              <td>{formatDate(afspraak.date)}</td>
              <td>{formatTime(afspraak.date)}</td>
              <td>{afspraak.kapper || "Onbekende kapper"}</td>
              <td>{afspraak.dienst}</td>
              <td>{`${afspraak.price} €`}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default KapperAfsprakenPage;
