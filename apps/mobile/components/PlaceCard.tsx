import React from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  TouchableOpacity,
} from "react-native";
import type { Place, PlaceCategory } from "@gezgin/types";

interface PlaceCardProps {
  place: Place;
  onPress?: (place: Place) => void;
  onAddToTrip?: (place: Place) => void;
}

export const MOBILE_CATEGORY_META: Record<
  PlaceCategory,
  { label: string; icon: string; bg: string; text: string }
> = {
  historical: { label: "Tarihi", icon: "🏛️", bg: "#fef3c7", text: "#92400e" },
  museum: { label: "Müze", icon: "🎨", bg: "#f3e8ff", text: "#6b21a8" },
  restaurant: { label: "Restoran", icon: "🍽️", bg: "#ffedd5", text: "#9a3412" },
  cafe: { label: "Kafe", icon: "☕", bg: "#ffe4e6", text: "#9f1239" },
  nature: { label: "Doğa & Park", icon: "🌳", bg: "#d1fae5", text: "#065f46" },
  shopping: { label: "Alışveriş", icon: "🛍️", bg: "#e0e7ff", text: "#3730a3" },
  viewpoint: { label: "Manzara", icon: "🔭", bg: "#cffafe", text: "#155e75" },
  activity: { label: "Aktivite", icon: "⚡", bg: "#fef9c3", text: "#854d0e" },
  culture: { label: "Kültür", icon: "🎭", bg: "#dbeafe", text: "#1e40af" },
};

export function PlaceCard({ place, onPress, onAddToTrip }: PlaceCardProps) {
  const cat = MOBILE_CATEGORY_META[place.category] || {
    label: place.category,
    icon: "📍",
    bg: "#f3f4f6",
    text: "#374151",
  };

  const priceIndicator = "₺".repeat(place.price_level);

  return (
    <TouchableOpacity
      activeOpacity={0.9}
      onPress={() => onPress && onPress(place)}
      style={styles.card}
    >
      <View style={styles.imageContainer}>
        <Image source={{ uri: place.image_url }} style={styles.image} />
        <View style={styles.imageOverlay} />

        {/* Category Pill */}
        <View style={[styles.categoryBadge, { backgroundColor: cat.bg }]}>
          <Text style={styles.categoryIcon}>{cat.icon}</Text>
          <Text style={[styles.categoryText, { color: cat.text }]}>
            {cat.label}
          </Text>
        </View>

        {/* Rating and Price */}
        <View style={styles.topRightBadges}>
          <View style={styles.ratingBadge}>
            <Text style={styles.starText}>★</Text>
            <Text style={styles.ratingText}>{place.rating.toFixed(1)}</Text>
          </View>
          <View style={styles.priceBadge}>
            <Text style={styles.priceText}>{priceIndicator}</Text>
          </View>
        </View>

        {/* Visit time */}
        <View style={styles.durationBadge}>
          <Text style={styles.durationText}>⏱️ {place.estimated_visit_minutes} dk</Text>
        </View>
      </View>

      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {place.name}
        </Text>
        <Text style={styles.desc} numberOfLines={2}>
          {place.description}
        </Text>

        <View style={styles.addressRow}>
          <Text style={styles.pinIcon}>📍</Text>
          <Text style={styles.addressText} numberOfLines={1}>
            {place.address}
          </Text>
        </View>

        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.detailButton}
            onPress={() => onPress && onPress(place)}
          >
            <Text style={styles.detailButtonText}>Detaylar</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => onAddToTrip && onAddToTrip(place)}
          >
            <Text style={styles.addButtonText}>+ Rotaya Ekle</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#f1f5f9",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  imageContainer: {
    position: "relative",
    width: "100%",
    height: 160,
    backgroundColor: "#e2e8f0",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  imageOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0, 0, 0, 0.2)",
  },
  categoryBadge: {
    position: "absolute",
    top: 10,
    left: 10,
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
  topRightBadges: {
    position: "absolute",
    top: 10,
    right: 10,
    flexDirection: "row",
    gap: 6,
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.95)",
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
  priceBadge: {
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 10,
  },
  priceText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#ffffff",
  },
  durationBadge: {
    position: "absolute",
    bottom: 8,
    right: 10,
    backgroundColor: "rgba(0,0,0,0.55)",
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  durationText: {
    fontSize: 10,
    fontWeight: "600",
    color: "#ffffff",
  },
  body: {
    padding: 14,
  },
  name: {
    fontSize: 16,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 4,
  },
  desc: {
    fontSize: 12,
    color: "#64748b",
    lineHeight: 18,
    marginBottom: 10,
  },
  addressRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  pinIcon: {
    fontSize: 11,
    marginRight: 4,
  },
  addressText: {
    fontSize: 11,
    color: "#94a3b8",
    flex: 1,
  },
  actionRow: {
    flexDirection: "row",
    gap: 8,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
  },
  detailButton: {
    flex: 1,
    paddingVertical: 8,
    backgroundColor: "#f8fafc",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    alignItems: "center",
  },
  detailButtonText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#475569",
  },
  addButton: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: "#0047ba",
    borderRadius: 10,
    alignItems: "center",
  },
  addButtonText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#ffffff",
  },
});
