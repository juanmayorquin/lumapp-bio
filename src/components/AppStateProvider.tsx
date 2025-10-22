"use client";

import { SidebarLayout } from '@/components/SidebarLayout';
import React, { useState, useCallback, useEffect, useRef, useMemo } from 'react';
import { SetupScreen } from './SetupScreen';
import localStorageService, { UserData } from '@/services/localStorageService';
import { toast } from '@/hooks/use-toast';
import OneSignalInit from './OneSignalInit';

export const AppContext = React.createContext<any>({
  name: "",
  setName: () => {},
  age: "",
  setAge: () => {},
  sex: "masculino",
  setSex: () => {},
  weight: "",
  setWeight: () => {},
  height: "",
  setHeight: () => {},
  painLevel: [5],
  setPainLevel: () => {},
  emergencyContact: "",
  setEmergencyContact: () => {},
  emergencyPhone: "",
  setEmergencyPhone: () => {},
  isSetupComplete: false,
  completeSetup: () => {},
  streak: 0,
  lastVisit: undefined,
  clearUser: () => {},
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

  // Notificación de bienvenida: mostrar en cada carga si el permiso está concedido o tras concederlo
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const isNotificationSupported = 'Notification' in window;

    const showWelcomeNotification = () => {
      try {
        // This will show a notification while the page is open (foreground).
        new Notification('Bienvenido a LumApp', {
          body: 'Bienvenido a LumApp — descubre cómo cuidar tu espalda hoy.',
          icon: '/favicon.ico',
        });
      } catch (e) {
        // If Notifications are available but constructor fails, fallback to toast
        toast({ title: 'Bienvenido a LumApp', description: 'Bienvenido a LumApp — descubre cómo cuidar tu espalda hoy.' });
      }
    };

    // Helper to convert VAPID key
    function urlBase64ToUint8Array(base64String: string) {
      const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
      const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
      const rawData = window.atob(base64);
      const outputArray = new Uint8Array(rawData.length);
      for (let i = 0; i < rawData.length; ++i) {
        outputArray[i] = rawData.charCodeAt(i);
      }
      return outputArray;
    }

    try {
      // si ya se concedió permiso, mostrar inmediatamente
      if (isNotificationSupported && Notification.permission === 'granted') {
        showWelcomeNotification();
      } else if (isNotificationSupported && Notification.permission !== 'denied') {
        // pedir permiso y mostrar si el usuario concede
        Notification.requestPermission().then((perm) => {
          if (perm === 'granted') {
            showWelcomeNotification();
          } else {
            // usuario denegó al pedir el permiso
            toast({ title: 'Notificaciones desactivadas', description: 'Has denegado el permiso de notificaciones. Puedes activarlo en la configuración del navegador.' });
          }
        });
      } else {
        // Notifications API no soportada -> fallback to toast
        toast({ title: 'Notificaciones no disponibles', description: 'Tu navegador no soporta notificaciones web. Recibirás avisos en la app mientras esté abierta.' });
      }
    } catch (e) {
      // fallback
      toast({ title: 'Notificaciones', description: 'No fue posible mostrar la notificación nativa. Verifica los permisos del navegador.' });
    }

    // Intentar registrar un service worker para habilitar push en segundo plano
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.register('/sw.js').then(async (registration) => {
        // Si el navegador soporta PushManager y hay una clave VAPID definida, intentar suscribir
        try {
          const vapidKey = process.env.NEXT_PUBLIC_VAPID_KEY;
          if ('PushManager' in window && vapidKey) {
            const existing = await registration.pushManager.getSubscription();
            if (!existing) {
              try {
                const sub = await registration.pushManager.subscribe({
                  userVisibleOnly: true,
                  applicationServerKey: urlBase64ToUint8Array(vapidKey as string),
                });
                // No podemos enviar la suscripción al servidor aquí (requiere backend).
                // Guardamos en localStorage para uso futuro.
                try {
                  window.localStorage.setItem('lumapp_push_subscription', JSON.stringify(sub));
                } catch (e) {
                  // ignore
                }
                toast({ title: 'Suscripción push registrada', description: 'La aplicación está preparada para notificaciones en segundo plano (requiere servidor para enviar push).' });
              } catch (err) {
                // Suscripción falló
                // No es crítico: el usuario aún puede recibir notificaciones en primer plano.
              }
            }
          }
        } catch (e) {
          // ignore
        }
      }).catch((err) => {
        // Registro del service worker falló; usar toast como fallback informativo
        toast({ title: 'Service Worker', description: 'No se pudo registrar el service worker; las notificaciones en segundo plano no estarán disponibles.' });
      });
    }
  }, []);

  if (!isSetupComplete) {
    return (
        <AppContext.Provider value={value}>
      <SetupScreen />
        </AppContext.Provider>
    )
  }

  return (
    <AppContext.Provider value={value}>
    {/* Inicializa OneSignal si NEXT_PUBLIC_ONESIGNAL_APP_ID está configurada */}
    <OneSignalInit />
    <SidebarLayout>
      {children}
    </SidebarLayout>
    </AppContext.Provider>
  );
}
