/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState } from "react";
import Link from "next/link";
import type { Post } from "@gezgin/types";
import { SEED_DESTINATIONS, SEED_POSTS } from "@gezgin/supabase-queries";
import { useAuth } from "@/context/auth-context";
import { SharePostModal } from "@/components/SharePostModal";

export default function CommunityPage() {
  const { user } = useAuth();
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});

  const filteredPosts = posts.filter((p) => {
    if (selectedCity === "all") return true;
    return p.destination_id === selectedCity;
  });

  const handleToggleLike = (postId: string) => {
    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const isLiked = !post.is_liked;
          return {
            ...post,
            is_liked: isLiked,
            likes_count: isLiked ? post.likes_count + 1 : Math.max(0, post.likes_count - 1),
          };
        }
        return post;
      })
    );
  };

  const handleToggleComments = (postId: string) => {
    setExpandedComments((prev) => ({
      ...prev,
      [postId]: !prev[postId],
    }));
  };

  const handleAddComment = (postId: string) => {
    const text = commentInputs[postId]?.trim();
    if (!text) return;

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const newComment = {
            id: `c-${Date.now()}`,
            post_id: postId,
            user_id: user?.id || "u-guest",
            author_name: user?.email?.split("@")[0] || "Ben",
            content: text,
            created_at: "Şimdi",
          };
          return {
            ...post,
            comments_count: post.comments_count + 1,
            comments: [...(post.comments || []), newComment],
          };
        }
        return post;
      })
    );

    setCommentInputs((prev) => ({ ...prev, [postId]: "" }));
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <main className="w-full max-w-4xl mx-auto px-4 sm:px-6 pt-6 pb-24">
      {/* Top Banner & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-[#0047ba] text-xs font-bold mb-2">
            <span>🧭</span>
            <span>Gezgin Sosyal Topluluğu</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Seyahat Akışı & Topluluk
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-1 max-w-xl">
            Farklı şehirlerden gezginlerin paylaştığı anılar, fotoğraflar ve denenmiş gezi tavsiyeleri.
          </p>
        </div>

        <button
          type="button"
          onClick={() => setIsShareModalOpen(true)}
          className="self-start sm:self-auto py-3 px-5 rounded-2xl bg-[#0047ba] hover:bg-[#003896] text-white font-bold text-xs flex items-center gap-2 shadow-md shadow-blue-900/10 transition-transform hover:-translate-y-0.5 active:translate-y-0"
        >
          <span>📸</span>
          <span>Yeni Paylaşım Yap</span>
        </button>
      </div>

      {/* City Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
        <button
          type="button"
          onClick={() => setSelectedCity("all")}
          className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
            selectedCity === "all"
              ? "bg-[#0047ba] text-white"
              : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
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
              className={`flex-shrink-0 px-4 py-2 rounded-full text-xs font-bold transition-all shadow-sm ${
                isSelected
                  ? "bg-[#0047ba] text-white"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {dest.name}
            </button>
          );
        })}
      </div>

      {/* Feed List */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-3xl p-10 text-center border border-gray-100 shadow-sm max-w-md mx-auto my-8">
            <span className="text-4xl block mb-3">📸</span>
            <h3 className="text-base font-bold text-gray-900 mb-1">
              Bu Şehir İçin Henüz Paylaşım Yok
            </h3>
            <p className="text-xs text-gray-500 mb-5 leading-relaxed">
              İlk paylaşımı yaparak seyahat deneyimini diğer gezginlerle paylaşabilirsin!
            </p>
            <button
              type="button"
              onClick={() => setIsShareModalOpen(true)}
              className="py-2.5 px-5 bg-[#0047ba] hover:bg-[#003896] text-white text-xs font-bold rounded-xl transition-colors shadow-sm"
            >
              İlk Paylaşımı Sen Yap
            </button>
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isCommentsOpen = !!expandedComments[post.id];
            return (
              <article
                key={post.id}
                className="bg-white rounded-3xl p-6 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
              >
                {/* Author Info */}
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                      {post.author_avatar ? (
                        <img
                          src={post.author_avatar}
                          alt={post.author_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-sm font-bold text-[#0047ba]">
                          {post.author_name[0].toUpperCase()}
                        </span>
                      )}
                    </div>
                    <div>
                      <h4 className="text-sm font-extrabold text-gray-900 leading-tight">
                        {post.author_name}
                      </h4>
                      <div className="flex items-center gap-1.5 text-xs text-gray-400">
                        <span>@{post.author_username}</span>
                        <span>•</span>
                        <span>{post.created_at}</span>
                      </div>
                    </div>
                  </div>

                  <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-gray-100 text-gray-700 text-xs font-semibold">
                    📍 {post.location_name || post.destination_name}
                  </span>
                </div>

                {/* Caption */}
                <p className="text-sm text-gray-700 leading-relaxed mb-4 whitespace-pre-wrap">
                  {post.caption}
                </p>

                {/* Image */}
                {post.image_url && (
                  <div className="rounded-2xl overflow-hidden mb-4 border border-gray-100 max-h-[420px] bg-gray-50 flex items-center justify-center">
                    <img
                      src={post.image_url}
                      alt="Seyahat Görseli"
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                )}

                {/* Post Actions */}
                <div className="flex items-center gap-6 pt-3 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => handleToggleLike(post.id)}
                    className={`flex items-center gap-1.5 text-xs font-bold transition-all transform active:scale-110 ${
                      post.is_liked
                        ? "text-red-500 scale-105"
                        : "text-gray-500 hover:text-red-500"
                    }`}
                  >
                    <span className="text-base">{post.is_liked ? "❤️" : "🤍"}</span>
                    <span>{post.likes_count} Beğeni</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleToggleComments(post.id)}
                    className="flex items-center gap-1.5 text-xs font-bold text-gray-500 hover:text-gray-800 transition-colors"
                  >
                    <span className="text-base">💬</span>
                    <span>{post.comments_count} Yorum</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      if (navigator.clipboard) {
                        navigator.clipboard.writeText(window.location.href);
                      }
                      alert("Bağlantı panoya kopyalandı! 🔗");
                    }}
                    className="flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-gray-600 transition-colors ml-auto"
                  >
                    <span>↗️ Paylaş</span>
                  </button>
                </div>

                {/* Comments Drawer */}
                {isCommentsOpen && (
                  <div className="mt-4 pt-4 border-t border-gray-100 space-y-3">
                    {post.comments && post.comments.length > 0 ? (
                      post.comments.map((comment) => (
                        <div
                          key={comment.id}
                          className="bg-gray-50 rounded-2xl p-3 text-xs"
                        >
                          <div className="flex items-center justify-between mb-1">
                            <span className="font-extrabold text-gray-900">
                              {comment.author_name}
                            </span>
                            <span className="text-[10px] text-gray-400">
                              {comment.created_at}
                            </span>
                          </div>
                          <p className="text-gray-700">{comment.content}</p>
                        </div>
                      ))
                    ) : (
                      <p className="text-xs text-gray-400 italic">
                        Henüz yorum yapılmamış. İlk yorumu sen yaz!
                      </p>
                    )}

                    {/* Add Comment Input */}
                    <div className="flex items-center gap-2 pt-2">
                      <input
                        type="text"
                        placeholder="Yorumunuzu yazın..."
                        value={commentInputs[post.id] || ""}
                        onChange={(e) =>
                          setCommentInputs((prev) => ({
                            ...prev,
                            [post.id]: e.target.value,
                          }))
                        }
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            handleAddComment(post.id);
                          }
                        }}
                        className="flex-1 px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#0047ba]"
                      />
                      <button
                        type="button"
                        onClick={() => handleAddComment(post.id)}
                        className="py-2 px-4 bg-[#0047ba] hover:bg-[#003896] text-white text-xs font-bold rounded-xl transition-colors"
                      >
                        Gönder
                      </button>
                    </div>
                  </div>
                )}
              </article>
            );
          })
        )}
      </div>

      {/* Share Modal */}
      <SharePostModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </main>
  );
}
