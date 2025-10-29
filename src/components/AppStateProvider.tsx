"use client";

import { SidebarLayout } from '@/components/SidebarLayout';
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { SetupScreen } from './SetupScreen';
import localStorageService, { UserData } from '@/services/localStorageService';
import { toast, useToast } from '@/hooks/use-toast';

export const AppContext = React.createContext<any>({
  name: "",
  setName: () => { },
  age: "",
  setAge: () => { },
  sex: "masculino",
  setSex: () => { },
  weight: "",
  setWeight: () => { },
  height: "",
  setHeight: () => { },
  painLevel: [5],
  setPainLevel: () => { },
  emergencyContact: "",
  setEmergencyContact: () => { },
  emergencyPhone: "",
  setEmergencyPhone: () => { },
  isSetupComplete: false,
  completeSetup: () => { },
  streak: 0,
  lastVisit: undefined,
  clearUser: () => { },
});

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
  const [streak, setStreak] = useState<number>(0);
  const [lastVisit, setLastVisit] = useState<string | undefined>(undefined);

  // ref used for debounce
  const saveTimeout = useRef<number | null>(null);

  // hook para controlar toasts (dismiss)
  const { dismiss } = useToast();

  // keep a ref to dismiss to avoid unstable identity causing effects to re-run
  const dismissRef = useRef(dismiss);
  useEffect(() => {
    dismissRef.current = dismiss;
  }, [dismiss]);

  const handleFieldChange = useCallback((setter: React.Dispatch<React.SetStateAction<any>>) => (value: any) => {
    setter(value);
  }, []);

  const completeSetup = () => setIsSetupComplete(true);

  const value = useMemo(() => ({
    name,
    setName: handleFieldChange(setName),
    age,
    setAge: handleFieldChange(setAge),
    sex,
    setSex,
    weight,
    setWeight: handleFieldChange(setWeight),
    height,
    setHeight: handleFieldChange(setHeight),
    painLevel,
    setPainLevel,
    emergencyContact,
    setEmergencyContact: handleFieldChange(setEmergencyContact),
    emergencyPhone,
    setEmergencyPhone: handleFieldChange(setEmergencyPhone),
    isSetupComplete,
    completeSetup,
    streak,
    setStreak,
    lastVisit,
    setLastVisit,
    clearUser: () => {
      localStorageService.clearUser();
      setName(""); setAge(""); setSex("masculino"); setWeight(""); setHeight(""); setPainLevel([5]); setEmergencyContact(""); setEmergencyPhone(""); setIsSetupComplete(false);
      setStreak(0);
      setLastVisit(undefined);
    }
  }), [
    name, age, sex, weight, height, painLevel, emergencyContact, emergencyPhone, isSetupComplete, streak, lastVisit, handleFieldChange
  ]);

  // load initial state from localStorage on mount
  useEffect(() => {
    const saved = localStorageService.getUser();
    if (saved) {
      if (typeof saved.name !== 'undefined') setName(saved.name || "");
      if (typeof saved.age !== 'undefined') setAge(saved.age || "");
      if (typeof saved.sex !== 'undefined') setSex(saved.sex || "masculino");
      if (typeof saved.weight !== 'undefined') setWeight(saved.weight || "");
      if (typeof saved.height !== 'undefined') setHeight(saved.height || "");
      if (typeof saved.painLevel !== 'undefined') setPainLevel(saved.painLevel || [5]);
      if (typeof saved.emergencyContact !== 'undefined') setEmergencyContact(saved.emergencyContact || "");
      if (typeof saved.emergencyPhone !== 'undefined') setEmergencyPhone(saved.emergencyPhone || "");
      if (typeof saved.isSetupComplete !== 'undefined') setIsSetupComplete(!!saved.isSetupComplete);
      if (typeof saved.streak !== 'undefined') setStreak(saved.streak || 0);
      if (typeof saved.lastVisit !== 'undefined') setLastVisit(saved.lastVisit || undefined);
    }
  }, []);

  // save to localStorage when any relevant field changes (debounced)
  useEffect(() => {
    // clear previous timeout
    if (saveTimeout.current) {
      window.clearTimeout(saveTimeout.current);
    }

    // schedule save
    saveTimeout.current = window.setTimeout(() => {
      const data: UserData = {
        name,
        age,
        sex,
        weight,
        height,
        painLevel,
        emergencyContact,
        emergencyPhone,
        isSetupComplete,
        streak,
        lastVisit,
      };
      localStorageService.setUser(data);
      saveTimeout.current = null;
    }, 300);

    return () => {
      if (saveTimeout.current) {
        window.clearTimeout(saveTimeout.current);
        saveTimeout.current = null;
      }
    };
  }, [name, age, sex, weight, height, painLevel, emergencyContact, emergencyPhone, isSetupComplete, streak, lastVisit]);


  // Racha: al montar/comprobar sesión, actualizar streak y lastVisit
  useEffect(() => {
    // Determinar la fecha en formato YYYY-MM-DD
    const today = new Date();
    const isoDate = today.toISOString().slice(0, 10);

    const saved = localStorageService.getUser();
    const prev = saved?.lastVisit;
    const prevStreak = saved?.streak || 0;

    if (!prev) {
      // Primera vez -> iniciar streak en 1
      setStreak(1);
      setLastVisit(isoDate);
      localStorageService.setUser({ ...(saved || {}), streak: 1, lastVisit: isoDate });
      return;
    }

    if (prev === isoDate) {
      // Ya visitó hoy; no hacer nada
      setLastVisit(prev);
      setStreak(prevStreak);
      return;
    }

    // calcular diferencia en días entre prev y today
    const prevDate = new Date(prev + 'T00:00:00');
    const diffMs = today.getTime() - prevDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 1) {
      // visita consecutiva -> incrementar streak
      const next = prevStreak + 1 || 1;
      setStreak(next);
      setLastVisit(isoDate);
      localStorageService.setUser({ ...(saved || {}), streak: next, lastVisit: isoDate });
    } else {
      // más de un día de gap -> reiniciar streak a 1
      setStreak(1);
      setLastVisit(isoDate);
      localStorageService.setUser({ ...(saved || {}), streak: 1, lastVisit: isoDate });
    }
  }, []);

  // flag to suppress other toasts during initial welcome window
  const suppressToasts = React.useRef(true);

  // show welcome toast and dismiss others on mount BUT only if an existing user is registered
  useEffect(() => {
    const saved = localStorageService.getUser();
    // Only show welcome if there's a saved user who completed setup (registered)
    if (!saved || !saved.isSetupComplete) return;

    // Dismiss any existing toasts and show welcome toast
    try {
      dismissRef.current?.();
    } catch (e) {
      // ignore if dismiss not available
    }

    // Show welcome toast (TOAST_LIMIT = 1 ensures it replaces others)
    toast({ title: 'Bienvenido a LumbApp', description: 'Bienvenido a LumbApp — descubre cómo cuidar tu espalda hoy.' });

    // Keep suppressing other toasts for a short window (3s) so welcome is the visible one
    const t = window.setTimeout(() => {
      suppressToasts.current = false;
      window.clearTimeout(t);
    }, 3000);
    return () => {
      window.clearTimeout(t);
    };
    // run only once on mount (we use dismissRef inside)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Removed native Notification API and service worker / push subscription logic.
  // Per product decision, the app will no longer ask for native notification permission
  // or attempt to register push — instead we only show an in-app toast on startup
  // for existing registered users (handled above).

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
