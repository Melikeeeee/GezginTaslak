/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ALL_PLACES } from "@gezgin/supabase-queries";
import { CATEGORY_LABELS } from "@/components/PlaceCard";
import { AddToTripModal } from "@/components/AddToTripModal";

export default function PlaceDetailPage() {
  const params = useParams<{ slug: string }>();
  const router = useRouter();
  const slug = params?.slug;

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // Lookup place from seed data
  const place = ALL_PLACES.find((p) => p.slug === slug);

  if (!place) {
    return (
      <main className="w-full max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto text-2xl mb-4">
          ⚠️
        </div>
        <h1 className="text-2xl font-extrabold text-gray-900 mb-2">
          Mekan Bulunamadı
        </h1>
        <p className="text-sm text-gray-500 mb-6">
          Aradığınız mekan sistemde mevcut değil veya kaldırılmış olabilir.
        </p>
        <Link
          href="/"
          className="inline-flex items-center gap-2 py-2.5 px-5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
        >
          <span>←</span>
          <span>Keşfet Sayfasına Dön</span>
        </Link>
      </main>
    );
  }

  const categoryInfo = CATEGORY_LABELS[place.category] || {
    label: place.category,
    icon: "📍",
    badgeBg: "bg-gray-100",
    badgeText: "text-gray-800",
  };

  const priceIndicator = "₺".repeat(place.price_level);

  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-20">
      {/* Breadcrumbs */}
      <nav className="flex items-center gap-2 text-xs text-gray-500 mb-6">
        <Link href="/" className="hover:text-sky-600 transition-colors">
          Ana Sayfa
        </Link>
        <span>/</span>
        <Link href="/#kesfet" className="hover:text-sky-600 transition-colors">
          İstanbul Keşfet
        </Link>
        <span>/</span>
        <span className="text-gray-900 font-semibold truncate max-w-xs">
          {place.name}
        </span>
      </nav>

      {/* Hero Banner with Image */}
      <div className="relative w-full h-80 sm:h-96 rounded-3xl overflow-hidden shadow-lg mb-8 bg-gray-900">
        <img
          src={place.image_url}
          alt={place.name}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

        {/* Top Badges */}
        <div className="absolute top-4 left-4 flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full shadow-md backdrop-blur-md ${categoryInfo.badgeBg} ${categoryInfo.badgeText}`}
          >
            <span>{categoryInfo.icon}</span>
            <span>{categoryInfo.label}</span>
          </span>
          <span className="text-xs font-bold text-gray-900 bg-white/95 px-2.5 py-1 rounded-full shadow-md backdrop-blur-md flex items-center gap-1">
            <span className="text-amber-500">★</span>
            <span>{place.rating.toFixed(1)}</span>
          </span>
        </div>

        {/* Back Button on Banner */}
        <button
          type="button"
          onClick={() => router.back()}
          className="absolute top-4 right-4 py-1.5 px-3 rounded-full bg-black/40 hover:bg-black/70 text-white text-xs font-semibold backdrop-blur-md transition-colors flex items-center gap-1"
        >
          <span>←</span>
          <span>Geri</span>
        </button>

        {/* Hero Title & Subtext */}
        <div className="absolute bottom-6 left-6 right-6 text-white">
          <div className="flex flex-wrap items-center gap-2 mb-2 text-xs font-medium text-gray-200">
            <span className="bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
              Fiyat: {priceIndicator}
            </span>
            <span className="bg-white/20 backdrop-blur-sm px-2.5 py-0.5 rounded-full">
              ⏱️ Ziyaret Süresi: {place.estimated_visit_minutes} dk
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight leading-tight drop-shadow-md">
            {place.name}
          </h1>
        </div>
      </div>

      {/* Main Grid: Details & Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column (2 spans): Description & Facts */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-100 shadow-sm space-y-4">
            <h2 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <span>📖</span>
              <span>Mekan Hakkında</span>
            </h2>
            <p className="text-sm text-gray-600 leading-relaxed">
              {place.description}
            </p>
          </div>

          <div className="bg-white p-6 sm:p-7 rounded-3xl border border-gray-100 shadow-sm">
            <h2 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <span>ℹ️</span>
              <span>Ziyaret ve Konum Bilgileri</span>
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Ziyaret Saatleri
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {place.opening_hours}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Ortalama Süre
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {place.estimated_visit_minutes} dakika
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 sm:col-span-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Adres
                </p>
                <p className="text-sm font-semibold text-gray-800">
                  {place.address}
                </p>
              </div>

              <div className="bg-gray-50 p-4 rounded-2xl border border-gray-100 sm:col-span-2">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">
                  Harita Koordinatları
                </p>
                <p className="text-sm font-mono text-gray-700">
                  Enlem: {place.latitude.toFixed(6)} | Boylam:{" "}
                  {place.longitude.toFixed(6)}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column (1 span): Floating Action Card */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-md sticky top-24 space-y-5">
            <div className="text-center pb-3 border-b border-gray-100">
              <span className="text-3xl mb-2 inline-block">🎒</span>
              <h3 className="text-base font-bold text-gray-900">
                Rotanıza Ekleyin
              </h3>
              <p className="text-xs text-gray-500 mt-1">
                Bu mekanı gezi listenize ekleyin ve rotanızı kişiselleştirin.
              </p>
            </div>

            <button
              type="button"
              onClick={() => setIsAddModalOpen(true)}
              className="w-full py-3.5 px-4 bg-sky-600 hover:bg-sky-700 active:bg-sky-800 text-white text-sm font-bold rounded-2xl transition-all shadow-md hover:shadow-lg flex items-center justify-center gap-2"
            >
              <span>+</span>
              <span>Rotaya Ekle</span>
            </button>

            <Link
              href="/"
              className="w-full py-3 px-4 bg-gray-50 hover:bg-gray-100 text-gray-700 text-xs font-semibold rounded-2xl transition-colors text-center block border border-gray-200"
            >
              Diğer Mekanları Keşfet
            </Link>
          </div>
        </div>
      </div>

      {/* Add To Trip Modal */}
      <AddToTripModal
        place={place}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />
    </main>
  );
}
