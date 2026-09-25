/* eslint-disable @next/next/no-img-element */
"use client";

import React from "react";
import Link from "next/link";
import type { Place, PlaceCategory } from "@gezgin/types";

interface PlaceCardProps {
  place: Place;
  onSelect?: (place: Place) => void;
  onAddToTrip?: (place: Place) => void;
}

export const CATEGORY_LABELS: Record<
  PlaceCategory,
  { label: string; icon: string; badgeBg: string; badgeText: string }
> = {
  historical: {
    label: "Tarihi",
    icon: "🏛️",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-800",
  },
  museum: {
    label: "Müze",
    icon: "🎨",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-800",
  },
  restaurant: {
    label: "Restoran",
    icon: "🍽️",
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-800",
  },
  cafe: {
    label: "Kafe",
    icon: "☕",
    badgeBg: "bg-rose-100",
    badgeText: "text-rose-800",
  },
  nature: {
    label: "Doğa & Park",
    icon: "🌳",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-800",
  },
  shopping: {
    label: "Alışveriş",
    icon: "🛍️",
    badgeBg: "bg-indigo-100",
    badgeText: "text-indigo-800",
  },
  viewpoint: {
    label: "Manzara",
    icon: "🔭",
    badgeBg: "bg-cyan-100",
    badgeText: "text-cyan-800",
  },
  activity: {
    label: "Aktivite",
    icon: "⚡",
    badgeBg: "bg-yellow-100",
    badgeText: "text-yellow-800",
  },
  culture: {
    label: "Kültür",
    icon: "🎭",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-800",
  },
};

export function PlaceCard({ place, onSelect, onAddToTrip }: PlaceCardProps) {
  const categoryInfo = CATEGORY_LABELS[place.category] || {
    label: place.category,
    icon: "📍",
    badgeBg: "bg-gray-100",
    badgeText: "text-gray-800",
  };

  const priceIndicator = "₺".repeat(place.price_level);

  return (
    <div className="group bg-white rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between hover:-translate-y-1">
      {/* Top Image Container */}
      <div className="relative aspect-[16/10] overflow-hidden bg-gray-100">
        <img
          src={place.image_url}
          alt={place.name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-80" />

        {/* Category Badge Top Left */}
        <div className="absolute top-3 left-3">
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm backdrop-blur-md ${categoryInfo.badgeBg} ${categoryInfo.badgeText}`}
          >
            <span>{categoryInfo.icon}</span>
            <span>{categoryInfo.label}</span>
          </span>
        </div>

        {/* Rating and Price Badge Top Right */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          <span className="inline-flex items-center gap-1 text-xs font-bold px-2 py-1 rounded-full bg-white/95 text-gray-900 shadow-sm backdrop-blur-md">
            <span className="text-amber-500">★</span>
            <span>{place.rating.toFixed(1)}</span>
          </span>
          <span className="inline-flex items-center text-xs font-bold px-2 py-1 rounded-full bg-black/60 text-white shadow-sm backdrop-blur-md">
            {priceIndicator}
          </span>
        </div>

        {/* Duration bottom badge */}
        <div className="absolute bottom-2.5 right-3 text-white text-xs font-medium bg-black/50 backdrop-blur-sm px-2 py-0.5 rounded-md flex items-center gap-1">
          <span>⏱️</span>
          <span>{place.estimated_visit_minutes} dk</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          <h3
            onClick={() => onSelect && onSelect(place)}
            className="text-lg font-bold text-gray-900 leading-snug hover:text-sky-600 transition-colors cursor-pointer line-clamp-1"
            title={place.name}
          >
            {place.name}
          </h3>

          <p className="mt-1.5 text-xs text-gray-500 line-clamp-2 leading-relaxed">
            {place.description}
          </p>
        </div>

        <div className="mt-4 pt-3 border-t border-gray-100">
          <div className="flex items-center text-xs text-gray-400 mb-3 line-clamp-1">
            <span className="mr-1">📍</span>
            <span>{place.address}</span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onSelect && onSelect(place)}
              className="flex-1 py-2 px-3 text-xs font-semibold text-gray-700 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-center border border-gray-200"
            >
              Detayları Gör
            </button>

            <button
              type="button"
              onClick={() => onAddToTrip && onAddToTrip(place)}
              className="py-2 px-3 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-xl transition-colors flex items-center gap-1 shadow-sm"
              title="Bu mekanı gezi rotana ekle"
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
