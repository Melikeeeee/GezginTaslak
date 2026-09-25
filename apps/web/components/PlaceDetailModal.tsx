/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useEffect } from "react";
import Link from "next/link";
import type { Place } from "@gezgin/types";
import { CATEGORY_LABELS } from "./PlaceCard";

interface PlaceDetailModalProps {
  place: Place | null;
  isOpen: boolean;
  onClose: () => void;
  onAddToTrip?: (place: Place) => void;
}

export function PlaceDetailModal({
  place,
  isOpen,
  onClose,
  onAddToTrip,
}: PlaceDetailModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !place) return null;

  const categoryInfo = CATEGORY_LABELS[place.category] || {
    label: place.category,
    icon: "📍",
    badgeBg: "bg-gray-100",
    badgeText: "text-gray-800",
  };

  const priceIndicator = "₺".repeat(place.price_level);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog Card */}
      <div className="relative bg-white w-full max-w-2xl rounded-3xl shadow-2xl overflow-hidden z-10 flex flex-col max-h-[90vh] animate-in fade-in zoom-in-95 duration-200">
        {/* Top Image Banner */}
        <div className="relative h-64 sm:h-72 w-full bg-gray-900 overflow-hidden flex-shrink-0">
          <img
            src={place.image_url}
            alt={place.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

          {/* Close button */}
          <button
            type="button"
            onClick={onClose}
            className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center backdrop-blur-md transition-colors"
            title="Kapat"
          >
            ✕
          </button>

          {/* Floating Badges */}
          <div className="absolute top-4 left-4 flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1 text-xs font-semibold px-3 py-1 rounded-full shadow-md backdrop-blur-md ${categoryInfo.badgeBg} ${categoryInfo.badgeText}`}
            >
              <span>{categoryInfo.icon}</span>
              <span>{categoryInfo.label}</span>
            </span>
          </div>

          {/* Bottom Title on Image */}
          <div className="absolute bottom-4 left-4 right-4 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded-full bg-amber-400 text-amber-950">
                <span>★</span>
                <span>{place.rating.toFixed(1)}</span>
              </span>
              <span className="text-xs font-semibold text-gray-200 bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                Fiyat: {priceIndicator}
              </span>
              <span className="text-xs font-semibold text-gray-200 bg-white/20 px-2 py-0.5 rounded-full backdrop-blur-sm">
                ⏱️ {place.estimated_visit_minutes} dk
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold leading-tight drop-shadow-md">
              {place.name}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-5">
          {/* Description */}
          <div>
            <h3 className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-1.5">
              Hakkında
            </h3>
            <p className="text-sm text-gray-700 leading-relaxed">
              {place.description}
            </p>
          </div>

          {/* Info Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 bg-gray-50 p-4 rounded-2xl border border-gray-100">
            <div className="flex items-start gap-2.5">
              <span className="text-lg">🕒</span>
              <div>
                <p className="text-xs font-bold text-gray-900">Ziyaret Saatleri</p>
                <p className="text-xs text-gray-600 mt-0.5">
                  {place.opening_hours}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="text-lg">📍</span>
              <div>
                <p className="text-xs font-bold text-gray-900">Adres</p>
                <p className="text-xs text-gray-600 mt-0.5 leading-snug">
                  {place.address}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="text-lg">🧭</span>
              <div>
                <p className="text-xs font-bold text-gray-900">Konum Koordinatları</p>
                <p className="text-xs text-gray-600 mt-0.5 font-mono">
                  {place.latitude.toFixed(4)}, {place.longitude.toFixed(4)}
                </p>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <span className="text-lg">⏳</span>
              <div>
                <p className="text-xs font-bold text-gray-900">Önerilen Ziyaret Süresi</p>
                <p className="text-xs text-gray-600 mt-0.5">
                  Yaklaşık {place.estimated_visit_minutes} dakika
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer Actions */}
        <div className="p-4 sm:p-5 bg-gray-50 border-t border-gray-100 flex items-center justify-between gap-3">
          <Link
            href={`/places/${place.slug}`}
            className="text-xs font-semibold text-sky-600 hover:text-sky-700 hover:underline"
          >
            Sayfa Olarak Aç ↗
          </Link>

          <div className="flex items-center gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="py-2.5 px-4 text-xs font-semibold text-gray-700 bg-white border border-gray-200 hover:bg-gray-100 rounded-xl transition-colors"
            >
              Kapat
            </button>

            <button
              type="button"
              onClick={() => {
                onClose();
                if (onAddToTrip) onAddToTrip(place);
              }}
              className="py-2.5 px-5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-xl transition-all shadow-md hover:shadow-lg flex items-center gap-1.5"
            >
              <span>+</span>
              <span>Rotaya Ekle</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
