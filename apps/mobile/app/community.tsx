import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  TextInput,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import type { Post } from "@gezgin/types";
import { SEED_DESTINATIONS, SEED_POSTS } from "@gezgin/supabase-queries";
import { useAuth } from "@/context/auth-context";
import { SharePostModal } from "@/components/SharePostModal";

export default function CommunityScreen() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [posts, setPosts] = useState<Post[]>(SEED_POSTS);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [expandedComments, setExpandedComments] = useState<Record<string, boolean>>({});
  const [newCommentText, setNewCommentText] = useState<Record<string, string>>({});

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
    const text = newCommentText[postId]?.trim();
    if (!text) return;

    setPosts((prev) =>
      prev.map((post) => {
        if (post.id === postId) {
          const newComment = {
            id: `c-${Date.now()}`,
            post_id: postId,
            user_id: user?.id || "u-me",
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

    setNewCommentText((prev) => ({ ...prev, [postId]: "" }));
  };

  const handlePostCreated = (newPost: Post) => {
    setPosts((prev) => [newPost, ...prev]);
  };

  return (
    <SafeAreaView style={styles.screen}>
      <StatusBar barStyle="dark-content" />

      {/* Header Bar */}
      <View style={styles.topHeader}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <View style={styles.titleWrap}>
          <Text style={styles.screenTitle}>Gezgin Topluluğu 🧭</Text>
          <Text style={styles.screenSubtitle}>Seyahat anıları ve canlı öneriler</Text>
        </View>
        <TouchableOpacity
          style={styles.headerPostBtn}
          onPress={() => setIsShareModalOpen(true)}
          activeOpacity={0.8}
        >
          <Text style={styles.headerPostBtnText}>+ Paylaş</Text>
        </TouchableOpacity>
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* City Filter Pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.cityScroll}
        >
          <TouchableOpacity
            onPress={() => setSelectedCity("all")}
            style={[styles.cityPill, selectedCity === "all" && styles.cityPillActive]}
          >
            <Text
              style={[
                styles.cityPillText,
                selectedCity === "all" && styles.cityPillTextActive,
              ]}
            >
              Tüm Şehirler
            </Text>
          </TouchableOpacity>
          {SEED_DESTINATIONS.map((dest) => {
            const isSelected = selectedCity === dest.id;
            return (
              <TouchableOpacity
                key={dest.id}
                onPress={() => setSelectedCity(dest.id)}
                style={[styles.cityPill, isSelected && styles.cityPillActive]}
              >
                <Text
                  style={[
                    styles.cityPillText,
                    isSelected && styles.cityPillTextActive,
                  ]}
                >
                  {dest.name}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Posts Feed */}
        {filteredPosts.length === 0 ? (
          <View style={styles.emptyCard}>
            <Text style={styles.emptyIcon}>📸</Text>
            <Text style={styles.emptyTitle}>Henüz paylaşım yok</Text>
            <Text style={styles.emptyDesc}>
              Bu şehir için ilk paylaşımı sen yap ve seyahat tavsiyelerini paylaş!
            </Text>
            <TouchableOpacity
              style={styles.emptyActionBtn}
              onPress={() => setIsShareModalOpen(true)}
            >
              <Text style={styles.emptyActionBtnText}>İlk Paylaşımı Yap</Text>
            </TouchableOpacity>
          </View>
        ) : (
          filteredPosts.map((post) => {
            const isCommentsOpen = !!expandedComments[post.id];
            return (
              <View key={post.id} style={styles.postCard}>
                {/* Author Info */}
                <View style={styles.authorRow}>
                  <View style={styles.avatar}>
                    {post.author_avatar ? (
                      <Image source={{ uri: post.author_avatar }} style={styles.avatarImg} />
                    ) : (
                      <Text style={styles.avatarInitial}>
                        {post.author_name[0].toUpperCase()}
                      </Text>
                    )}
                  </View>
                  <View style={styles.authorMeta}>
                    <Text style={styles.authorName}>{post.author_name}</Text>
                    <Text style={styles.postLocation}>
                      📍 {post.location_name || post.destination_name} • {post.created_at}
                    </Text>
                  </View>
                </View>

                {/* Caption */}
                <Text style={styles.caption}>{post.caption}</Text>

                {/* Image */}
                {post.image_url && (
                  <View style={styles.imageContainer}>
                    <Image source={{ uri: post.image_url }} style={styles.postImage} />
                  </View>
                )}

                {/* Actions Bar */}
                <View style={styles.actionsBar}>
                  <TouchableOpacity
                    style={[styles.actionBtn, post.is_liked && styles.actionBtnLiked]}
                    onPress={() => handleToggleLike(post.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.actionIcon}>{post.is_liked ? "❤️" : "🤍"}</Text>
                    <Text
                      style={[
                        styles.actionText,
                        post.is_liked && styles.actionTextLiked,
                      ]}
                    >
                      {post.likes_count} Beğeni
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => handleToggleComments(post.id)}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.actionIcon}>💬</Text>
                    <Text style={styles.actionText}>
                      {post.comments_count} Yorum
                    </Text>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.actionBtn}
                    onPress={() => {
                      Alert.alert(
                        "Paylaşım Linki Kopyalandı! 🔗",
                        `"${post.caption.slice(0, 40)}..." bağlantısı panoya kopyalandı.`
                      );
                    }}
                    activeOpacity={0.7}
                  >
                    <Text style={styles.actionIcon}>↗️</Text>
                    <Text style={styles.actionText}>Paylaş</Text>
                  </TouchableOpacity>
                </View>

                {/* Comments Section */}
                {isCommentsOpen && (
                  <View style={styles.commentsBox}>
                    {post.comments && post.comments.length > 0 ? (
                      post.comments.map((comment) => (
                        <View key={comment.id} style={styles.commentItem}>
                          <Text style={styles.commentAuthor}>{comment.author_name}:</Text>
                          <Text style={styles.commentContent}> {comment.content}</Text>
                        </View>
                      ))
                    ) : (
                      <Text style={styles.noCommentsText}>İlk yorumu sen yaz...</Text>
                    )}

                    {/* Add Comment Input */}
                    <View style={styles.commentInputRow}>
                      <TextInput
                        style={styles.commentInput}
                        placeholder="Yorum ekle..."
                        placeholderTextColor="#94a3b8"
                        value={newCommentText[post.id] || ""}
                        onChangeText={(txt) =>
                          setNewCommentText((prev) => ({ ...prev, [post.id]: txt }))
                        }
                      />
                      <TouchableOpacity
                        style={styles.commentSendBtn}
                        onPress={() => handleAddComment(post.id)}
                      >
                        <Text style={styles.commentSendText}>Gönder</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                )}
              </View>
            );
          })
        )}
      </ScrollView>

      {/* Share Post Modal */}
      <SharePostModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onPostCreated={handlePostCreated}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  topHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderBottomColor: "#e2e8f0",
  },
  backButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  backButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#334155",
  },
  titleWrap: {
    flex: 1,
    marginLeft: 12,
  },
  screenTitle: {
    fontSize: 17,
    fontWeight: "900",
    color: "#0f172a",
  },
  screenSubtitle: {
    fontSize: 11,
    color: "#64748b",
  },
  headerPostBtn: {
    backgroundColor: "#0047ba",
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 14,
  },
  headerPostBtnText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "800",
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  cityScroll: {
    gap: 6,
    paddingBottom: 14,
  },
  cityPill: {
    backgroundColor: "#ffffff",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    paddingHorizontal: 13,
    paddingVertical: 6,
    borderRadius: 16,
  },
  cityPillActive: {
    backgroundColor: "#0047ba",
    borderColor: "#0047ba",
  },
  cityPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },
  cityPillTextActive: {
    color: "#ffffff",
  },
  postCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "#e0f2fe",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
  },
  avatarInitial: {
    color: "#0369a1",
    fontWeight: "800",
    fontSize: 16,
  },
  authorMeta: {
    marginLeft: 10,
    flex: 1,
  },
  authorName: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0f172a",
  },
  postLocation: {
    fontSize: 11,
    color: "#64748b",
    marginTop: 1,
  },
  caption: {
    fontSize: 13,
    color: "#1e293b",
    lineHeight: 19,
    marginBottom: 10,
  },
  imageContainer: {
    borderRadius: 14,
    overflow: "hidden",
    marginBottom: 12,
  },
  postImage: {
    width: "100%",
    height: 220,
    borderRadius: 14,
  },
  actionsBar: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    paddingTop: 10,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  actionBtnLiked: {
    opacity: 0.9,
  },
  actionIcon: {
    fontSize: 15,
  },
  actionText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#64748b",
  },
  actionTextLiked: {
    color: "#ef4444",
  },
  commentsBox: {
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  commentItem: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginBottom: 6,
  },
  commentAuthor: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0f172a",
  },
  commentContent: {
    fontSize: 12,
    color: "#475569",
  },
  noCommentsText: {
    fontSize: 11,
    color: "#94a3b8",
    fontStyle: "italic",
    marginBottom: 8,
  },
  commentInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
  },
  commentInput: {
    flex: 1,
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 6,
    fontSize: 12,
    color: "#0f172a",
  },
  commentSendBtn: {
    backgroundColor: "#0047ba",
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 12,
  },
  commentSendText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
  emptyCard: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 32,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginTop: 20,
  },
  emptyIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 4,
  },
  emptyDesc: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 16,
  },
  emptyActionBtn: {
    backgroundColor: "#0047ba",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 14,
  },
  emptyActionBtnText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 13,
  },
});
