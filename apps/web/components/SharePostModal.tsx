"use client";

import React, { useState } from "react";
import type { Post } from "@gezgin/types";
import { SEED_DESTINATIONS } from "@gezgin/supabase-queries";
import { useAuth } from "@/context/auth-context";

interface SharePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated?: (post: Post) => void;
}

export function SharePostModal({
  isOpen,
  onClose,
  onPostCreated,
}: SharePostModalProps) {
  const { user, profile } = useAuth();
  const [selectedDestId, setSelectedDestId] = useState<string>(
    SEED_DESTINATIONS[0].id
  );
  const [locationName, setLocationName] = useState<string>("");
  const [caption, setCaption] = useState<string>("");
  const [imageUrl, setImageUrl] = useState<string>("");
  const [showImageInput, setShowImageInput] = useState<boolean>(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!caption.trim()) {
      return;
    }

    const selectedDest = SEED_DESTINATIONS.find((d) => d.id === selectedDestId);

    const newPost: Post = {
      id: `post-${Date.now()}`,
      user_id: user?.id || "guest",
      author_name: profile?.display_name || user?.email?.split("@")[0] || "Gezgin",
      author_username: profile?.username || "gezgin",
      author_avatar: profile?.avatar_url || undefined,
      destination_id: selectedDestId,
      destination_name: selectedDest?.name || "Türkiye",
      location_name: locationName.trim() || selectedDest?.name || "Türkiye",
      caption: caption.trim(),
      image_url: imageUrl.trim() || undefined,
      likes_count: 0,
      comments_count: 0,
      is_liked: false,
      comments: [],
      created_at: "Şimdi",
    };

    if (onPostCreated) {
      onPostCreated(newPost);
    }

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("gezgin:post-created", { detail: newPost })
      );
    }

    setCaption("");
    setLocationName("");
    setImageUrl("");
    setShowImageInput(false);
    onClose();
  };

  const authorInitial = (
    profile?.display_name ||
    user?.email ||
    "G"
  )[0].toUpperCase();

  return (
    <div
      className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-lg rounded-2xl shadow-2xl border border-gray-100 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">
            Yeni Paylaşım
          </h3>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-gray-100 text-gray-400 hover:text-gray-600 flex items-center justify-center text-sm transition-colors"
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {/* Author & City Selector Row */}
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-sky-600 to-[#0047ba] text-white font-bold flex items-center justify-center text-xs overflow-hidden">
                {profile?.avatar_url ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={profile.avatar_url}
                    alt="Profil"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  authorInitial
                )}
              </div>
              <div>
                <p className="text-xs font-bold text-gray-900">
                  {profile?.display_name || user?.email?.split("@")[0] || "Gezgin"}
                </p>
                <p className="text-[11px] text-gray-400">Herkese açık</p>
              </div>
            </div>

            {/* City Dropdown */}
            <select
              value={selectedDestId}
              onChange={(e) => setSelectedDestId(e.target.value)}
              className="text-xs font-semibold bg-gray-50 border border-gray-200 text-gray-700 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-[#0047ba]"
            >
              {SEED_DESTINATIONS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Caption Textarea */}
          <textarea
            rows={4}
            value={caption}
            onChange={(e) => setCaption(e.target.value)}
            placeholder="Nereyi gezdin? Tavsiyelerini ve seyahat notlarını yaz..."
            className="w-full text-sm text-gray-800 placeholder-gray-400 border border-gray-200 rounded-xl p-3.5 focus:outline-none focus:border-[#0047ba] focus:ring-1 focus:ring-[#0047ba] resize-none"
            autoFocus
          />

          {/* Location / Place Tag */}
          <input
            type="text"
            placeholder="Konum veya mekan ekle (örn. Sultanahmet, Odunpazarı)"
            value={locationName}
            onChange={(e) => setLocationName(e.target.value)}
            className="w-full px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:border-[#0047ba]"
          />

          {/* Photo Attachment */}
          {imageUrl ? (
            <div className="relative rounded-xl overflow-hidden max-h-48 border border-gray-200 bg-gray-50">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={imageUrl}
                alt="Fotoğraf"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setImageUrl("");
                  setShowImageInput(false);
                }}
                className="absolute top-2 right-2 px-2 py-1 bg-black/70 hover:bg-black text-white text-[11px] font-semibold rounded-md transition-colors"
              >
                Kaldır
              </button>
            </div>
          ) : showImageInput ? (
            <div className="flex items-center gap-2">
              <input
                type="url"
                placeholder="Görsel bağlantısı (https://...)"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                className="flex-1 px-3 py-2 text-xs bg-gray-50 border border-gray-200 rounded-lg text-gray-800 focus:outline-none focus:border-[#0047ba]"
              />
              <button
                type="button"
                onClick={() => setShowImageInput(false)}
                className="text-xs text-gray-500 hover:text-gray-700 px-2 py-1"
              >
                İptal
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowImageInput(true)}
              className="self-start text-xs font-semibold text-[#0047ba] hover:text-[#003896] flex items-center gap-1.5 py-1"
            >
              <span>+ Fotoğraf linki ekle</span>
            </button>
          )}

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-2 pt-2 border-t border-gray-100">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-gray-600 hover:text-gray-800 rounded-lg transition-colors"
            >
              Vazgeç
            </button>
            <button
              type="submit"
              disabled={!caption.trim()}
              className="px-5 py-2 text-xs font-bold text-white bg-[#0047ba] hover:bg-[#003896] active:bg-[#002f80] rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Paylaş
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
