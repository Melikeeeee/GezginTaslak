import React, { useState, useEffect, useMemo } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import MapView, { Marker, Polyline } from "react-native-maps";
import DraggableFlatList, { RenderItemParams, ScaleDecorator } from "react-native-draggable-flatlist";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { useAuth } from "@/context/auth-context";
import { getTripWithDetails, reorderTripDayStops, removeStopFromTripDay } from "@gezgin/supabase-queries";
import type { TripWithDays, TripStop, Place } from "@gezgin/types";

// Helper to format time strings
function formatTime(timeStr: string | null) {
  if (!timeStr) return "--:--";
  return timeStr.slice(0, 5); // HH:mm:ss -> HH:mm
}

// Add minutes to "HH:mm" time string
function addMinutesToTime(timeStr: string, minutes: number) {
  const [hours, mins] = timeStr.split(":").map(Number);
  const date = new Date();
  date.setHours(hours, mins + minutes, 0, 0);
  return date.toTimeString().slice(0, 5);
}

export default function MobileTripBuilderScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const { user, supabase } = useAuth();
  
  const [trip, setTrip] = useState<TripWithDays | null>(null);
  const [activeDayId, setActiveDayId] = useState<string | null>(null);
  
  // Local state for optimistic drag & drop
  const [localStops, setLocalStops] = useState<(TripStop & { place: Place })[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    async function loadTrip() {
      if (!user || !supabase || !id) return;
      try {
        const data = await getTripWithDetails(supabase, id);
        setTrip(data);
        if (data?.days && data.days.length > 0) {
          setActiveDayId(data.days[0].id);
          setLocalStops(data.days[0].stops);
        }
      } catch (err) {
        console.error("Failed to load trip:", err);
      }
    }
    loadTrip();
  }, [user, supabase, id]);

  const handleDaySelect = (dayId: string) => {
    setActiveDayId(dayId);
    const day = trip?.days.find(d => d.id === dayId);
    if (day) {
      setLocalStops(day.stops);
    }
  };

  // Recalculate schedule
  const recalculatedStops = useMemo(() => {
    if (!localStops.length) return [];
    
    const TRAVEL_TIME = 15;
    let currentTime = trip?.start_time || "09:00";
    
    return localStops.map((stop) => {
      const updatedStop = { ...stop, start_time: currentTime };
      const duration = stop.duration_minutes || 60;
      currentTime = addMinutesToTime(currentTime, duration + TRAVEL_TIME);
      return updatedStop;
    });
  }, [localStops, trip?.start_time]);

  const handleDragEnd = async ({ data }: { data: (TripStop & { place: Place })[] }) => {
    if (!activeDayId) return;
    
    // Optimistic update
    setLocalStops(data);
    
    setIsSaving(true);
    try {
      if (supabase) {
        await reorderTripDayStops(supabase, activeDayId, data.map(s => s.id));
      }
    } catch (err) {
      console.error("Failed to reorder stops:", err);
      // Might want to reload trip here on error
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteStop = (stopId: string) => {
    Alert.alert("Remove Stop", "Are you sure you want to remove this stop from your itinerary?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Remove", 
        style: "destructive",
        onPress: async () => {
          const newStops = localStops.filter(s => s.id !== stopId);
          setLocalStops(newStops);
          
          setIsSaving(true);
          try {
            if (supabase) {
              await removeStopFromTripDay(supabase, stopId);
            }
          } catch (err) {
            console.error("Failed to remove stop:", err);
          } finally {
            setIsSaving(false);
          }
        }
      }
    ]);
  };

  const mapCoordinates = recalculatedStops
    .filter(s => s.place.latitude && s.place.longitude)
    .map(s => ({
      latitude: s.place.latitude!,
      longitude: s.place.longitude!
    }));

  const initialRegion = mapCoordinates.length > 0 
    ? {
        latitude: mapCoordinates[0].latitude,
        longitude: mapCoordinates[0].longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      }
    : {
        latitude: 41.0082,
        longitude: 28.9784,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };

  const renderItem = ({ item, drag, isActive, getIndex }: RenderItemParams<TripStop & { place: Place }>) => {
    const index = getIndex();
    return (
      <ScaleDecorator>
        <TouchableOpacity
          onLongPress={drag}
          disabled={isActive}
          style={[
            styles.stopItem,
            { backgroundColor: isActive ? "#e0f2fe" : "#ffffff" }
          ]}
        >
          <View style={styles.dragHandle}>
            <Text style={styles.dragIcon}>⋮⋮</Text>
          </View>
          
          <View style={styles.stopInfo}>
            <View style={styles.stopHeaderRow}>
              <Text style={styles.stopName}>{index !== undefined ? index + 1 : ""}. {item.place.name}</Text>
              <TouchableOpacity onPress={() => handleDeleteStop(item.id)} style={styles.deleteBtn}>
                <Text style={styles.deleteBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
            
            <View style={styles.stopMetaRow}>
              <Text style={styles.stopMetaText}>🕒 Arrive: {formatTime(item.start_time)}</Text>
              <Text style={styles.stopMetaText}>⏱️ {item.duration_minutes || 60} min</Text>
            </View>
          </View>
        </TouchableOpacity>
      </ScaleDecorator>
    );
  };

  if (!trip) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading trip details...</Text>
      </View>
    );
  }

  return (
    <GestureHandlerRootView style={styles.container}>
      {/* Top Map View */}
      <View style={styles.mapContainer}>
        <MapView 
          style={styles.map} 
          initialRegion={initialRegion}
        >
          {recalculatedStops.map((stop, index) => {
            if (!stop.place.latitude || !stop.place.longitude) return null;
            return (
              <Marker
                key={stop.id}
                coordinate={{ latitude: stop.place.latitude, longitude: stop.place.longitude }}
                title={`${index + 1}. ${stop.place.name}`}
                description={`Arrive: ${formatTime(stop.start_time)}`}
              />
            );
          })}
          {mapCoordinates.length > 1 && (
            <Polyline
              coordinates={mapCoordinates}
              strokeColor="#0284c7"
              strokeWidth={4}
            />
          )}
        </MapView>
        
        {/* Floating Back Button */}
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
      </View>

      {/* Middle: Days Selector */}
      <View style={styles.daysSelectorContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.daysScroll}>
          {trip.days.map((day, idx) => (
            <TouchableOpacity
              key={day.id}
              style={[styles.dayTab, activeDayId === day.id && styles.dayTabActive]}
              onPress={() => handleDaySelect(day.id)}
            >
              <Text style={[styles.dayTabText, activeDayId === day.id && styles.dayTabTextActive]}>
                Day {idx + 1}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {isSaving && <Text style={styles.savingText}>Saving...</Text>}
      </View>

      {/* Bottom: Draggable List */}
      <View style={styles.listContainer}>
        {recalculatedStops.length === 0 ? (
          <View style={styles.centerContainer}>
            <Text style={styles.emptyText}>No stops added to this day.</Text>
            <Text style={styles.emptyTextHint}>Add places to your itinerary to see them here.</Text>
          </View>
        ) : (
          <DraggableFlatList
            data={recalculatedStops}
            onDragEnd={handleDragEnd}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={styles.listContent}
          />
        )}
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8fafc",
  },
  centerContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  mapContainer: {
    height: "40%",
    width: "100%",
    position: "relative",
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#ffffff",
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  backButtonText: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0f172a",
  },
  daysSelectorContainer: {
    backgroundColor: "#ffffff",
    borderBottomWidth: 1,
    borderColor: "#e2e8f0",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingRight: 15,
  },
  daysScroll: {
    padding: 10,
    gap: 10,
  },
  dayTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
  },
  dayTabActive: {
    backgroundColor: "#0284c7",
  },
  dayTabText: {
    color: "#64748b",
    fontWeight: "600",
  },
  dayTabTextActive: {
    color: "#ffffff",
  },
  savingText: {
    fontSize: 12,
    color: "#0284c7",
    fontWeight: "600",
  },
  listContainer: {
    flex: 1,
  },
  listContent: {
    padding: 15,
    paddingBottom: 40,
  },
  stopItem: {
    flexDirection: "row",
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  dragHandle: {
    justifyContent: "center",
    alignItems: "center",
    paddingRight: 15,
  },
  dragIcon: {
    fontSize: 24,
    color: "#cbd5e1",
  },
  stopInfo: {
    flex: 1,
  },
  stopHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 6,
  },
  stopName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    flex: 1,
  },
  deleteBtn: {
    padding: 4,
  },
  deleteBtnText: {
    color: "#ef4444",
    fontSize: 16,
    fontWeight: "600",
  },
  stopMetaRow: {
    flexDirection: "row",
    gap: 15,
  },
  stopMetaText: {
    fontSize: 13,
    color: "#64748b",
  },
  emptyText: {
    fontSize: 16,
    color: "#0f172a",
    marginBottom: 8,
  },
  emptyTextHint: {
    fontSize: 14,
    color: "#64748b",
    textAlign: "center",
  },
});
