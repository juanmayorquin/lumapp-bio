"use client";

import { SidebarLayout } from '@/components/SidebarLayout';
import React, { useState, useCallback } from 'react';
import { SetupScreen } from './SetupScreen';

export const AppContext = React.createContext<any>(null);

export function AppStateProvider({ children }: { children: React.ReactNode }) {
  const [name, setName] = useState("");
  const [age, setAge] = useState("");
  const [sex, setSex] = useState("masculino");
  const [weight, setWeight] = useState("");
  const [height, setHeight] = useState("");
  const [painLevel, setPainLevel] = useState([5]);
  const [emergencyContact, setEmergencyContact] = useState("");
  const [emergencyPhone, setEmergencyPhone] = useState("");
  const [isSetupComplete, setIsSetupComplete] = useState(false);

  const handleFieldChange = useCallback((setter: React.Dispatch<React.SetStateAction<any>>) => (value: any) => {
    setter(value);
  }, []);

  const completeSetup = () => setIsSetupComplete(true);

  const value = {
    name, setName: handleFieldChange(setName),
    age, setAge: handleFieldChange(setAge),
    sex, setSex,
    weight, setWeight: handleFieldChange(setWeight),
    height, setHeight: handleFieldChange(setHeight),
    painLevel, setPainLevel,
    emergencyContact, setEmergencyContact: handleFieldChange(setEmergencyContact),
    emergencyPhone, setEmergencyPhone: handleFieldChange(setEmergencyPhone),
    isSetupComplete,
    completeSetup,
  };

  if (!isSetupComplete) {
    return (
        <AppContext.Provider value={value}>
            <SetupScreen />
        </AppContext.Provider>
    )
  }

  return (
    <AppContext.Provider value={value}>
        <SidebarLayout>
            {children}
        </SidebarLayout>
    </AppContext.Provider>
  );
}
