import React, { useState, useEffect } from "react";
import { collection, query, getDocs } from "firebase/firestore";
import { db } from "./firebase/config";
import "./CSS_STYLES/KapperAfsprakenPage.css";

function KapperAfsprakenPage() {
  const [afspraken, setAfspraken] = useState([]); // Initiële staat voor afspraken
  const [kappers, setKappers] = useState({});

  const getKappers = async () => {
    try {
      const kappersQuery = query(collection(db, "afspraak"));
  
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
  
      setAfspraken(afsprakenData);
    } catch (error) {
      console.error("Fout bij ophalen afspraken:", error);
    }
  };

  useEffect(() => {
    getAfspraken(); // Haal afspraken op bij het laden van de pagina
    getKappers();
  }, []);


  const formatFirestoreDate = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleString();
    }
    return "Onbekende datum";
  };
  
  const formatFirestoreTime = (timestamp) => {
    if (timestamp && timestamp.seconds) {
      const date = new Date(timestamp.seconds * 1000);
      return date.toLocaleTimeString();
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
             <td>{formatFirestoreDate(afspraak.date)}</td>
            <td>{formatFirestoreTime(afspraak.date)}</td>
              <td>{kappers[afspraak.kapperId]?.naam || "Onbekende kapper"}</td>
              <td>{afspraak.dienst}</td>
              <td>{afspraak.price}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default KapperAfsprakenPage;