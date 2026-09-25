import React, { useState, useRef } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import type { GeneratedItinerary } from "@gezgin/validation";
import type { PlaceCategory } from "@gezgin/types";
import { ALL_PLACES, SEED_DESTINATIONS } from "@gezgin/supabase-queries";
import { useAuth } from "@/context/auth-context";
import { RoutePlanModal } from "@/components/RoutePlanModal";
import { PlaceCard } from "@/components/PlaceCard";
import { SharePostModal } from "@/components/SharePostModal";

const { width } = Dimensions.get("window");

export default function HomeScreen() {
  const router = useRouter();
  const { user, profile } = useAuth();
  const scrollViewRef = useRef<ScrollView>(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [guestCount, setGuestCount] = useState<number>(2);
  const [budgetMax, setBudgetMax] = useState<number>(8500);
  const [accommodationType, setAccommodationType] = useState<string>("Otel");
  const [selectedTag, setSelectedTag] = useState<string>("Ekonomik");
  const [planGenerated, setPlanGenerated] = useState<boolean>(false);

  // AI Route planning state
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generatedItinerary, setGeneratedItinerary] =
    useState<GeneratedItinerary | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);

  // Place Discovery state
  const [selectedCity, setSelectedCity] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<PlaceCategory | "all">("all");

  const categoriesList: { id: PlaceCategory | "all"; label: string; icon: string }[] = [
    { id: "all", label: "Tümü", icon: "✨" },
    { id: "historical", label: "Tarihi", icon: "🏛️" },
    { id: "museum", label: "Müzeler", icon: "🎨" },
    { id: "restaurant", label: "Restoranlar", icon: "🍽️" },
    { id: "cafe", label: "Kafeler", icon: "☕" },
    { id: "nature", label: "Doğa & Manzara", icon: "🌳" },
    { id: "shopping", label: "Alışveriş", icon: "🛍️" },
  ];

  const filteredPlaces = ALL_PLACES.filter((place) => {
    const matchesCategory =
      selectedCategory === "all" ||
      place.category === selectedCategory ||
      (selectedCategory === "nature" && place.category === "viewpoint");

    const matchesCity =
      selectedCity === "all" || place.destination_id === selectedCity;

    const q = searchQuery.trim().toLowerCase();
    const matchesQuery =
      !q ||
      place.name.toLowerCase().includes(q) ||
      place.description.toLowerCase().includes(q) ||
      place.address.toLowerCase().includes(q);
    return matchesCategory && matchesCity && matchesQuery;
  });

  const accommodationTypes = [
    "Otel",
    "Pansiyon & Butik",
    "Apart Daire",
    "Ulaşım & Transfer",
  ];
  const tags = ["Ekonomik", "Lüks", "Merkezi"];

  const avatarInitial = (
    profile?.display_name ||
    user?.email ||
    "G"
  )[0].toUpperCase();

  const handleRouteCreate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const activeCityObj =
        selectedCity !== "all"
          ? SEED_DESTINATIONS.find((d) => d.id === selectedCity)
          : null;
      const destination =
        searchQuery.trim() || activeCityObj?.name || "Türkiye";
      const itinerary: GeneratedItinerary = {
        id: `mobile-itin-${Date.now()}`,
        title: `✨ 1 Günlük ${destination} Tarih & Lezzet Rotası`,
        destination,
        summary: `${guestCount} kişi için dengeli tempoda hazırlanan rota.`,
        pace: "balanced",
        budget:
          selectedTag === "Lüks"
            ? "high"
            : selectedTag === "Ekonomik"
              ? "low"
              : "medium",
        totalDurationHours: 6,
        days: [
          {
            dayNumber: 1,
            title: `1. Gün: ${destination} Keşif Rotası`,
            summary: "Tarihi yarımada ve sahil şeridinde dengeli seyahat planı.",
            stops: [
              {
                id: "stop-1",
                name: "Ayasofya-i Kebîr Câmi-i Şerîfi",
                category: "historical",
                description:
                  "Bizans ve Osmanlı'nın anıtsal ortak mirası ve tarihi kubbesi.",
                timeSlot: "09:30 - 11:00",
                durationMinutes: 90,
                tip: "Sabah açılış saatinde giderseniz sakin gezebilirsiniz.",
                estimatedCost: "₺250",
              },
              {
                id: "stop-2",
                name: "Tarihi Sultanahmet Köftecisi",
                category: "restaurant",
                description:
                  "1920'den beri değişmeyen tarifle ızgara köfte ve geleneksel piyaz.",
                timeSlot: "12:00 - 13:00",
                durationMinutes: 60,
                tip: "İrmik helvasını denemeyi unutmayın.",
                estimatedCost: "₺280",
              },
              {
                id: "stop-3",
                name: "Gülhane Parkı & Boğaz Sahili",
                category: "nature",
                description:
                  "Asırlık çınar ağaçları altında yürüyüş ve Sarayburnu deniz manzarası.",
                timeSlot: "13:30 - 14:45",
                durationMinutes: 75,
                tip: "Sarayburnu Çay Bahçesi'nde çay molası verin.",
                estimatedCost: "Ücretsiz",
              },
              {
                id: "stop-4",
                name: "Galata Kulesi",
                category: "historical",
                description:
                  "Haliç ve Tarihi Yarımada'ya bakan panoramik seyir kulesi.",
                timeSlot: "16:00 - 17:30",
                durationMinutes: 90,
                tip: "Gün batımından hemen önce seyir terası en güzel ışığı alır.",
                estimatedCost: "₺350",
              },
            ],
          },
        ],
        createdAt: new Date().toISOString(),
      };
      setGeneratedItinerary(itinerary);
      setIsGenerating(false);
      setIsModalOpen(true);
    }, 600);
  };

  const handleHomePress = () => {
    scrollViewRef.current?.scrollTo({ y: 0, animated: true });
  };

  const handleExplorePress = () => {
    scrollViewRef.current?.scrollTo({ y: 520, animated: true });
  };

  return (
    <View style={styles.screen}>
      <ScrollView
        ref={scrollViewRef}
        style={styles.container}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header: "Nereyi keşfetmek istiyorsun?" & Avatar */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Nereyi keşfetmek</Text>
            <Text style={styles.headerTitle}>istiyorsun?</Text>
          </View>

          <TouchableOpacity
            onPress={() => router.push(user ? "/profile" : "/(auth)/login")}
            style={styles.avatarButton}
            activeOpacity={0.8}
          >
            <View style={styles.avatarCircle}>
              <Text style={styles.avatarText}>{avatarInitial}</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* Rounded Search Bar */}
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.searchInput}
            placeholder="Eskişehir veya bir yer ara..."
            placeholderTextColor="#94a3b8"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Text style={styles.clearSearchText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Card 1: Rota Çiz */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Rota Çiz</Text>
          <Text style={styles.cardSubtitle}>
            Popüler Yerler, Gezilecek ve Yenecek Noktalar
          </Text>

          {/* Winding Road Visual Representation */}
          <View style={styles.windingRoadBox}>
            {/* Top Node: Tarihi */}
            <View style={[styles.milestoneNode, { top: 30, left: width * 0.42 }]}>
              <View style={styles.nodeCircle}>
                <Text style={styles.nodeEmoji}>🏛️</Text>
              </View>
              <Text style={styles.nodeLabel}>Tarihi</Text>
            </View>

            {/* Middle Node: Restoran */}
            <View style={[styles.milestoneNode, { top: 110, right: width * 0.18 }]}>
              <View style={styles.nodeCircle}>
                <Text style={styles.nodeEmoji}>🍴</Text>
              </View>
              <Text style={styles.nodeLabel}>Restoran</Text>
            </View>

            {/* Bottom Node: Doğa */}
            <View style={[styles.milestoneNode, { bottom: 25, left: width * 0.38 }]}>
              <View style={styles.nodeCircle}>
                <Text style={styles.nodeEmoji}>🏔️</Text>
              </View>
              <Text style={styles.nodeLabel}>Doğa</Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.primaryActionButton}
            onPress={handleRouteCreate}
            disabled={isGenerating}
            activeOpacity={0.85}
          >
            {isGenerating ? (
              <ActivityIndicator color="#ffffff" size="small" />
            ) : (
              <Text style={styles.primaryActionButtonText}>Rotayı Oluştur ➔</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Card 2: Ulaşım ve Konaklama Planla */}
        <View style={styles.card}>
          <View style={styles.transportHeaderIcons}>
            <Text style={styles.headerEmojiIcon}>🏠</Text>
            <Text style={styles.headerEmojiIcon}>✈️</Text>
          </View>

          <Text style={styles.cardTitle}>Ulaşım ve Konaklama Planla</Text>

          <View style={styles.formSection}>
            {/* Kişi Sayısı */}
            <View style={styles.formRow}>
              <Text style={styles.formLabel}>Kişi Sayısı</Text>
              <View style={styles.stepperContainer}>
                <TouchableOpacity
                  style={styles.stepperButton}
                  onPress={() => setGuestCount((prev) => Math.max(1, prev - 1))}
                >
                  <Text style={styles.stepperButtonText}>-</Text>
                </TouchableOpacity>
                <Text style={styles.stepperValue}>{guestCount}</Text>
                <TouchableOpacity
                  style={styles.stepperButton}
                  onPress={() => setGuestCount((prev) => prev + 1)}
                >
                  <Text style={styles.stepperButtonText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Bütçe Aralığı */}
            <View style={styles.formBlock}>
              <View style={styles.labelRow}>
                <Text style={styles.formLabel}>Bütçe Aralığı</Text>
                <Text style={styles.budgetValueText}>
                  ₺1.500 - ₺{budgetMax.toLocaleString("tr-TR")}
                </Text>
              </View>
              <TouchableOpacity
                style={styles.budgetTrack}
                onPress={() => {
                  setBudgetMax((prev) => (prev >= 15000 ? 4000 : prev + 2500));
                }}
                activeOpacity={0.8}
              >
                <View style={styles.budgetFilledTrack} />
                <View style={[styles.budgetThumb, { left: 20 }]} />
                <View style={[styles.budgetThumb, { right: 20 }]} />
              </TouchableOpacity>
            </View>

            {/* Aranılan Tür */}
            <View style={styles.formBlock}>
              <Text style={styles.formLabel}>Aranılan Tür</Text>
              <TouchableOpacity
                style={styles.dropdownPickerBox}
                onPress={() => {
                  const nextIdx =
                    (accommodationTypes.indexOf(accommodationType) + 1) %
                    accommodationTypes.length;
                  setAccommodationType(accommodationTypes[nextIdx]);
                }}
                activeOpacity={0.7}
              >
                <Text style={styles.dropdownPickerIcon}>🚗</Text>
                <Text style={styles.dropdownPickerText}>{accommodationType}</Text>
                <Text style={styles.dropdownPickerChevron}>⌄</Text>
              </TouchableOpacity>
            </View>

            {/* Hızlı Etiketler */}
            <View style={styles.formBlock}>
              <Text style={styles.formLabel}>Hızlı Etiketler</Text>
              <View style={styles.pillsRow}>
                {tags.map((tag) => {
                  const isSelected = selectedTag === tag;
                  return (
                    <TouchableOpacity
                      key={tag}
                      onPress={() => setSelectedTag(tag)}
                      style={[
                        styles.tagPill,
                        isSelected && styles.tagPillSelected,
                      ]}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.tagPillText,
                          isSelected && styles.tagPillTextSelected,
                        ]}
                      >
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>

          {planGenerated && (
            <View style={styles.feedbackBannerSuccess}>
              <Text style={styles.feedbackBannerSuccessText}>
                ✓ {guestCount} kişi için {selectedTag} {accommodationType} planı hazırlandı!
              </Text>
            </View>
          )}

          <TouchableOpacity
            style={styles.primaryActionButton}
            onPress={() => {
              setPlanGenerated(true);
              setTimeout(() => setPlanGenerated(false), 3000);
            }}
            activeOpacity={0.85}
          >
            <Text style={styles.primaryActionButtonText}>Planı Gör ✓</Text>
          </TouchableOpacity>
        </View>

        {/* ========================================================================= */}
        {/* MOBILE PLACE DISCOVERY SECTION */}
        {/* ========================================================================= */}
        <View style={styles.discoverySection}>
          <View style={styles.discoveryHeader}>
            <View style={styles.discoveryBadge}>
              <Text style={styles.discoveryBadgeText}>🧭 Şehri Keşfet</Text>
            </View>
            <Text style={styles.discoveryTitle}>Öne Çıkan Noktalar</Text>
            <Text style={styles.discoverySubtitle}>
              Farklı şehirlerin en popüler tarihi yerleri, müzeleri ve restoranları
            </Text>
          </View>

          {/* Horizontal City Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.cityScroll}
          >
            <TouchableOpacity
              onPress={() => setSelectedCity("all")}
              style={[
                styles.cityPill,
                selectedCity === "all" && styles.cityPillActive,
              ]}
              activeOpacity={0.8}
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
                  style={[
                    styles.cityPill,
                    isSelected && styles.cityPillActive,
                  ]}
                  activeOpacity={0.8}
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

          {/* Horizontal Category Filter Pills */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoryScroll}
          >
            {categoriesList.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              return (
                <TouchableOpacity
                  key={cat.id}
                  onPress={() => setSelectedCategory(cat.id)}
                  style={[
                    styles.categoryPill,
                    isSelected && styles.categoryPillActive,
                  ]}
                  activeOpacity={0.8}
                >
                  <Text style={styles.categoryPillIcon}>{cat.icon}</Text>
                  <Text
                    style={[
                      styles.categoryPillText,
                      isSelected && styles.categoryPillTextActive,
                    ]}
                  >
                    {cat.label}
                  </Text>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Places List */}
          {filteredPlaces.length === 0 ? (
            <View style={styles.emptyBox}>
              <Text style={styles.emptyIcon}>🔍</Text>
              <Text style={styles.emptyTitle}>Mekan Bulunamadı</Text>
              <Text style={styles.emptySubtitle}>
                Filtrelerinizi değiştirerek tekrar deneyin.
              </Text>
            </View>
          ) : (
            <View style={styles.placesList}>
              {filteredPlaces.map((place) => (
                <PlaceCard
                  key={place.id}
                  place={place}
                  onPress={(p) =>
                    router.push({
                      pathname: "/places/[slug]",
                      params: { slug: p.slug },
                    })
                  }
                  onAddToTrip={(p) => {
                    Alert.alert("Başarılı! 🎉", `"${p.name}" rotanıza eklendi.`);
                  }}
                />
              ))}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Bottom Navigation Bar */}
      <View style={styles.bottomNavContainer}>
        <TouchableOpacity
          style={styles.bottomNavTab}
          onPress={handleExplorePress}
          activeOpacity={0.7}
        >
          <Text style={styles.bottomNavIcon}>🗺️</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomNavPlusButton}
          onPress={() => setIsShareModalOpen(true)}
          activeOpacity={0.85}
        >
          <Text style={styles.plusButtonText}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.bottomNavTab}
          onPress={handleHomePress}
          activeOpacity={0.7}
        >
          <Text style={[styles.bottomNavIcon, styles.activeHomeIcon]}>🏠</Text>
        </TouchableOpacity>
      </View>

      <RoutePlanModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        itinerary={generatedItinerary}
      />

      <SharePostModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        onPostCreated={() => {
          Alert.alert(
            "Paylaşıldı! 🎉",
            "Seyahat anınız Gezgin Topluluğu'na eklendi. 'Topluluk' sekmesinden görüntüleyebilirsiniz!",
            [
              { text: "Kapat", style: "cancel" },
              {
                text: "Topluluğa Git",
                onPress: () => router.push("/community"),
              },
            ]
          );
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  avatarButton: {
    padding: 2,
  },
  avatarCircle: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#0047ba",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#ffffff",
    shadowColor: "#0047ba",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  avatarText: {
    color: "#ffffff",
    fontWeight: "700",
    fontSize: 18,
  },
  searchBar: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 30,
    paddingHorizontal: 16,
    height: 52,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 15,
    color: "#0f172a",
    fontWeight: "500",
  },
  clearSearchText: {
    fontSize: 16,
    color: "#94a3b8",
    paddingHorizontal: 8,
  },
  card: {
    backgroundColor: "#ffffff",
    borderRadius: 24,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: "800",
    color: "#0047ba",
    textAlign: "center",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
    marginBottom: 16,
  },
  windingRoadBox: {
    height: 240,
    borderRadius: 18,
    backgroundColor: "#0284c7",
    overflow: "hidden",
    position: "relative",
    marginBottom: 16,
  },
  milestoneNode: {
    position: "absolute",
    alignItems: "center",
  },
  nodeCircle: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#ffffff",
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "rgba(255, 255, 255, 0.8)",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  nodeEmoji: {
    fontSize: 20,
  },
  nodeLabel: {
    color: "#ffffff",
    fontSize: 11,
    fontWeight: "700",
    marginTop: 4,
  },
  transportHeaderIcons: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginBottom: 6,
  },
  headerEmojiIcon: {
    fontSize: 22,
  },
  formSection: {
    marginVertical: 12,
    gap: 16,
  },
  formRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  formBlock: {
    gap: 6,
  },
  labelRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  formLabel: {
    fontSize: 14,
    fontWeight: "700",
    color: "#0f172a",
  },
  budgetValueText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#0047ba",
  },
  stepperContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  stepperButton: {
    width: 32,
    height: 32,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8fafc",
  },
  stepperButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#0f172a",
  },
  stepperValue: {
    fontSize: 15,
    fontWeight: "700",
    color: "#0f172a",
    minWidth: 24,
    textAlign: "center",
  },
  budgetTrack: {
    height: 8,
    backgroundColor: "#e0f2fe",
    borderRadius: 4,
    position: "relative",
    justifyContent: "center",
    marginVertical: 10,
  },
  budgetFilledTrack: {
    position: "absolute",
    left: 20,
    right: 20,
    height: 8,
    backgroundColor: "#0047ba",
    borderRadius: 4,
  },
  budgetThumb: {
    position: "absolute",
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: "#0047ba",
    borderWidth: 3,
    borderColor: "#ffffff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 3,
  },
  dropdownPickerBox: {
    flexDirection: "row",
    alignItems: "center",
    height: 46,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: "#ffffff",
  },
  dropdownPickerIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  dropdownPickerText: {
    flex: 1,
    fontSize: 14,
    fontWeight: "600",
    color: "#0f172a",
  },
  dropdownPickerChevron: {
    fontSize: 16,
    color: "#64748b",
  },
  pillsRow: {
    flexDirection: "row",
    gap: 8,
  },
  tagPill: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    backgroundColor: "#ffffff",
  },
  tagPillSelected: {
    backgroundColor: "#0047ba",
    borderColor: "#0047ba",
  },
  tagPillText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
  },
  tagPillTextSelected: {
    color: "#ffffff",
  },
  primaryActionButton: {
    backgroundColor: "#0047ba",
    borderRadius: 16,
    height: 52,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 8,
    shadowColor: "#0047ba",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },
  primaryActionButtonText: {
    color: "#ffffff",
    fontSize: 16,
    fontWeight: "800",
  },
  feedbackBannerSuccess: {
    backgroundColor: "#ecfdf5",
    borderWidth: 1,
    borderColor: "#a7f3d0",
    borderRadius: 12,
    padding: 10,
    marginBottom: 10,
  },
  feedbackBannerSuccessText: {
    color: "#065f46",
    fontSize: 12,
    fontWeight: "600",
    textAlign: "center",
  },
  discoverySection: {
    marginTop: 10,
    marginBottom: 20,
  },
  discoveryHeader: {
    marginBottom: 14,
  },
  discoveryBadge: {
    alignSelf: "flex-start",
    backgroundColor: "#e0f2fe",
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 6,
  },
  discoveryBadgeText: {
    fontSize: 11,
    fontWeight: "800",
    color: "#0369a1",
  },
  discoveryTitle: {
    fontSize: 20,
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: -0.5,
  },
  discoverySubtitle: {
    fontSize: 12,
    color: "#64748b",
    marginTop: 2,
  },
  cityScroll: {
    gap: 6,
    paddingVertical: 4,
    marginBottom: 8,
  },
  cityPill: {
    backgroundColor: "#f1f5f9",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  cityPillActive: {
    backgroundColor: "#0f172a",
  },
  cityPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },
  cityPillTextActive: {
    color: "#ffffff",
  },
  categoryScroll: {
    gap: 8,
    paddingVertical: 6,
    marginBottom: 16,
  },
  categoryPill: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  categoryPillActive: {
    backgroundColor: "#0047ba",
    borderColor: "#0047ba",
  },
  categoryPillIcon: {
    fontSize: 12,
    marginRight: 6,
  },
  categoryPillText: {
    fontSize: 12,
    fontWeight: "700",
    color: "#475569",
  },
  categoryPillTextActive: {
    color: "#ffffff",
  },
  emptyBox: {
    backgroundColor: "#ffffff",
    borderRadius: 20,
    padding: 30,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  emptyIcon: {
    fontSize: 32,
    marginBottom: 8,
  },
  emptyTitle: {
    fontSize: 15,
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: 4,
  },
  emptySubtitle: {
    fontSize: 12,
    color: "#64748b",
    textAlign: "center",
  },
  placesList: {
    marginTop: 4,
  },
  bottomNavContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 72,
    backgroundColor: "#ffffff",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-around",
    paddingHorizontal: 8,
    borderTopWidth: 1,
    borderTopColor: "#f1f5f9",
    shadowColor: "#0f172a",
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 8,
  },
  bottomNavTab: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
    flex: 1,
  },
  bottomNavIcon: {
    fontSize: 20,
    marginBottom: 2,
  },
  activeHomeIcon: {
    transform: [{ scale: 1.15 }],
  },
  bottomNavPlusButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: "#0047ba",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
    shadowColor: "#0047ba",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
    elevation: 6,
  },
  plusButtonText: {
    fontSize: 28,
    fontWeight: "300",
    color: "#ffffff",
    lineHeight: 30,
  },
});
