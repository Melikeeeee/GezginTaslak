import React, { useState } from "react";
import {
  Modal,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Image,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
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

  const handleSubmit = () => {
    if (!caption.trim()) {
      return;
    }

    const selectedDest = SEED_DESTINATIONS.find((d) => d.id === selectedDestId);

    const newPost: Post = {
      id: `post-mobile-${Date.now()}`,
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
    <Modal
      visible={isOpen}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.modalOverlay}
      >
        <View style={styles.modalContent}>
          {/* Header */}
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Yeni Paylaşım</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.formContent}
          >
            {/* Author Row */}
            <View style={styles.authorRow}>
              <View style={styles.avatar}>
                {profile?.avatar_url ? (
                  <Image source={{ uri: profile.avatar_url }} style={styles.avatarImg} />
                ) : (
                  <Text style={styles.avatarText}>{authorInitial}</Text>
                )}
              </View>
              <View>
                <Text style={styles.authorName}>
                  {profile?.display_name || user?.email?.split("@")[0] || "Gezgin"}
                </Text>
                <Text style={styles.authorSub}>Herkese açık</Text>
              </View>
            </View>

            {/* City Selection Chips */}
            <Text style={styles.fieldLabel}>Şehir</Text>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.destScroll}
            >
              {SEED_DESTINATIONS.map((dest) => {
                const isSelected = selectedDestId === dest.id;
                return (
                  <TouchableOpacity
                    key={dest.id}
                    onPress={() => setSelectedDestId(dest.id)}
                    style={[
                      styles.destChip,
                      isSelected && styles.destChipActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.destChipText,
                        isSelected && styles.destChipTextActive,
                      ]}
                    >
                      {dest.name}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>

            {/* Caption */}
            <TextInput
              style={[styles.input, styles.textArea]}
              placeholder="Nereyi gezdin? Tavsiyelerini ve seyahat notlarını yaz..."
              placeholderTextColor="#94a3b8"
              value={caption}
              onChangeText={setCaption}
              multiline
              numberOfLines={4}
            />

            {/* Location Tag */}
            <TextInput
              style={styles.input}
              placeholder="Konum veya mekan ekle (örn. Sultanahmet)"
              placeholderTextColor="#94a3b8"
              value={locationName}
              onChangeText={setLocationName}
            />

            {/* Photo Attachment */}
            {imageUrl ? (
              <View style={styles.imagePreviewContainer}>
                <Image source={{ uri: imageUrl }} style={styles.imagePreview} />
                <TouchableOpacity
                  style={styles.removeImageBtn}
                  onPress={() => {
                    setImageUrl("");
                    setShowImageInput(false);
                  }}
                >
                  <Text style={styles.removeImageText}>Fotoğrafı Kaldır</Text>
                </TouchableOpacity>
              </View>
            ) : showImageInput ? (
              <View style={styles.imageInputRow}>
                <TextInput
                  style={[styles.input, { flex: 1 }]}
                  placeholder="Görsel linki (https://...)"
                  placeholderTextColor="#94a3b8"
                  value={imageUrl}
                  onChangeText={setImageUrl}
                />
                <TouchableOpacity
                  onPress={() => setShowImageInput(false)}
                  style={styles.cancelImageBtn}
                >
                  <Text style={styles.cancelImageText}>İptal</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                onPress={() => setShowImageInput(true)}
                style={styles.addImageBtn}
              >
                <Text style={styles.addImageText}>+ Fotoğraf linki ekle</Text>
              </TouchableOpacity>
            )}

            {/* Submit Button */}
            <TouchableOpacity
              style={[
                styles.submitButton,
                !caption.trim() && styles.submitButtonDisabled,
              ]}
              onPress={handleSubmit}
              disabled={!caption.trim()}
              activeOpacity={0.85}
            >
              <Text style={styles.submitButtonText}>Paylaş</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(15, 23, 42, 0.6)",
    justifyContent: "flex-end",
  },
  modalContent: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "85%",
    paddingBottom: 24,
  },
  modalHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  closeBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  closeBtnText: {
    fontSize: 13,
    fontWeight: "bold",
    color: "#64748b",
  },
  formContent: {
    padding: 20,
    gap: 12,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 4,
  },
  avatar: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#0047ba",
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
  },
  avatarImg: {
    width: "100%",
    height: "100%",
  },
  avatarText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 14,
  },
  authorName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0f172a",
  },
  authorSub: {
    fontSize: 11,
    color: "#94a3b8",
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  destScroll: {
    gap: 6,
  },
  destChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 14,
    backgroundColor: "#f1f5f9",
  },
  destChipActive: {
    backgroundColor: "#0047ba",
  },
  destChipText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  destChipTextActive: {
    color: "#ffffff",
  },
  input: {
    backgroundColor: "#f8fafc",
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    fontSize: 13,
    color: "#0f172a",
  },
  textArea: {
    minHeight: 90,
    textAlignVertical: "top",
  },
  imageInputRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  cancelImageBtn: {
    paddingHorizontal: 8,
    paddingVertical: 8,
  },
  cancelImageText: {
    fontSize: 12,
    color: "#64748b",
  },
  addImageBtn: {
    alignSelf: "flex-start",
    paddingVertical: 4,
  },
  addImageText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#0047ba",
  },
  imagePreviewContainer: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 4,
  },
  imagePreview: {
    width: "100%",
    height: 150,
    borderRadius: 12,
  },
  removeImageBtn: {
    marginTop: 6,
    alignSelf: "flex-end",
  },
  removeImageText: {
    fontSize: 11,
    fontWeight: "600",
    color: "#ef4444",
  },
  submitButton: {
    backgroundColor: "#0047ba",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8,
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: "700",
    color: "#ffffff",
  },
});
