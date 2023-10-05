// Importeer de benodigde modules uit de React-bibliotheek
import { createContext, useContext, useState } from 'react';

// Maak een Context-object. Dit object bevat een React-component (Provider) die de context zal verstrekken.
const AfspraakContext = createContext();

// Exporteer een aangepaste hook die useContext gebruikt om de afspraakcontext op te halen
// Deze hook is bedoeld om het gemakkelijk te maken voor andere componenten om toegang te krijgen tot de afspraakcontext.
export function useAfspraak() {
  return useContext(AfspraakContext);
}

// Exporteer de AfspraakProvider-component die de AfspraakContext.Provider gebruikt
// De Provider maakt het mogelijk om state te delen met andere componenten
export function AfspraakProvider({ children }) {
  // Definieer een stukje lokale state (afspraakDetails) en de functie om deze te wijzigen (setAfspraakDetails)
  // De initiële waarde is null.
  const [afspraakDetails, setAfspraakDetails] = useState(null);

  // De AfspraakContext.Provider-component wordt geretourneerd met zijn value prop ingesteld op het afspraakDetails-object en de setAfspraakDetails functie.
  // Hierdoor kunnen child componenten deze waarde en functie gebruiken via de useAfspraak custom hook.
  return (
    <AfspraakContext.Provider value={{ afspraakDetails, setAfspraakDetails }}>
      {/* Render de child componenten */}
      {children}
    </AfspraakContext.Provider>
  );
}
