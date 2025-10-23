import { NextResponse } from 'next/server'

export async function GET() {
  // Expose runtime config for client debugging; in production ensure this
  // doesn't leak secrets (we only expose the public NEXT_PUBLIC_* var).
  return NextResponse.json({
    oneSignalAppId: process.env.NEXT_PUBLIC_ONESIGNAL_APP_ID || null,
  })
}
