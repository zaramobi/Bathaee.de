/**
 * Next.js Route Handler — proxies POST /api/contact to the FastAPI backend.
 *
 * Why this exists:
 *   NEXT_PUBLIC_API_URL inside Docker is "http://backend:8000" — a hostname only
 *   the Docker network can resolve.  Server components (getProfile, getProfiles)
 *   work fine because Next.js fetches them server-side.  But the contact form
 *   runs in the browser, which cannot reach "http://backend:8000".
 *
 *   This route handler runs on the Next.js server, so it CAN reach the backend.
 *   The browser just POSTs to "/api/contact" (same origin) and never needs to
 *   know the backend's internal address.
 */
import { NextRequest, NextResponse } from "next/server";

const BACKEND = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    const upstream = await fetch(`${BACKEND}/api/contact`, {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify(body),
    });

    const data = await upstream.json();
    return NextResponse.json(data, { status: upstream.status });
  } catch (err) {
    console.error("[/api/contact proxy]", err);
    return NextResponse.json(
      { success: false, detail: "Could not reach the backend. Please try again later." },
      { status: 502 },
    );
  }
}
