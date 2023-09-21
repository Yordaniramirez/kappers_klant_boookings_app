
import { createContext, useContext, useState } from 'react';

const AfspraakContext = createContext();

export function useAfspraak() {
  return useContext(AfspraakContext);
}

export function AfspraakProvider({ children }) {
  const [afspraakDetails, setAfspraakDetails] = useState(null);

  return (
    <AfspraakContext.Provider value={{ afspraakDetails, setAfspraakDetails }}>
      {children}
    </AfspraakContext.Provider>
  );
}
