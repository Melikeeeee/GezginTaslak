/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import type { Place } from "@gezgin/types";
import { useAuth } from "@/context/auth-context";

interface AddToTripModalProps {
  place: Place | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AddToTripModal({ place, isOpen, onClose }: AddToTripModalProps) {
  const { user } = useAuth();
  const [tripName, setTripName] = useState("İstanbul Gezim");
  const [selectedDay, setSelectedDay] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setSuccessMessage(null);
    }
  }, [isOpen]);

  if (!isOpen || !place) return null;

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Simulate saving stop or persisting to active trip
    setTimeout(() => {
      setIsSubmitting(false);
      setSuccessMessage(`"${place.name}" başarıyla ${selectedDay}. Güne eklendi! 🎉`);
      setTimeout(() => {
        onClose();
        setSuccessMessage(null);
      }, 2000);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-6 z-10 animate-in fade-in zoom-in-95 duration-200">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <span className="text-xl">🗺️</span>
            <h3 className="text-lg font-bold text-gray-900">Rotaya Ekle</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors text-lg"
          >
            ✕
          </button>
        </div>

        {/* Selected Place Mini Card */}
        <div className="mt-4 flex items-center gap-3 bg-sky-50/70 p-3 rounded-2xl border border-sky-100">
          <img
            src={place.image_url}
            alt={place.name}
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div className="flex-1 min-w-0">
            <h4 className="text-xs font-bold text-gray-900 truncate">
              {place.name}
            </h4>
            <p className="text-[11px] text-gray-500">
              ⏱️ {place.estimated_visit_minutes} dk · ⭐ {place.rating.toFixed(1)}
            </p>
          </div>
        </div>

        {!user ? (
          <div className="mt-5 text-center py-4">
            <p className="text-xs text-gray-600 mb-4 leading-relaxed">
              Mekanları kişisel gezi rotalarınıza kaydedebilmek için giriş yapmalısınız.
            </p>
            <div className="flex items-center justify-center gap-3">
              <Link
                href="/login"
                className="py-2.5 px-5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 rounded-xl transition-colors shadow-sm"
              >
                Giriş Yap
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                Vazgeç
              </button>
            </div>
          </div>
        ) : successMessage ? (
          <div className="mt-5 text-center py-6">
            <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto text-xl mb-2 animate-bounce">
              ✓
            </div>
            <p className="text-sm font-bold text-emerald-800">{successMessage}</p>
          </div>
        ) : (
          <form onSubmit={handleAdd} className="mt-4 space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Rota Adı
              </label>
              <input
                type="text"
                value={tripName}
                onChange={(e) => setTripName(e.target.value)}
                required
                className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-gray-200 focus:outline-none focus:border-sky-500 focus:ring-1 focus:ring-sky-500 transition-all bg-gray-50/50"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">
                Gezilecek Gün
              </label>
              <div className="flex gap-2">
                {[1, 2, 3, 4].map((day) => (
                  <button
                    key={day}
                    type="button"
                    onClick={() => setSelectedDay(day)}
                    className={`flex-1 py-2 text-xs font-bold rounded-xl border transition-all ${
                      selectedDay === day
                        ? "bg-sky-600 text-white border-sky-600 shadow-sm"
                        : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-gray-100"
                    }`}
                  >
                    {day}. Gün
                  </button>
                ))}
              </div>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={onClose}
                className="py-2.5 px-4 text-xs font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 rounded-xl transition-colors"
              >
                İptal
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="py-2.5 px-5 text-xs font-bold text-white bg-sky-600 hover:bg-sky-700 active:bg-sky-800 rounded-xl transition-all shadow-md hover:shadow-lg disabled:opacity-50 flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Ekleniyor...</span>
                  </>
                ) : (
                  <>
                    <span>Kaydet</span>
                    <span>✓</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
