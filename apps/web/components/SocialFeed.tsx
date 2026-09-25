/* eslint-disable @next/next/no-img-element */
"use client";

import React, { useState, useEffect } from "react";
import type { Post } from "@gezgin/types";
import { SEED_DESTINATIONS, SEED_POSTS } from "@gezgin/supabase-queries";
import { useAuth } from "@/context/auth-context";

interface SocialFeedProps {
  initialCity?: string;
  onOpenShareModal?: () => void;
}

export function SocialFeed({
  initialCity = "all",
  onOpenShareModal,
}: SocialFeedProps) {
  const { user, profile } = useAuth();
  const [selectedCity, setSelectedCity] = useState<string>(initialCity);
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [commentInputs, setCommentInputs] = useState<Record<string, string>>({});
  const [copiedPostId, setCopiedPostId] = useState<string | null>(null);

  // Listen to globally created posts from BottomNav + or modals
  useEffect(() => {
    const handleNewPost = (event: CustomEvent<Post>) => {
      if (event.detail) {
        setPosts((prev) => [event.detail, ...prev]);
      }
    };

    window.addEventListener("gezgin:post-created" as any, handleNewPost);
    return () => {
      window.removeEventListener("gezgin:post-created" as any, handleNewPost);
    };
  }, []);

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
            author_name: profile?.display_name || user?.email?.split("@")[0] || "Gezgin",
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

  const handleShare = (postId: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopiedPostId(postId);
      setTimeout(() => setCopiedPostId(null), 2000);
    }
  };

  return (
    <div className="w-full max-w-xl mx-auto">
      {/* City Filter Pills */}
      <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-none mb-6">
        <button
          type="button"
          onClick={() => setSelectedCity("all")}
          className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
            selectedCity === "all"
              ? "bg-[#0047ba] text-white shadow-sm"
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
              className={`flex-shrink-0 px-4 py-1.5 rounded-full text-xs font-semibold transition-all ${
                isSelected
                  ? "bg-[#0047ba] text-white shadow-sm"
                  : "bg-white text-gray-700 border border-gray-200 hover:bg-gray-50"
              }`}
            >
              {dest.name}
            </button>
          );
        })}
      </div>

      {/* Posts Stream */}
      <div className="space-y-6">
        {filteredPosts.length === 0 ? (
          <div className="bg-white rounded-2xl p-8 text-center border border-gray-200 shadow-sm">
            <p className="text-gray-500 text-sm mb-4">
              Bu şehir için henüz bir seyahat anısı paylaşılmadı.
            </p>
            {onOpenShareModal && (
              <button
                type="button"
                onClick={onOpenShareModal}
                className="py-2 px-4 rounded-xl bg-[#0047ba] text-white font-medium text-xs hover:bg-[#003896] transition-colors"
              >
                İlk Paylaşımı Yap
              </button>
            )}
          </div>
        ) : (
          filteredPosts.map((post) => {
            const isCommentsOpen = !!expandedComments[post.id];
            const authorInitial = (post.author_name || "G")[0].toUpperCase();

            return (
              <article
                key={post.id}
                className="bg-white rounded-2xl border border-gray-200/90 shadow-sm overflow-hidden transition-shadow hover:shadow-md"
              >
                {/* Post Header */}
                <div className="px-4 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gray-100 border border-gray-200 overflow-hidden flex items-center justify-center text-sm font-bold text-gray-700">
                      {post.author_avatar ? (
                        <img
                          src={post.author_avatar}
                          alt={post.author_name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span>{authorInitial}</span>
                      )}
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-sm font-bold text-gray-900 leading-tight">
                          {post.author_name}
                        </span>
                        {post.author_username && (
                          <span className="text-xs text-gray-400">
                            @{post.author_username}
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-1 text-[11px] text-gray-500 mt-0.5">
                        <span>📍</span>
                        <span className="font-medium text-gray-600">
                          {post.location_name || post.destination_name || "Türkiye"}
                        </span>
                        <span>•</span>
                        <span>{post.created_at}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Post Media (Image) */}
                {post.image_url && (
                  <div
                    className="relative w-full aspect-[4/3] bg-gray-100 overflow-hidden cursor-pointer select-none"
                    onDoubleClick={() => handleToggleLike(post.id)}
                  >
                    <img
                      src={post.image_url}
                      alt={post.caption || "Seyahat anısı"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                {/* Post Actions & Caption */}
                <div className="p-4">
                  {/* Action Icons */}
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-4">
                      {/* Like Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleLike(post.id)}
                        className={`flex items-center gap-1 text-sm font-semibold transition-transform active:scale-125 ${
                          post.is_liked ? "text-red-500" : "text-gray-700 hover:text-red-500"
                        }`}
                        title="Beğen"
                      >
                        <svg
                          className="w-6 h-6"
                          fill={post.is_liked ? "currentColor" : "none"}
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={post.is_liked ? 0 : 1.8}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                          />
                        </svg>
                      </button>

                      {/* Comment Button */}
                      <button
                        type="button"
                        onClick={() => handleToggleComments(post.id)}
                        className="text-gray-700 hover:text-gray-900 transition-colors"
                        title="Yorum Yap"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={1.8}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                          />
                        </svg>
                      </button>

                      {/* Share Button */}
                      <button
                        type="button"
                        onClick={() => handleShare(post.id)}
                        className="text-gray-700 hover:text-gray-900 transition-colors relative"
                        title="Bağlantıyı Paylaş"
                      >
                        <svg
                          className="w-6 h-6"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                          strokeWidth={1.8}
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                          />
                        </svg>
                        {copiedPostId === post.id && (
                          <span className="absolute -top-7 left-1/2 -translate-x-1/2 px-2 py-0.5 bg-gray-900 text-white text-[10px] rounded font-medium whitespace-nowrap shadow-sm">
                            Kopyalandı!
                          </span>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Likes Count */}
                  <div className="text-xs font-bold text-gray-900 mb-1.5">
                    {post.likes_count} beğenme
                  </div>

                  {/* Caption */}
                  <div className="text-xs sm:text-sm text-gray-800 leading-relaxed">
                    <span className="font-bold text-gray-900 mr-1.5">
                      {post.author_name}
                    </span>
                    <span>{post.caption}</span>
                  </div>

                  {/* Comments Count & Toggle */}
                  {post.comments_count > 0 && (
                    <button
                      type="button"
                      onClick={() => handleToggleComments(post.id)}
                      className="text-xs font-medium text-gray-400 hover:text-gray-600 mt-2 block"
                    >
                      {isCommentsOpen
                        ? "Yorumları gizle"
                        : `${post.comments_count} yorumun tümünü gör`}
                    </button>
                  )}

                  {/* Comments Section */}
                  {isCommentsOpen && (
                    <div className="mt-3 pt-3 border-t border-gray-100 space-y-2">
                      {post.comments && post.comments.length > 0 ? (
                        post.comments.map((comment) => (
                          <div key={comment.id} className="text-xs leading-relaxed">
                            <span className="font-bold text-gray-900 mr-1.5">
                              {comment.author_name}
                            </span>
                            <span className="text-gray-700">{comment.content}</span>
                            <span className="text-[10px] text-gray-400 ml-2">
                              {comment.created_at}
                            </span>
                          </div>
                        ))
                      ) : (
                        <p className="text-xs text-gray-400">Henüz yorum yok.</p>
                      )}

                      {/* Comment Input */}
                      <div className="flex items-center gap-2 mt-2 pt-2 border-t border-gray-50">
                        <input
                          type="text"
                          placeholder="Yorum ekle..."
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
                          className="flex-1 text-xs bg-gray-50 rounded-lg px-3 py-2 border border-gray-200 outline-none focus:bg-white focus:border-[#0047ba]"
                        />
                        <button
                          type="button"
                          onClick={() => handleAddComment(post.id)}
                          disabled={!commentInputs[post.id]?.trim()}
                          className="text-xs font-bold text-[#0047ba] hover:text-[#003896] disabled:opacity-40 px-2 py-1"
                        >
                          Paylaş
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })
        )}
      </div>
    </div>
  );
}
