import React, { useEffect, useState } from "react";
import { collection, query, where, getDocs } from "firebase/firestore";
import './CSS_STYLES/UserDashboard.css';
import { db } from "./firebase/config";
import { getAuth, onAuthStateChanged, signOut } from "firebase/auth";
import { useNavigate } from 'react-router-dom';


function UserDashboard() {
  const [appointments, setAppointments] = useState([]);
  const auth = getAuth();
  const navigate = useNavigate();

  const handleSignOut = () => {
    signOut(auth).then(() => {
      // Sign-out successful
      console.log('User signed out');
      navigate("/");  // Navigeert naar de homepage
    }).catch((error) => {
      // An error happened
      console.error('Error signing out:', error);
    });
  };
  

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

      console.log("Query snapshot size:", querySnapshot.size);
      
      const appointmentsData = [];

      
      querySnapshot.forEach((doc) => {
        console.log("Doc Data:", doc.data());
        appointmentsData.push({ id: doc.id, ...doc.data() });
      });
      console.log("Appointments data:", appointmentsData);
      setAppointments(appointmentsData);
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  const formatDateAndTime = (dateObject) => {
   if (dateObject && dateObject.seconds) {
      const date = new Date(dateObject.seconds * 1000);
      return {
        date: date.toLocaleDateString(),
        time: date.toLocaleTimeString(),
      };
   }
   return { date: "Onbekende datum", time: "Onbekende tijd" };
  };

  console.log(appointments);
  return (
    <div className="user-dashboard-container">
      <h2>Mijn Afspraken</h2>
      <button onClick={handleSignOut}>Uitloggen</button>
      <ul>
        {appointments.map((appointment) => {
          const { date, time } = formatDateAndTime(appointment.date);
          return (
            <li key={appointment.id}>
              <div>
                <h3>Kapper: {appointment.kapper}</h3>
                <p>Datum: {date}</p>
                <p>Tijd: {time}</p>
                <p>Dienst: {appointment.dienst || "Onbekende dienst"}</p>
                <p>Prijs: {typeof appointment.price === 'number' ? appointment.price : 'Onbekende prijs'} euro</p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default UserDashboard;
