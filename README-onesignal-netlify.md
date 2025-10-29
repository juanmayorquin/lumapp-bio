Guía rápida: desplegar LumbApp con OneSignal en Netlify

Requisitos previos
- Cuenta en Netlify
- App creada en OneSignal con `App ID`
- Dominio configurado en OneSignal (puede ser localhost para pruebas con allowLocalhostAsSecureOrigin)

Pasos:

1. Variables de entorno en Netlify
   - Define `NEXT_PUBLIC_ONESIGNAL_APP_ID` con tu App ID de OneSignal.
   - Asegúrate de otras variables que uses en producción estén también definidas.

2. Archivos service worker
   - En el repo ya hay:
     - `/public/OneSignalSDKWorker.js` (importa el SDK sw de OneSignal v16)
     - `/public/OneSignalSDKUpdaterWorker.js` (importa updater worker)
     - `/public/sw.js` (service worker genérico para push desde tu backend)
   - Netlify sirve `/public` en la raíz del sitio; OneSignal espera encontrar `/OneSignalSDKWorker.js` en la raíz.

3. netlify.toml
   - El repo incluye `netlify.toml` que configura el plugin Next.js y evita cache en los workers.

4. Deploy
   - Conecta el repo a Netlify y haz deploy.
   - En Netlify, configura un "Build command": `pnpm build` y un "Publish directory": `.next` (ya está en netlify.toml).

5. Verificar
   - Abre el sitio desplegado y en DevTools verifica que:
     - `/OneSignalSDKWorker.js` y `/OneSignalSDKUpdaterWorker.js` devuelven 200.
     - Se carga `https://cdn.onesignal.com/sdks/web/v16/OneSignalSDK.page.js` desde el cliente.
     - OneSignal inicializa con tu `appId`.

Notas:
- Para env local, crea `.env.local` con `NEXT_PUBLIC_ONESIGNAL_APP_ID`.
- Para pruebas en Android/iOS reales, usa HTTPS (Netlify ya lo provee).
- Si planeas enviar notificaciones desde tu backend, mantén el service worker `sw.js` o integra con OneSignal API para usar su infraestructura.
