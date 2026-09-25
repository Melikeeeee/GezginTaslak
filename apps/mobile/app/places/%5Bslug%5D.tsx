import React, { useState } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Alert,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { ALL_PLACES } from "@gezgin/supabase-queries";
import { MOBILE_CATEGORY_META } from "@/components/PlaceCard";

export default function PlaceDetailScreen() {
  const { slug } = useLocalSearchParams<{ slug: string }>();
  const router = useRouter();

  const [addedMessage, setAddedMessage] = useState(false);

  const place = ALL_PLACES.find((p) => p.slug === slug);

  if (!place) {
    return (
      <SafeAreaView style={styles.notFoundContainer}>
        <Text style={styles.notFoundEmoji}>⚠️</Text>
        <Text style={styles.notFoundTitle}>Mekan Bulunamadı</Text>
        <TouchableOpacity style={styles.backHomeBtn} onPress={() => router.back()}>
          <Text style={styles.backHomeBtnText}>← Geri Dön</Text>
        </TouchableOpacity>
      </SafeAreaView>
    );
  }

  const cat = MOBILE_CATEGORY_META[place.category] || {
    label: place.category,
    icon: "📍",
    bg: "#f3f4f6",
    text: "#374151",
  };

  const handleAddToTrip = () => {
    setAddedMessage(true);
    setTimeout(() => {
      setAddedMessage(false);
      Alert.alert("Başarılı! 🎉", `"${place.name}" rotanıza eklendi.`);
    }, 500);
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" />

      {/* Top Floating Back Button */}
      <View style={styles.headerBar}>
        <TouchableOpacity
          style={styles.backCircleBtn}
          onPress={() => router.back()}
        >
          <Text style={styles.backCircleText}>←</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Hero Image Banner */}
        <View style={styles.heroContainer}>
          <Image source={{ uri: place.image_url }} style={styles.heroImage} />
          <View style={styles.heroGradient} />

          {/* Top category & rating */}
          <View style={styles.badgeRow}>
            <View style={[styles.categoryBadge, { backgroundColor: cat.bg }]}>
              <Text style={styles.categoryIcon}>{cat.icon}</Text>
              <Text style={[styles.categoryText, { color: cat.text }]}>
                {cat.label}
              </Text>
            </View>

            <View style={styles.ratingBadge}>
              <Text style={styles.starText}>★</Text>
              <Text style={styles.ratingText}>{place.rating.toFixed(1)}</Text>
            </View>
          </View>

          <View style={styles.heroBottomText}>
            <View style={styles.pillRow}>
              <Text style={styles.pill}>Fiyat: {"₺".repeat(place.price_level)}</Text>
              <Text style={styles.pill}>⏱️ {place.estimated_visit_minutes} dk</Text>
            </View>
            <Text style={styles.heroTitle}>{place.name}</Text>
          </View>
        </View>

        {/* Content Details */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionHeader}>📖 Mekan Hakkında</Text>
          <Text style={styles.descriptionText}>{place.description}</Text>
        </View>

        {/* Info Grid */}
        <View style={styles.cardSection}>
          <Text style={styles.sectionHeader}>ℹ️ Ziyaret Bilgileri</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>🕒</Text>
            <View style={styles.infoTextCol}>
              <Text style={styles.infoLabel}>Çalışma Saatleri</Text>
              <Text style={styles.infoValue}>{place.opening_hours}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>📍</Text>
            <View style={styles.infoTextCol}>
              <Text style={styles.infoLabel}>Adres</Text>
              <Text style={styles.infoValue}>{place.address}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoIcon}>⏳</Text>
            <View style={styles.infoTextCol}>
              <Text style={styles.infoLabel}>Ortalama Gezi Süresi</Text>
              <Text style={styles.infoValue}>{place.estimated_visit_minutes} dakika</Text>
            </View>
          </View>
        </View>

        {/* Bottom CTA Button */}
        <View style={styles.actionContainer}>
          <TouchableOpacity
            style={styles.addCtaButton}
            onPress={handleAddToTrip}
            disabled={addedMessage}
          >
            <Text style={styles.addCtaButtonText}>
              {addedMessage ? "Ekleniyor..." : "+ Rotaya Ekle"}
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  headerBar: {
    position: "absolute",
    top: 48,
    left: 16,
    zIndex: 20,
  },
  backCircleBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "center",
    justifyContent: "center",
  },
  backCircleText: {
    color: "#ffffff",
    fontSize: 20,
    fontWeight: "bold",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroContainer: {
    position: "relative",
    width: "100%",
    height: 280,
    backgroundColor: "#0f172a",
  },
  heroImage: {
    width: "100%",
    height: "100%",
  },
  heroGradient: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.35)",
  },
  badgeRow: {
    position: "absolute",
    top: 48,
    right: 16,
    flexDirection: "row",
    gap: 8,
  },
  categoryBadge: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryIcon: {
    fontSize: 12,
    marginRight: 4,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "700",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  starText: {
    fontSize: 12,
    color: "#f59e0b",
    marginRight: 3,
  },
  ratingText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#0f172a",
  },
  heroBottomText: {
    position: "absolute",
    bottom: 16,
    left: 16,
    right: 16,
  },
  pillRow: {
    flexDirection: "row",
    gap: 8,
    marginBottom: 6,
  },
  pill: {
    fontSize: 11,
    color: "#ffffff",
    backgroundColor: "rgba(255,255,255,0.25)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    fontWeight: "600",
  },
  heroTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#ffffff",
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 4,
  },
  cardSection: {
    backgroundColor: "#ffffff",
    marginHorizontal: 16,
    marginTop: 16,
    padding: 16,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#f1f5f9",
  },
  sectionHeader: {
    fontSize: 14,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 8,
  },
  descriptionText: {
    fontSize: 13,
    color: "#475569",
    lineHeight: 20,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 12,
  },
  infoIcon: {
    fontSize: 16,
    marginRight: 10,
    marginTop: 2,
  },
  infoTextCol: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 11,
    fontWeight: "700",
    color: "#94a3b8",
  },
  infoValue: {
    fontSize: 13,
    fontWeight: "600",
    color: "#1e293b",
    marginTop: 2,
  },
  actionContainer: {
    marginHorizontal: 16,
    marginTop: 20,
  },
  addCtaButton: {
    backgroundColor: "#0047ba",
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#0047ba",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  addCtaButtonText: {
    fontSize: 14,
    fontWeight: "800",
    color: "#ffffff",
  },
  notFoundContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 24,
  },
  notFoundEmoji: {
    fontSize: 40,
    marginBottom: 12,
  },
  notFoundTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 16,
  },
  backHomeBtn: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: "#0047ba",
    borderRadius: 12,
  },
  backHomeBtnText: {
    color: "#ffffff",
    fontWeight: "700",
  },
});
