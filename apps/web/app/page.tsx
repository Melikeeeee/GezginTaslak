"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import type { GeneratedItinerary } from "@gezgin/validation";
import type { Place, PlaceCategory } from "@gezgin/types";
import { ALL_PLACES, SEED_DESTINATIONS } from "@gezgin/supabase-queries";
import { useAuth } from "@/context/auth-context";
import { WindingRouteVisual } from "@/components/WindingRouteVisual";
import { RoutePlanModal } from "@/components/RoutePlanModal";
import { PlaceCard } from "@/components/PlaceCard";
import { PlaceDetailModal } from "@/components/PlaceDetailModal";
import { AddToTripModal } from "@/components/AddToTripModal";
import { SocialFeed } from "@/components/SocialFeed";
import { SharePostModal } from "@/components/SharePostModal";

export default function HomePage() {
  const { user, profile } = useAuth();

  // Navigation tab state: 'flow' (Social Feed stream) vs 'rota' (Route Planning & Discovery)
  const [activeTab, setActiveTab] = useState<"flow" | "rota">("flow");
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      const tabParam = params.get("tab");
      if (tabParam === "rota" || tabParam === "flow") {
        setActiveTab(tabParam);
      }

      const handler = (e: any) => {
        if (e.detail === "flow" || e.detail === "rota") {
          setActiveTab(e.detail);
        }
      };
      window.addEventListener("gezgin:switch-tab" as any, handler);
      return () => {
        window.removeEventListener("gezgin:switch-tab" as any, handler);
      };
    }
  }, []);

  // Search state
  const [searchQuery, setSearchQuery] = useState("");

  // Planning form state
  const [guestCount, setGuestCount] = useState<number>(2);
  const [budgetMin, setBudgetMin] = useState<number>(1500);
  const [budgetMax, setBudgetMax] = useState<number>(8500);
  const [accommodationType, setAccommodationType] = useState<string>("Otel");
  const [selectedTag, setSelectedTag] = useState<string>("Ekonomik");
  const [planGenerated, setPlanGenerated] = useState<boolean>(false);

  // AI Route planning state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedItinerary, setGeneratedItinerary] =
    useState<GeneratedItinerary | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [generationError, setGenerationError] = useState<string | null>(null);

  // Place Discovery state
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | "all">("all");
  const [selectedPlaceForDetail, setSelectedPlaceForDetail] = useState<Place | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState<boolean>(false);
  const [selectedPlaceForAdd, setSelectedPlaceForAdd] = useState<Place | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);

  const categoriesList: { id: PlaceCategory | "all"; label: string; icon: string }[] = [
    { id: "all", label: "Tümü", icon: "✨" },
    { id: "historical", label: "Tarihi", icon: "🏛️" },
    { id: "museum", label: "Müzeler", icon: "🎨" },
    { id: "restaurant", label: "Restoranlar", icon: "🍽️" },
    { id: "cafe", label: "Kafeler", icon: "☕" },
    { id: "nature", label: "Doğa & Manzara", icon: "🌳" },
    { id: "shopping", label: "Alışveriş", icon: "🛍️" },
  ];

  const filteredPlaces = ALL_PLACES.filter((place) => {
    const matchesCategory =
      selectedCategory === "all" ||
      place.category === selectedCategory ||
      (selectedCategory === "nature" && place.category === "viewpoint");

    const matchesCity =
      selectedCity === "all" || place.destination_id === selectedCity;

    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      place.name.toLowerCase().includes(q) ||
      place.description.toLowerCase().includes(q) ||
      place.address.toLowerCase().includes(q);
    return matchesCategory && matchesCity && matchesQuery;
  });

  const tags = ["Ekonomik", "Lüks", "Merkezi"];

  const handleRouteCreate = async () => {
    setIsGenerating(true);
    setGenerationError(null);
    try {
      const budgetMapping: "low" | "medium" | "high" =
        selectedTag === "Ekonomik"
          ? "low"
          : selectedTag === "Lüks"
            ? "high"
            : "medium";

      const activeCityObj =
        selectedCity !== "all"
          ? SEED_DESTINATIONS.find((d) => d.id === selectedCity)
          : null;
      const targetDestination =
        searchQuery.trim() || activeCityObj?.name || "Türkiye";

      const res = await fetch("/api/route-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          destination: targetDestination,
          categories: ["historical", "restaurant", "nature"],
          pace: "balanced",
          budget: budgetMapping,
          daysCount: 1,
          guestCount: guestCount || 2,
        }),
      });

      if (!res.ok) {
        throw new Error("Rota planı oluşturulamadı.");
      }

      const data: GeneratedItinerary = await res.json();
      setGeneratedItinerary(data);
      setIsModalOpen(true);
    } catch (err) {
      setGenerationError(
        err instanceof Error ? err.message : "Rota oluşturulurken hata oluştu.",
      );
    } finally {
      setIsGenerating(false);
    }
  };

  const handlePlanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPlanGenerated(true);
    setTimeout(() => setPlanGenerated(false), 3500);
  };

  const avatarInitial = (
    profile?.display_name ||
    user?.email ||
    "G"
  )[0].toUpperCase();

  return (
    <main className="w-full max-w-5xl mx-auto px-4 sm:px-6 pt-6 pb-12">
      {/* Top Header: "Nereyi keşfetmek istiyorsun?" & User Profile Avatar */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight leading-tight">
            Nereyi keşfetmek
            <br />
            istiyorsun?
          </h1>
        </div>

        <Link
          href="/profile"
          className="group relative flex items-center justify-center"
          title={user ? "Profilini Görüntüle" : "Giriş Yap"}
        >
          <div className="w-12 h-12 sm:w-14 sm:h-14 rounded-full overflow-hidden border-2 border-white shadow-md bg-gradient-to-tr from-sky-600 to-[#0047ba] flex items-center justify-center transition-transform transform group-hover:scale-105">
            {profile?.avatar_url ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={profile.avatar_url}
                alt="Profile Avatar"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-white font-bold text-lg sm:text-xl">
                {avatarInitial}
              </span>
            )}
          </div>
          <span className="sr-only">Profil</span>
        </Link>
      </div>

      {/* Center Search Bar */}
      <div className="w-full max-w-4xl mx-auto mb-8">
        <div className="relative flex items-center w-full bg-white border border-gray-200/90 rounded-full px-5 py-3.5 shadow-sm hover:shadow-md focus-within:ring-2 focus-within:ring-[#0047ba] focus-within:border-[#0047ba] transition-all">
          <span className="text-gray-400 text-lg mr-3 select-none">🔍</span>
          <input
            type="text"
            placeholder="Eskişehir veya bir şehir/yer ara..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent text-gray-800 placeholder-gray-400 font-medium text-base outline-none"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="text-gray-400 hover:text-gray-600 text-sm font-semibold px-2"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* ========================================================================= */}
      {/* 1. SOCIAL MEDIA FEED (FLOW) */}
      {/* ========================================================================= */}
      {activeTab === "flow" && (
        <section id="flow" className="w-full">
          <SocialFeed onOpenShareModal={() => setIsShareModalOpen(true)} />
        </section>
      )}

      {/* ========================================================================= */}
      {/* 2. ROUTE PLANNING & PLACE DISCOVERY */}
      {/* ========================================================================= */}
      {activeTab === "rota" && (
        <>
          {/* Main Content: Split Cards (Side-by-Side on Web, Stacked on Mobile) */}
          <div id="rota" className="grid grid-cols-1 md:grid-cols-2 gap-6 items-stretch">
        {/* Left Card: "Rota Çiz" */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <div>
            <div className="text-center mb-4">
              <h2 className="text-2xl font-bold text-[#0047ba] tracking-tight">
                Rota Çiz
              </h2>
              <p className="text-xs sm:text-sm text-gray-500 font-medium mt-1">
                Popüler Yerler, Gezilecek ve Yenecek Noktalar
              </p>
            </div>

            {/* Winding road visualization with category nodes */}
            <WindingRouteVisual />

            {generationError && (
              <div className="mt-3 p-2.5 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold text-center">
                ⚠️ {generationError}
              </div>
            )}
          </div>

          <button
            type="button"
            onClick={handleRouteCreate}
            disabled={isGenerating}
            className="w-full mt-5 py-3.5 px-6 rounded-2xl bg-[#0047ba] hover:bg-[#003896] active:bg-[#002f80] text-white font-bold text-base flex items-center justify-center gap-2 shadow-md shadow-blue-900/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-60"
          >
            {isGenerating ? (
              <>
                <span className="spinner" />
                <span>AI Rotası Hazırlanıyor... ✨</span>
              </>
            ) : (
              <>
                <span>Rotayı Oluştur</span>
                <span className="text-lg">➔</span>
              </>
            )}
          </button>
        </section>

        {/* Right Card: "Ulaşım ve Konaklama Planla" */}
        <section className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col justify-between hover:shadow-md transition-shadow">
          <form onSubmit={handlePlanSubmit} className="flex flex-col justify-between h-full">
            <div>
              {/* Card Header with Icons */}
              <div className="text-center mb-6">
                <div className="flex items-center justify-center gap-3 text-[#0047ba] mb-1">
                  {/* House Icon */}
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M10 20v-6h4v6h5v-8h3L12 3 2 12h3v8z" />
                  </svg>
                  {/* Airplane Icon */}
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M21 16v-2l-8-5V3.5c0-.83-.67-1.5-1.5-1.5S10 2.67 10 3.5V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
                  </svg>
                </div>
                <h2 className="text-xl sm:text-2xl font-bold text-[#0047ba] tracking-tight">
                  Ulaşım ve Konaklama Planla
                </h2>
              </div>

              {/* Form Controls */}
              <div className="space-y-5">
                {/* 1. Kişi Sayısı */}
                <div className="flex items-center justify-between">
                  <label htmlFor="guest-count" className="text-sm font-semibold text-gray-800">
                    Kişi Sayısı
                  </label>
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => setGuestCount((prev) => Math.max(1, prev - 1))}
                      className="w-7 h-7 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold text-sm"
                    >
                      -
                    </button>
                    <input
                      id="guest-count"
                      type="number"
                      min={1}
                      max={20}
                      value={guestCount}
                      onChange={(e) => setGuestCount(Math.max(1, Number(e.target.value) || 1))}
                      className="w-12 text-center py-1 border border-gray-200 rounded-md font-semibold text-gray-800 text-sm focus:border-[#0047ba] focus:ring-1 focus:ring-[#0047ba] outline-none"
                    />
                    <button
                      type="button"
                      onClick={() => setGuestCount((prev) => prev + 1)}
                      className="w-7 h-7 rounded-md border border-gray-200 text-gray-600 hover:bg-gray-100 flex items-center justify-center font-bold text-sm"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* 2. Bütçe Aralığı Slider */}
                <div>
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-sm font-semibold text-gray-800">Bütçe Aralığı</span>
                    <span className="text-xs font-semibold text-[#0047ba]">
                      ₺{budgetMin.toLocaleString("tr-TR")} - ₺{budgetMax.toLocaleString("tr-TR")}
                    </span>
                  </div>
                  {/* Slider with styled range track */}
                  <div className="relative py-2">
                    <div className="h-2 bg-sky-100 rounded-full relative">
                      <div
                        className="absolute h-2 bg-[#0047ba] rounded-full"
                        style={{
                          left: `${(budgetMin / 20000) * 100}%`,
                          right: `${100 - (budgetMax / 20000) * 100}%`,
                        }}
                      />
                    </div>
                    {/* Range input for min */}
                    <input
                      type="range"
                      min={500}
                      max={20000}
                      step={500}
                      value={budgetMax}
                      onChange={(e) => setBudgetMax(Number(e.target.value))}
                      className="w-full accent-[#0047ba] cursor-pointer mt-1"
                    />
                  </div>
                </div>

                {/* 3. Aranılan Tür (Dropdown) */}
                <div>
                  <label htmlFor="accommodation-type" className="block text-sm font-semibold text-gray-800 mb-1.5">
                    Aranılan Tür
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-500">
                      {/* Car / Hotel icon */}
                      <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M18.92 6.01C18.72 5.42 18.16 5 17.5 5h-11c-.66 0-1.22.42-1.42 1.01L3 12v8c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-1h12v1c0 .55.45 1 1 1h1c.55 0 1-.45 1-1v-8l-2.08-5.99zM6.85 7h10.29l1.04 3H5.81l1.04-3zM19 17H5v-4.66l.12-.34h13.77l.11.34V17z" />
                        <circle cx="7.5" cy="14.5" r="1.5" />
                        <circle cx="16.5" cy="14.5" r="1.5" />
                      </svg>
                    </div>
                    <select
                      id="accommodation-type"
                      value={accommodationType}
                      onChange={(e) => setAccommodationType(e.target.value)}
                      className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium text-gray-800 focus:outline-none focus:ring-1 focus:ring-[#0047ba] focus:border-[#0047ba] appearance-none cursor-pointer"
                    >
                      <option value="Otel">Otel</option>
                      <option value="Pansiyon & Butik">Pansiyon & Butik</option>
                      <option value="Apart Daire">Apart Daire</option>
                      <option value="Ulaşım & Transfer">Ulaşım & Transfer</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M19 9l-7 7-7-7" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* 4. Hızlı Etiketler */}
                <div>
                  <span className="block text-sm font-semibold text-gray-800 mb-2">
                    Hızlı Etiketler
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => {
                      const isActive = selectedTag === tag;
                      return (
                        <button
                          key={tag}
                          type="button"
                          onClick={() => setSelectedTag(tag)}
                          className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                            isActive
                              ? "bg-[#0047ba] text-white shadow-sm"
                              : "border border-gray-200 text-gray-600 hover:border-gray-300 bg-white"
                          }`}
                        >
                          {tag}
                        </button>
                      );
                    })}
                  </div>
                </div>
              </div>

              {planGenerated && (
                <div className="mt-4 p-2.5 rounded-xl bg-blue-50 border border-blue-200 text-[#0047ba] text-xs font-semibold text-center animate-fadeIn">
                  ✓ Plan güncellendi: {guestCount} kişi için {accommodationType} ({selectedTag}) seçenekleri filtrelendi.
                </div>
              )}
            </div>

            <button
              type="submit"
              className="w-full mt-6 py-3.5 px-6 rounded-2xl bg-[#0047ba] hover:bg-[#003896] active:bg-[#002f80] text-white font-bold text-base flex items-center justify-center gap-2 shadow-md shadow-blue-900/10 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Planı Gör</span>
              <span className="text-lg">✓</span>
            </button>
          </form>
        </section>
      </div>

      {/* ========================================================================= */}
      {/* PLACE & DESTINATION DISCOVERY SECTION */}
      {/* ========================================================================= */}
      <section id="kesfet" className="mt-16 pt-8 border-t border-gray-100">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-6 gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-50 border border-sky-100 text-sky-700 text-xs font-bold mb-2">
              <span>🧭</span>
              <span>Popüler Şehir & Gezi Rehberi</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Öne Çıkan Gezi Noktaları
            </h2>
            <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl leading-relaxed">
              Farklı şehirlerin tarihi yarımadalarından doğa harikalarına, saraylardan lezzet duraklarına özenle seçilmiş ikonik mekanlar.
            </p>
          </div>

          <div className="text-xs font-semibold text-gray-500 bg-white px-3.5 py-1.5 rounded-full border border-gray-200 self-start md:self-auto shadow-sm">
            Toplam <span className="text-sky-600 font-bold">{filteredPlaces.length}</span> mekan listeleniyor
          </div>
        </div>

        {/* City Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none mb-3">
          <button
            type="button"
            onClick={() => setSelectedCity("all")}
            className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
              selectedCity === "all"
                ? "bg-gray-900 text-white shadow-sm"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Tüm Şehirler
          </button>
          {SEED_DESTINATIONS.map((dest) => {
            const isSelected = selectedCity === dest.id;
            return (
              <button
                key={dest.id}
                type="button"
                onClick={() => setSelectedCity(dest.id)}
                className={`flex-shrink-0 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all ${
                  isSelected
                    ? "bg-[#0047ba] text-white shadow-sm"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {dest.name}
              </button>
            );
          })}
        </div>

        {/* Category Filters Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
          {categoriesList.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
                  isSelected
                    ? "bg-[#0047ba] text-white shadow-blue-900/20 scale-105"
                    : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
                }`}
              >
                <span>{cat.icon}</span>
                <span>{cat.label}</span>
              </button>
            );
          })}
        </div>

        {/* Places Grid */}
        {filteredPlaces.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-sm max-w-md mx-auto my-8">
            <span className="text-4xl block mb-3">🔍</span>
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Aradığınız Kriterlere Uygun Mekan Bulunamadı
            </h3>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              Farklı bir arama terimi veya kategori seçerek tekrar deneyebilirsiniz.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("all");
              }}
              className="py-2.5 px-5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              Filtreleri Temizle
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredPlaces.map((place) => (
              <PlaceCard
                key={place.id}
                place={place}
                onSelect={(p) => {
                  setSelectedPlaceForDetail(p);
                  setIsDetailModalOpen(true);
                }}
                onAddToTrip={(p) => {
                  setSelectedPlaceForAdd(p);
                  setIsAddModalOpen(true);
                }}
              />
            ))}
          </div>
        )}
      </section>
        </>
      )}

      {/* Modals */}
      <PlaceDetailModal
        place={selectedPlaceForDetail}
        isOpen={isDetailModalOpen}
        onClose={() => setIsDetailModalOpen(false)}
        onAddToTrip={(p) => {
          setSelectedPlaceForAdd(p);
          setIsAddModalOpen(true);
        }}
      />

      <AddToTripModal
        place={selectedPlaceForAdd}
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
      />

      {/* AI Route Plan Modal */}
      <RoutePlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itinerary={generatedItinerary}
      />

      {/* Share Post Modal */}
      <SharePostModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
      />
    </main>
  );
}
