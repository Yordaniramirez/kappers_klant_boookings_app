import React, { useState, useEffect } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "./firebase/config";
import "./CSS_STYLES/KapperAfsprakenPage.css";

function KapperAfsprakenPage() {
  const [afspraken, setAfspraken] = useState([]);
  const [kappers, setKappers] = useState({});

  const getKappers = async () => {
    try {
      const kappersQuery = query(collection(db, "kapper"));  // Wijzig naar de juiste collectie voor kappers

      const querySnapshot = await getDocs(kappersQuery);
      const kappersData = {};

      querySnapshot.forEach((doc) => {
        kappersData[doc.id] = doc.data();
      });

      setKappers(kappersData);
    } catch (error) {
      console.error("Fout bij ophalen kappers:", error);
    }
  };
  const getAfspraken = async () => {
    try {
      const afsprakenQuery = query(collection(db, "afspraak"));
  
      const querySnapshot = await getDocs(afsprakenQuery);
      const afsprakenData = [];
  
      querySnapshot.forEach((doc) => {
        afsprakenData.push({ id: doc.id, ...doc.data() });
      });
  
      // Sorteer de afspraken op datum in aflopende volgorde (nieuwste eerst)
      afsprakenData.sort((a, b) => {
        const dateA = new Date(a.date.seconds * 1000);
        const dateB = new Date(b.date.seconds * 1000);
  
        // Zet tijd van beide datums naar middernacht voor de vergelijking
        dateA.setHours(0, 0, 0, 0);
        dateB.setHours(0, 0, 0, 0);
  
        // Sorteer in aflopende volgorde
        return dateB.getTime() - dateA.getTime();
      });
  
      setAfspraken(afsprakenData);
    } catch (error) {
      console.error("Fout bij ophalen afspraken:", error);
    }
  };
  

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

  const formatDate = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleDateString(); // Alleen de datum
    }
    return "Onbekende datum";
  };

  const formatTime = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleTimeString([], {hour: '2-digit', minute: '2-digit'}); // Alleen de tijd
    }
    return "Onbekende tijd";
  };

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
