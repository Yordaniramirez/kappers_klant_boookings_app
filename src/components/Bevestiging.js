import React from 'react';
import { useAfspraak } from './AfspraakContext';

function formatDate(dateString) {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return { date: 'Onbekende datum', time: 'Onbekende tijd' };
    const formattedDate = date.toLocaleDateString();
    const formattedTime = date.toLocaleTimeString();
    return { date: formattedDate, time: formattedTime };
}

function Bevestiging(props) {
    const { afspraakDetails } = useAfspraak();

    if (!afspraakDetails) {
        return <div>Loading...</div>;
    }

    const formattedDateTime = formatDate(afspraakDetails.selectedDate);

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
                        <td style={{ border: '1px solid black', padding: '10px' }}>€{afspraakDetails.price}</td>
                    </tr>
                </tbody>
            </table>
            <p>Wil je je afspraak wijzigen? Bel ons dan op [telefoonnummer].</p>
        </div>
    );
}

export default Bevestiging;
