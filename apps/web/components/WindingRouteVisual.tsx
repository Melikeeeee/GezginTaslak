import React from "react";

export function WindingRouteVisual() {
  return (
    <div className="relative w-full h-[320px] rounded-2xl overflow-hidden shadow-inner select-none">
      {/* Background Gradient matching the user reference */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(180deg, #14b8a6 0%, #0891b2 35%, #0284c7 70%, #0047ba 100%)",
        }}
      />

      {/* SVG Winding Road */}
      <svg
        className="absolute inset-0 w-full h-full"
        viewBox="0 0 360 320"
        fill="none"
        preserveAspectRatio="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Road Ribbon (Thick light transparent lane) */}
        <path
          d="M 180 330 C 180 280, 110 270, 160 210 C 230 130, 270 200, 230 110 C 200 40, 140 30, 130 -10"
          stroke="rgba(255, 255, 255, 0.45)"
          strokeWidth="64"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Road Surface highlight */}
        <path
          d="M 180 330 C 180 280, 110 270, 160 210 C 230 130, 270 200, 230 110 C 200 40, 140 30, 130 -10"
          stroke="rgba(255, 255, 255, 0.2)"
          strokeWidth="52"
          strokeLinecap="round"
          strokeLinejoin="round"
        />

        {/* Dashed Center Stripe */}
        <path
          d="M 180 330 C 180 280, 110 270, 160 210 C 230 130, 270 200, 230 110 C 200 40, 140 30, 130 -10"
          stroke="#ffffff"
          strokeWidth="3.5"
          strokeDasharray="10 10"
          strokeLinecap="round"
          fill="none"
        />
      </svg>

      {/* Point 1: Tarihi (Historical) - Top */}
      <div
        className="absolute flex flex-col items-center group cursor-pointer transition-transform hover:scale-110"
        style={{ top: "26%", left: "46%", transform: "translate(-50%, -50%)" }}
      >
        <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center border-2 border-white/80">
          {/* Temple / Columns Icon */}
          <svg
            className="w-6 h-6 text-[#0047ba]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M12 2L2 7v2h20V7L12 2zm-8 7h2v10H4V9zm5 0h2v10H9V9zm5 0h2v10h-2V9zm5 0h2v10h-2V9zM2 20v2h20v-2H2z" />
          </svg>
        </div>
        <span className="text-white text-xs font-bold tracking-wide mt-1 drop-shadow-md">
          Tarihi
        </span>
      </div>

      {/* Point 2: Restoran (Restaurant) - Middle Right */}
      <div
        className="absolute flex flex-col items-center group cursor-pointer transition-transform hover:scale-110"
        style={{ top: "54%", left: "67%", transform: "translate(-50%, -50%)" }}
      >
        <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center border-2 border-white/80">
          {/* Fork & Knife Icon */}
          <svg
            className="w-6 h-6 text-[#0047ba]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M11 9H9V2H7v7H5V2H3v7c0 2.12 1.66 3.84 3.75 3.97V22h2.5v-9.03C11.34 12.84 13 11.12 13 9V2h-2v7zm5-3v8h2.5v8H21V2c-2.76 0-5 2.24-5 4z" />
          </svg>
        </div>
        <span className="text-white text-xs font-bold tracking-wide mt-1 drop-shadow-md">
          Restoran
        </span>
      </div>

      {/* Point 3: Doğa (Nature) - Bottom Left */}
      <div
        className="absolute flex flex-col items-center group cursor-pointer transition-transform hover:scale-110"
        style={{ top: "80%", left: "43%", transform: "translate(-50%, -50%)" }}
      >
        <div className="w-12 h-12 rounded-full bg-white shadow-md flex items-center justify-center border-2 border-white/80">
          {/* Mountain / Nature Icon */}
          <svg
            className="w-6 h-6 text-[#0047ba]"
            fill="currentColor"
            viewBox="0 0 24 24"
          >
            <path d="M14 6l-3.75 5 2.85 3.8-1.6 1.2L6 8 1 18h22L14 6z" />
          </svg>
        </div>
        <span className="text-white text-xs font-bold tracking-wide mt-1 drop-shadow-md">
          Doğa
        </span>
      </div>
    </div>
  );
}
