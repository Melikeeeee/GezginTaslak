"use client";

import React, { useState } from "react";
import type { GeneratedItinerary } from "@gezgin/validation";
import { createTrip } from "@gezgin/supabase-queries";
import { useAuth } from "@/context/auth-context";

interface RoutePlanModalProps {
  isOpen: boolean;
  onClose: () => void;
  itinerary: GeneratedItinerary | null;
}

export function RoutePlanModal({
  isOpen,
  onClose,
  itinerary,
}: RoutePlanModalProps) {
  const { user, supabase } = useAuth();
  const [selectedDay, setSelectedDay] = useState<number>(1);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  if (!isOpen || !itinerary) return null;

  const currentDay =
    itinerary.days.find((d) => d.dayNumber === selectedDay) ||
    itinerary.days[0];

  const handleSaveTrip = async () => {
    if (!user || !supabase) {
      setSaveError("Rotayı kaydetmek için lütfen önce giriş yapın.");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    try {
      const destinationId = "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d";
      const todayStr = new Date().toISOString().split("T")[0];

      await createTrip(supabase as any, user.id, {
        destinationId,
        title: itinerary.title,
        tripType: itinerary.days.length > 1 ? "multi_day" : "day_trip",
        startDate: todayStr,
        endDate: todayStr,
        pace: itinerary.pace,
        budgetLevel: itinerary.budget,
        notes: itinerary.summary,
      });

      setSaveSuccess(true);
      setTimeout(() => {
        setSaveSuccess(false);
      }, 4000);
    } catch (err) {
      setSaveError(
        err instanceof Error ? err.message : "Rota kaydedilirken hata oluştu.",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "historical":
        return "🏛️";
      case "restaurant":
      case "cafe":
        return "🍴";
      case "nature":
        return "🏔️";
      case "viewpoint":
        return "🌊";
      case "shopping":
        return "🛍️";
      default:
        return "📍";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="bg-white w-full max-w-2xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col overflow-hidden border border-gray-100 animate-slideUp">
        {/* Modal Header */}
        <div className="p-6 pb-4 border-b border-gray-100 flex items-start justify-between bg-gradient-to-r from-sky-50/50 to-blue-50/50">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-[#0047ba] text-white">
                AI Akıllı Rota
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-sky-100 text-sky-800">
                {itinerary.pace === "relaxed"
                  ? "Sakin Tempo"
                  : itinerary.pace === "balanced"
                    ? "Dengeli Tempo"
                    : "Yoğun Tempo"}
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
                {itinerary.totalDurationHours} Saatlik Plan
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 leading-tight">
              {itinerary.title}
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 mt-1">
              {itinerary.summary}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white border border-gray-200 text-gray-400 hover:text-gray-700 hover:bg-gray-50 flex items-center justify-center text-lg font-bold transition-colors ml-4 flex-shrink-0"
          >
            ✕
          </button>
        </div>

        {/* Day Tabs (if multi-day) */}
        {itinerary.days.length > 1 && (
          <div className="flex border-b border-gray-100 px-6 pt-2 bg-gray-50/60 overflow-x-auto gap-2">
            {itinerary.days.map((d) => (
              <button
                key={d.dayNumber}
                type="button"
                onClick={() => setSelectedDay(d.dayNumber)}
                className={`pb-2.5 px-3 text-sm font-semibold border-b-2 transition-colors whitespace-nowrap ${
                  selectedDay === d.dayNumber
                    ? "border-[#0047ba] text-[#0047ba]"
                    : "border-transparent text-gray-500 hover:text-gray-800"
                }`}
              >
                {d.dayNumber}. Gün
              </button>
            ))}
          </div>
        )}

        {/* Timeline Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold text-center">
              ✓ Rota başarıyla seyahatlerinize kaydedildi!
            </div>
          )}

          {saveError && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-800 text-xs font-semibold text-center">
              ⚠️ {saveError}
            </div>
          )}

          <div className="relative pl-6 border-l-2 border-sky-200 space-y-6">
            {currentDay?.stops.map((stop, idx) => (
              <div key={idx} className="relative group">
                {/* Timeline node badge */}
                <div className="absolute -left-[35px] top-0 w-8 h-8 rounded-full bg-white border-2 border-[#0047ba] flex items-center justify-center text-sm shadow-sm group-hover:scale-110 transition-transform">
                  {getCategoryIcon(stop.category)}
                </div>

                <div className="bg-gray-50/80 border border-gray-200/80 rounded-2xl p-4 hover:border-sky-300 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="text-xs font-bold text-[#0047ba] bg-sky-100/70 px-2 py-0.5 rounded-md">
                      🕒 {stop.timeSlot}
                    </span>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-gray-500">
                        ⏳ {stop.durationMinutes} dk
                      </span>
                      {stop.estimatedCost && (
                        <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md">
                          {stop.estimatedCost}
                        </span>
                      )}
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-gray-900 mt-1">
                    {stop.name}
                  </h4>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 leading-relaxed">
                    {stop.description}
                  </p>

                  {stop.tip && (
                    <div className="mt-2.5 p-2.5 rounded-xl bg-amber-50/70 border border-amber-200/70 flex items-start gap-2">
                      <span className="text-sm">💡</span>
                      <p className="text-xs text-amber-900 leading-snug">
                        <strong className="font-semibold">Öneri:</strong> {stop.tip}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 px-6 border-t border-gray-100 bg-gray-50/50 flex items-center justify-between gap-3">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl border border-gray-200 bg-white text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors"
          >
            Kapat
          </button>

          <button
            type="button"
            onClick={handleSaveTrip}
            disabled={isSaving || saveSuccess}
            className="px-6 py-2.5 rounded-xl bg-[#0047ba] hover:bg-[#003896] text-white font-bold text-sm flex items-center gap-2 shadow-md transition-all disabled:opacity-60"
          >
            {isSaving ? (
              <span>Kaydediliyor...</span>
            ) : saveSuccess ? (
              <span>Kaydedildi ✓</span>
            ) : (
              <>
                <span>Rotayı Kaydet</span>
                <span>💾</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
