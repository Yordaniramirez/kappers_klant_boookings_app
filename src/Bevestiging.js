import React from 'react';
import { useAfspraak } from './AfspraakContext';

function formatDate(dateString) {
    const date = new Date(dateString);
    return !isNaN(date.getTime()) ? date.toLocaleString() : 'Onbekende datum';
}

function Bevestiging(props) {
    const { afspraakDetails } = useAfspraak();

    // Controleer of afspraakDetails bestaat voordat we proberen de waarden te lezen.
    if (!afspraakDetails) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ textAlign: 'center', padding: '50px' }}>
            <h2>Bedankt voor je afspraak!</h2>
            <table style={{ width: '80%', margin: '50px auto', borderCollapse: 'collapse' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid black', padding: '10px' }}>Kapper</th>
                        <th style={{ border: '1px solid black', padding: '10px' }}>Dienst</th>
                        <th style={{ border: '1px solid black', padding: '10px' }}>Datum</th>
                        <th style={{ border: '1px solid black', padding: '10px' }}>Prijs</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style={{ border: '1px solid black', padding: '10px' }}>{afspraakDetails.kapper}</td>
                        <td style={{ border: '1px solid black', padding: '10px' }}>{afspraakDetails.dienst}</td>
                        <td style={{ border: '1px solid black', padding: '10px' }}>{formatDate(afspraakDetails.selectedDate)}</td>
                        <td style={{ border: '1px solid black', padding: '10px' }}>€{afspraakDetails.price}</td>
                    </tr>
                </tbody>
            </table>
            <p>Wil je je afspraak wijzigen? Bel ons dan op [telefoonnummer].</p>
        </div>
    );
}

export default Bevestiging;
