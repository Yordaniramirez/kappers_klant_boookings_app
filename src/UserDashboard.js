import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import './UserDashboard.css';
import { db } from "./firebase/config";
import { getAuth, onAuthStateChanged } from "firebase/auth";


function UserDashboard() {
  const [appointments, setAppointments] = useState([]);
  const auth = getAuth();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        // User is signed in
        getAppointments(user.uid);
      } else {
        // User is signed out
        setAppointments([]);
      }
    });

    return () => {
      // Clean up the listener
      unsubscribe();
    };
  }, [auth]);

  const getAppointments = async (userId) => {
    try {
      console.log("Fetching appointments for user:", userId);

      const appointmentsQuery = query(
        collection(db, "afspraak"),
        where("userId", "==", userId)
      );

      const querySnapshot = await getDocs(appointmentsQuery);

      const appointmentsData = [];
      querySnapshot.forEach((doc) => {
        appointmentsData.push({ id: doc.id, ...doc.data() });
      });

      console.log("Appointments data:", appointmentsData);

      setAppointments(appointmentsData);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const formatDate = (dateObject) => {
    return new Date(dateObject.seconds * 1000).toLocaleString();
  };

  return (
    <div className="user-dashboard-container">
      <h2>Mijn Afspraken</h2>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.id}>
            <div>
              <h3>{appointment.kapper}</h3>
              <p>Datum: {formatDate(appointment.date)}</p>
              <p>Dienst: {appointment.dienst}</p>
              <p>Prijs: {appointment.price} euro</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default UserDashboard;
