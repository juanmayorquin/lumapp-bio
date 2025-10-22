"use client";

import React, { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export default function OneSignalInit() {
  useEffect(() => {
    const appId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
    if (!appId) {
      // Notificar claramente que falta la variable de entorno
      console.warn('OneSignal: NEXT_PUBLIC_ONESIGNAL_APP_ID no está definida');
      toast({ title: 'OneSignal', description: 'NEXT_PUBLIC_ONESIGNAL_APP_ID no está definida. Añade la variable de entorno y reinicia el servidor.' });
      return;
    }
    if (typeof window === "undefined") return;

    // Pattern compatible con el snippet de OneSignal v16 que enviaste.
    // Añadimos el script `OneSignalSDK.page.js` y usamos `OneSignalDeferred` para inicializar.
    if (typeof window === "undefined") return;

    const pageScriptUrl = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";

    // Comprobar que los workers públicos están accesibles (evitar 404/403)
    (async () => {
      try {
        const urls = ['/OneSignalSDKWorker.js', '/OneSignalSDKUpdaterWorker.js'];
        for (const u of urls) {
          try {
            const r = await fetch(u, { method: 'HEAD' });
            if (!r.ok) {
              console.warn(`OneSignal: fichero ${u} no accesible (status=${r.status})`);
              toast({ title: 'OneSignal', description: `Fichero ${u} no accesible (status ${r.status}). Asegúrate de que existe en /public y está servido.` });
            }
          } catch (e) {
            console.warn(`OneSignal: error al comprobar ${u}`, e);
            toast({ title: 'OneSignal', description: `No se pudo comprobar ${u}. Comprueba la ruta y permisos.` });
          }
        }
      } catch (e) {
        // ignore
      }
    })();

    // Push init into OneSignalDeferred so it runs cuando el SDK esté listo
    const pushInit = () => {
      try {
        (window as any).OneSignalDeferred = (window as any).OneSignalDeferred || [];
        (window as any).OneSignalDeferred.push(async function (OneSignal: any) {
          try {
            await OneSignal.init({
              appId,
              allowLocalhostAsSecureOrigin: true,
              notifyButton: { enable: false },
            });

            OneSignal.on && OneSignal.on("subscriptionChange", (isSubscribed: boolean) => {
              if (isSubscribed) {
                toast({ title: "Suscripción activada", description: "Has permitido notificaciones push." });
              }
            });
          } catch (err) {
            console.error("OneSignal init error", err);
            toast({ title: "OneSignal", description: "Error al inicializar el SDK de OneSignal." });
          }
        });
      } catch (e) {
        toast({ title: "OneSignal", description: "No se pudo inicializar OneSignal." });
      }
    };

    // Si ya existe el SDK page global, solo empujamos init
    if ((window as any).OneSignal) {
      pushInit();
      return;
    }

    // Insertar el script v16
    const s = document.createElement("script");
    s.src = pageScriptUrl;
    s.defer = true;
    s.onload = () => {
      pushInit();
      // After a timeout, verify that OneSignal is actually initialized
      setTimeout(() => {
        const ok = !!(window as any).OneSignal || !!(window as any).OneSignalDeferred;
        if (!ok) {
          console.error('OneSignal SDK cargado pero no inicializado. Posibles causas: adblocker, CSP, o appId incorrecto.');
          toast({ title: 'OneSignal', description: 'SDK cargado pero no inicializado. Revisa consola (adblock, CSP, appId o dominio en OneSignal).' });
        }
      }, 8000);
    };
    s.onerror = (ev) => {
      console.error('Error loading OneSignalSDK.page.js', ev);
      toast({ title: "OneSignal", description: "No se pudo cargar el SDK de OneSignal (page). Revisa conexión, adblock o CSP." });
    };
    document.head.appendChild(s);
  }, []);

  return null;
}
