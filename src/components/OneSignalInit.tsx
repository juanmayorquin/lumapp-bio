"use client";

import React, { useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export default function OneSignalInit() {
  useEffect(() => {
    const pageScriptUrl = "https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js";

    const getAppIdRuntime = async (): Promise<string | null> => {
      // build-time env (Next injecta NEXT_PUBLIC_ en el bundle solo si está definida)
      const envAppId = process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID;
      if (envAppId) return envAppId;
      // runtime fetch
      try {
        const resp = await fetch('/api/config');
        if (!resp.ok) return null;
        const json = await resp.json();
        return json.oneSignalAppId || null;
      } catch (e) {
        return null;
      }
    };

    const checkWorkersAccessible = async () => {
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
    };

    const pushInit = (appIdLocal: string) => {
      try {
        (window as any).OneSignalDeferred = (window as any).OneSignalDeferred || [];
        (window as any).OneSignalDeferred.push(async function (OneSignal: any) {
          try {
            await OneSignal.init({
              appId: appIdLocal,
              allowLocalhostAsSecureOrigin: true,
              notifyButton: { enable: false },
            });

            OneSignal.on && OneSignal.on('subscriptionChange', (isSubscribed: boolean) => {
              if (isSubscribed) {
                toast({ title: 'Suscripción activada', description: 'Has permitido notificaciones push.' });
              }
            });
          } catch (err) {
            console.error('OneSignal init error', err);
            toast({ title: 'OneSignal', description: 'Error al inicializar el SDK de OneSignal.' });
          }
        });
      } catch (e) {
        toast({ title: 'OneSignal', description: 'No se pudo inicializar OneSignal.' });
      }
    };

    const runInitWithAppId = (appIdLocal: string) => {
      // Si ya existe el SDK page global, solo empujamos init
      if ((window as any).OneSignal) {
        pushInit(appIdLocal);
        return;
      }

      // Insertar el script v16
      const s = document.createElement('script');
      s.src = pageScriptUrl;
      s.defer = true;
      s.onload = () => {
        pushInit(appIdLocal);
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
        toast({ title: 'OneSignal', description: 'No se pudo cargar el SDK de OneSignal (page). Revisa conexión, adblock o CSP.' });
      };
      document.head.appendChild(s);
    };

    (async () => {
      const appIdRuntime = await getAppIdRuntime();
      if (!appIdRuntime) {
        console.warn('OneSignal: NEXT_PUBLIC_ONESIGNAL_APP_ID no está definida en build-time ni en /api/config');
        toast({ title: 'OneSignal', description: 'NEXT_PUBLIC_ONESIGNAL_APP_ID no está definida. Asegura la variable en Netlify y redeploy.' });
        return;
      }

      await checkWorkersAccessible();
      runInitWithAppId(appIdRuntime);
    })();
  }, []);

  return null;
}
