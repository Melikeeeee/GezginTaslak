import React from "react";
import {
  Modal,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
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
  const [isSaving, setIsSaving] = React.useState(false);
  const [saveMessage, setSaveMessage] = React.useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);

  if (!isOpen || !itinerary) return null;

  const currentDay = itinerary.days[0];

  const handleSaveTrip = async () => {
    if (!user || !supabase) {
      setSaveMessage({
        type: "error",
        text: "Rotayı kaydetmek için lütfen giriş yapın.",
      });
      return;
    }

    setIsSaving(true);
    setSaveMessage(null);
    try {
      const destinationId = "a1b2c3d4-e5f6-4a5b-8c9d-0e1f2a3b4c5d";
      const todayStr = new Date().toISOString().split("T")[0];

      await createTrip(supabase, user.id, {
        destinationId,
        title: itinerary.title,
        tripType: itinerary.days.length > 1 ? "multi_day" : "day_trip",
        startDate: todayStr,
        endDate: todayStr,
        pace: itinerary.pace,
        budgetLevel: itinerary.budget,
        notes: itinerary.summary,
      });

      setSaveMessage({
        type: "success",
        text: "Rota başarıyla seyahatlerinize kaydedildi!",
      });
    } catch (err) {
      setSaveMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Kayıt hatası oluştu.",
      });
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
      default:
        return "📍";
    }
  };

  return (
    <Modal
      visible={isOpen}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalCard}>
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleArea}>
              <View style={styles.badgeRow}>
                <View style={styles.badgePrimary}>
                  <Text style={styles.badgePrimaryText}>AI Akıllı Rota</Text>
                </View>
                <View style={styles.badgeSecondary}>
                  <Text style={styles.badgeSecondaryText}>
                    {itinerary.totalDurationHours} Saatlik Plan
                  </Text>
                </View>
              </View>
              <Text style={styles.title}>{itinerary.title}</Text>
            </View>

            <TouchableOpacity
              onPress={onClose}
              style={styles.closeBtn}
              activeOpacity={0.7}
            >
              <Text style={styles.closeBtnText}>✕</Text>
            </TouchableOpacity>
          </View>

          {saveMessage && (
            <View
              style={[
                styles.messageBanner,
                saveMessage.type === "success"
                  ? styles.successBanner
                  : styles.errorBanner,
              ]}
            >
              <Text
                style={[
                  styles.messageText,
                  saveMessage.type === "success"
                    ? styles.successText
                    : styles.errorText,
                ]}
              >
                {saveMessage.text}
              </Text>
            </View>
          )}

          {/* Stops List */}
          <ScrollView
            style={styles.contentScroll}
            contentContainerStyle={styles.scrollInner}
          >
            {currentDay?.stops.map((stop, idx) => (
              <View key={idx} style={styles.stopCard}>
                <View style={styles.stopHeader}>
                  <Text style={styles.categoryIcon}>
                    {getCategoryIcon(stop.category)}
                  </Text>
                  <View style={styles.timeBadge}>
                    <Text style={styles.timeText}>{stop.timeSlot}</Text>
                  </View>
                  <Text style={styles.durationText}>
                    ⏳ {stop.durationMinutes} dk
                  </Text>
                </View>

                <Text style={styles.stopName}>{stop.name}</Text>
                <Text style={styles.stopDesc}>{stop.description}</Text>

                {stop.tip ? (
                  <View style={styles.tipBox}>
                    <Text style={styles.tipText}>💡 Öneri: {stop.tip}</Text>
                  </View>
                ) : null}
              </View>
            ))}
          </ScrollView>

          {/* Footer Actions */}
          <View style={styles.footer}>
            <TouchableOpacity
              style={styles.closeActionBtn}
              onPress={onClose}
              activeOpacity={0.8}
            >
              <Text style={styles.closeActionBtnText}>Kapat</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.saveActionBtn}
              onPress={handleSaveTrip}
              disabled={isSaving}
              activeOpacity={0.85}
            >
              {isSaving ? (
                <ActivityIndicator color="#ffffff" size="small" />
              ) : (
                <Text style={styles.saveActionBtnText}>Rotayı Kaydet 💾</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.55)",
    justifyContent: "flex-end",
  },
  modalCard: {
    backgroundColor: "#ffffff",
    borderTopLeftRadius: 28,
    borderTopRightRadius: 28,
    maxHeight: "85%",
    paddingBottom: 24,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  titleArea: {
    flex: 1,
    paddingRight: 12,
  },
  badgeRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
  },
  badgePrimary: {
    backgroundColor: "#0047ba",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgePrimaryText: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
  },
  badgeSecondary: {
    backgroundColor: "#e0f2fe",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  badgeSecondaryText: {
    color: "#0369a1",
    fontSize: 11,
    fontWeight: "600",
  },
  title: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
    lineHeight: 24,
  },
  closeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#f1f5f9",
    justifyContent: "center",
    alignItems: "center",
  },
  closeBtnText: {
    fontSize: 16,
    color: "#64748b",
    fontWeight: "700",
  },
  messageBanner: {
    marginHorizontal: 20,
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
  },
  successBanner: {
    backgroundColor: "#ecfdf5",
    borderColor: "#a7f3d0",
    borderWidth: 1,
  },
  errorBanner: {
    backgroundColor: "#fef2f2",
    borderColor: "#fecaca",
    borderWidth: 1,
  },
  messageText: {
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  successText: {
    color: "#065f46",
  },
  errorText: {
    color: "#991b1b",
  },
  contentScroll: {
    paddingHorizontal: 20,
    marginTop: 10,
  },
  scrollInner: {
    paddingBottom: 20,
    gap: 12,
  },
  stopCard: {
    backgroundColor: "#f8fafc",
    borderRadius: 16,
    padding: 14,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  stopHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 6,
  },
  categoryIcon: {
    fontSize: 18,
  },
  timeBadge: {
    backgroundColor: "#e0f2fe",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  timeText: {
    color: "#0047ba",
    fontSize: 11,
    fontWeight: "700",
  },
  durationText: {
    fontSize: 11,
    color: "#64748b",
    marginLeft: "auto",
  },
  stopName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 4,
  },
  stopDesc: {
    fontSize: 12,
    color: "#475569",
    lineHeight: 18,
  },
  tipBox: {
    marginTop: 8,
    backgroundColor: "#fffbeb",
    borderRadius: 8,
    padding: 8,
    borderWidth: 1,
    borderColor: "#fef3c7",
  },
  tipText: {
    fontSize: 11,
    color: "#92400e",
    lineHeight: 16,
  },
  footer: {
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingTop: 12,
    gap: 10,
  },
  closeActionBtn: {
    flex: 1,
    height: 46,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
  },
  closeActionBtnText: {
    color: "#475569",
    fontSize: 14,
    fontWeight: "600",
  },
  saveActionBtn: {
    flex: 2,
    height: 46,
    borderRadius: 12,
    backgroundColor: "#0047ba",
    justifyContent: "center",
    alignItems: "center",
  },
  saveActionBtnText: {
    color: "#ffffff",
    fontSize: 14,
    fontWeight: "700",
  },
});
