'use client';

import { useEffect } from 'react';

// Dynamically import the next-pwa register module inside a client-side effect
// and only in production. This prevents Turbopack / dev from evaluating the
// module at module-evaluation time where build-time constants like
// __PWA_START_URL__ may be undefined.
export default function ServiceWorkerRegister() {
    useEffect(() => {
        // Only register in production builds
        if (process.env.NODE_ENV !== 'production') return;
        if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return;

        import('next-pwa/register')
            .catch((err) => {
                // swallow errors: registration is best-effort
                console.debug('SW register failed', err);
            });
    }, []);

    return null;
}
