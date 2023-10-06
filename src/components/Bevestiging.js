// Importeer benodigde modules en hooks
import React from 'react';
import { useAfspraak } from './AfspraakContext';

// Functie om een datumtijd-string te formatteren
function formatDate(dateString) {
    // Converteer de datumtijd-string naar een Date-object
    const date = new Date(dateString);
     // Controleer of de datum geldig is
    if (isNaN(date.getTime())) return { date: 'Onbekende datum', time: 'Onbekende tijd' };
    // Formatteer de datum en tijd
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); // Alleen uren en minuten
     // Geef de geformatteerde datum en tijd terug
    return { date: formattedDate, time: formattedTime };
}

// React component voor de afspraakbevestiging
function Bevestiging(props) {
    // Gebruik de custom hook om afspraakdetails op te halen
    const { afspraakDetails } = useAfspraak();
    
    // Toon een laadbericht als de afspraakdetails nog niet beschikbaar zijn
    if (!afspraakDetails) {
        return <div>Loading...</div>;
    }
    
    // Formatteer de geselecteerde datum en tijd
    const formattedDateTime = formatDate(afspraakDetails.selectedDate);

     // HTML en JSX voor het weergeven van de afspraakdetails
    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Bedankt voor je afspraak!</h2>
            <table style={{ width: '80%', margin: '50px auto', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '10px' }}>Kapper</th>
                        <th style={{ border: '1px solid black', padding: '10px' }}>Dienst</th>
                        <th style={{ border: '1px solid black', padding: '10px' }}>Datum</th>
                        <th style={{ border: '1px solid black', padding: '10px' }}>Tijd</th>
                        <th style={{ border: '1px solid black', padding: '10px' }}>Prijs</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ border: '1px solid black', padding: '10px' }}>{afspraakDetails.kapper}</td>
                        <td style={{ border: '1px solid black', padding: '10px' }}>{afspraakDetails.dienst}</td>
                        <td style={{ border: '1px solid black', padding: '10px' }}>{formattedDateTime.date}</td>
                        <td style={{ border: '1px solid black', padding: '10px' }}>{formattedDateTime.time}</td>
                        <td style={{ border: '1px solid black', padding: '10px' }}>{afspraakDetails.price } €</td>
                    </tr>
                </tbody>
            </table>
            <p>Wil je je afspraak wijzigen? Bel ons dan op [telefoonnummer].</p>
        </div>
    );
}

export default Bevestiging;
