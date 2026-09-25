"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { SharePostModal } from "./SharePostModal";

function instagramScrollToTop(duration = 420) {
  const start = window.scrollY || document.documentElement.scrollTop;
  if (start === 0) return;
  const startTime = performance.now();

  function scrollStep(currentTime: number) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Fast start, snappy deceleration curve like Instagram / iOS
    const ease = 1 - Math.pow(1 - progress, 3);
    window.scrollTo(0, start * (1 - ease));

    if (progress < 1) {
      requestAnimationFrame(scrollStep);
    }
  }

  requestAnimationFrame(scrollStep);
}

export function BottomNav() {
  const pathname = usePathname();
  const router = useRouter();
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [isHomeBouncing, setIsHomeBouncing] = useState(false);

  const handleHomeClick = (e: React.MouseEvent) => {
    setIsHomeBouncing(true);
    setTimeout(() => setIsHomeBouncing(false), 250);

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("gezgin:switch-tab", { detail: "flow" })
      );
    }

    if (pathname === "/") {
      e.preventDefault();
      instagramScrollToTop(400);
    } else {
      router.push("/?tab=flow");
      setTimeout(() => {
        instagramScrollToTop(400);
      }, 60);
    }
  };

  const handleRouteClick = (e: React.MouseEvent) => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("gezgin:switch-tab", { detail: "rota" })
      );
    }

    if (pathname === "/") {
      e.preventDefault();
      const el = document.getElementById("rota") || document.getElementById("kesfet");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      } else {
        window.scrollTo({ top: 380, behavior: "smooth" });
      }
    } else {
      router.push("/?tab=rota");
    }
  };

  return (
    <>
      <nav
        className="fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.04)]"
        aria-label="Bottom Navigation"
      >
        <div className="max-w-md sm:max-w-lg md:max-w-xl mx-auto px-8 h-16 flex items-center justify-between relative">
          {/* Left: Rota / Harita Icon (Original position) */}
          <Link
            href="/#kesfet"
            onClick={handleRouteClick}
            className="flex flex-col items-center justify-center text-gray-400 hover:text-[#0047ba] transition-colors p-2"
            title="Rota & Keşfet"
          >
            <svg
              className="w-7 h-7"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={1.8}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
              />
            </svg>
          </Link>

          {/* Center: Prominent Circular Blue + Button (Opens Posting Modal) */}
          <div className="absolute left-1/2 -translate-x-1/2 -top-5">
            <button
              type="button"
              onClick={() => setIsPostModalOpen(true)}
              className="w-14 h-14 rounded-full bg-[#0047ba] hover:bg-[#003896] text-white flex items-center justify-center shadow-lg shadow-blue-900/30 border-4 border-white transition-all transform hover:scale-105 active:scale-95 cursor-pointer"
              title="Yeni Paylaşım Yap"
            >
              <svg
                className="w-7 h-7"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                strokeWidth={2.8}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4v16m8-8H4"
                />
              </svg>
            </button>
          </div>

          {/* Right: Home Icon (Original position) */}
          <Link
            href="/"
            onClick={handleHomeClick}
            className={`flex flex-col items-center justify-center p-2 transition-all duration-150 ${
              isHomeBouncing ? "scale-75" : "scale-100"
            } ${
              pathname === "/"
                ? "text-[#0047ba]"
                : "text-gray-400 hover:text-[#0047ba]"
            }`}
            title="Ana Sayfa"
          >
            <svg
              className="w-7 h-7"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
            </svg>
          </Link>
        </div>
      </nav>

      {/* Posting Modal */}
      <SharePostModal
        isOpen={isPostModalOpen}
        onClose={() => setIsPostModalOpen(false)}
      />
    </>
  );
}
