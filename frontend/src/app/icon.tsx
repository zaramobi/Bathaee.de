/**
 * Next.js App Router favicon generator.
 * Produces a 32×32 PNG via @vercel/og (Satori) at build/request time.
 * The SVG path replicates the Monogram mark exactly.
 */
import { ImageResponse } from "next/og";

export const size        = { width: 32, height: 32 };
export const contentType = "image/png";

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width:        "100%",
          height:       "100%",
          background:   "#0d0d0d",
          borderRadius: "8.67px",
          display:      "flex",
          alignItems:   "center",
          justifyContent: "center",
        }}
      >
        {/* B letterform — same geometry as Monogram.tsx, scaled to 24 px */}
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M5 3 H9 A9 4 0 0 1 9 11 A10 5 0 0 1 9 21 H5 Z"
            fill="white"
          />
        </svg>
      </div>
    ),
    { ...size },
  );
}
