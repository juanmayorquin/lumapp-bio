import type { Metadata } from 'next';
import './globals.css';
import { Toaster } from '@/components/ui/toaster';
import { AppStateProvider } from '@/components/AppStateProvider';
import ServiceWorkerRegister from '@/components/ServiceWorkerRegister';

export const metadata: Metadata = {
  title: 'LumApp',
  description: 'Tu compañero personal para la salud lumbar.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="light">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#b285e0" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <link rel="shortcut icon" href="/icon512_rounded.png" type="image/png" />
        <link rel="apple-touch-icon" href="/icon512_rounded.png" />
      </head>
      <body className="font-body antialiased">
        <AppStateProvider>
          {children}
        </AppStateProvider>
        <Toaster />
        {/* Register the service worker (client component) */}
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
