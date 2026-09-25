import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, Modal, TextInput, StyleSheet, FlatList, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { useAuth } from "@/context/auth-context";
import { getTripsByUser, getDestinations, createTrip } from "@gezgin/supabase-queries";
import { createTripSchema } from "@gezgin/validation";
import type { Trip, Destination } from "@gezgin/types";

export function TripsList() {
  const router = useRouter();
  const { user, supabase } = useAuth();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  
  // Form state
  const [title, setTitle] = useState("");
  const [destinationId, setDestinationId] = useState("");
  const [tripType, setTripType] = useState<"day_trip" | "multi_day">("day_trip");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchData() {
      if (!user || !supabase) return;
      try {
        const [fetchedTrips, fetchedDestinations] = await Promise.all([
          getTripsByUser(supabase, user.id),
          getDestinations(supabase),
        ]);
        setTrips(fetchedTrips);
        setDestinations(fetchedDestinations);
        if (fetchedDestinations.length > 0) {
          setDestinationId(fetchedDestinations[0].id);
        }
        
        // Default dates for the form
        const today = new Date().toISOString().split("T")[0];
        setStartDate(today);
        setEndDate(today);
      } catch (err) {
        console.error("Failed to fetch trips data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [user, supabase]);

  const handleCreateTrip = async () => {
    if (!user || !supabase) return;
    setError(null);
    setIsCreating(true);

    try {
      const finalEndDate = tripType === "day_trip" ? startDate : endDate;
      const input = {
        title,
        destinationId,
        tripType,
        startDate,
        endDate: finalEndDate,
        pace: "balanced" as const,
        budgetLevel: "medium" as const,
      };

      const result = createTripSchema.safeParse(input);
      if (!result.success) {
        setError(result.error.errors[0].message);
        setIsCreating(false);
        return;
      }

      const newTrip = await createTrip(supabase, user.id, result.data);
      setTrips([...trips, newTrip]);
      setShowModal(false);
      setTitle("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create trip");
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return <ActivityIndicator style={{ marginVertical: 20 }} color="#0284c7" />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Trips</Text>
        <TouchableOpacity style={styles.createBtn} onPress={() => setShowModal(true)}>
          <Text style={styles.createBtnText}>+ Create</Text>
        </TouchableOpacity>
      </View>

      {trips.length === 0 ? (
        <Text style={styles.emptyText}>You haven't created any trips yet.</Text>
      ) : (
        <FlatList
          data={trips}
          keyExtractor={(t) => t.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity 
              style={styles.card} 
              onPress={() => router.push(`/trips/${item.id}`)}
              activeOpacity={0.7}
            >
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardSubtitle}>
                {item.trip_type === "day_trip" ? "Day Trip" : "Multi-day Trip"} • {item.start_date}
              </Text>
            </TouchableOpacity>
          )}
        />
      )}

      {/* Modal is a simple overlay for creation */}
      <Modal visible={showModal} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Create New Trip</Text>
            
            {error && <Text style={styles.errorText}>{error}</Text>}

            <Text style={styles.label}>Destination</Text>
            {destinations.length > 0 ? (
              <View style={styles.pickerContainer}>
                <Text style={styles.pickerText}>{destinations.find(d => d.id === destinationId)?.name || "Select"}</Text>
                {/* For simplicity on mobile, we just pick the first destination if there's no native picker setup easily */}
              </View>
            ) : null}

            <Text style={styles.label}>Title</Text>
            <TextInput
              style={styles.input}
              value={title}
              onChangeText={setTitle}
              placeholder="e.g., Weekend in Istanbul"
            />

            <Text style={styles.label}>Trip Type</Text>
            <View style={styles.row}>
              <TouchableOpacity 
                style={[styles.chip, tripType === "day_trip" && styles.chipActive]} 
                onPress={() => setTripType("day_trip")}
              >
                <Text style={tripType === "day_trip" ? styles.chipTextActive : styles.chipText}>Day Trip</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={[styles.chip, tripType === "multi_day" && styles.chipActive]} 
                onPress={() => setTripType("multi_day")}
              >
                <Text style={tripType === "multi_day" ? styles.chipTextActive : styles.chipText}>Multi-day</Text>
              </TouchableOpacity>
            </View>

            <Text style={styles.label}>Start Date (YYYY-MM-DD)</Text>
            <TextInput
              style={styles.input}
              value={startDate}
              onChangeText={setStartDate}
              placeholder="2026-09-10"
            />

            {tripType === "multi_day" && (
              <>
                <Text style={styles.label}>End Date (YYYY-MM-DD)</Text>
                <TextInput
                  style={styles.input}
                  value={endDate}
                  onChangeText={setEndDate}
                  placeholder="2026-09-12"
                />
              </>
            )}

            <View style={styles.actions}>
              <TouchableOpacity style={styles.cancelBtn} onPress={() => setShowModal(false)}>
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.saveBtn} onPress={handleCreateTrip} disabled={isCreating}>
                {isCreating ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveBtnText}>Create</Text>}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 20,
    paddingTop: 20,
    borderTopWidth: 1,
    borderColor: "#e2e8f0",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 18,
    fontWeight: "700",
    color: "#0f172a",
  },
  createBtn: {
    backgroundColor: "#0284c7",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  createBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
  emptyText: {
    color: "#64748b",
  },
  card: {
    backgroundColor: "#fff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#0f172a",
    marginBottom: 4,
  },
  cardSubtitle: {
    fontSize: 13,
    color: "#64748b",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    padding: 20,
  },
  modalContent: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 16,
  },
  errorText: {
    color: "#ef4444",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 6,
    color: "#0f172a",
    marginTop: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 10,
    fontSize: 15,
  },
  pickerContainer: {
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    padding: 12,
    backgroundColor: "#f8fafc",
  },
  pickerText: {
    fontSize: 15,
  },
  row: {
    flexDirection: "row",
    gap: 10,
  },
  chip: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    borderRadius: 8,
    alignItems: "center",
  },
  chipActive: {
    backgroundColor: "#e0f2fe",
    borderColor: "#0284c7",
  },
  chipText: {
    color: "#64748b",
  },
  chipTextActive: {
    color: "#0284c7",
    fontWeight: "600",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 20,
    gap: 10,
  },
  cancelBtn: {
    padding: 12,
  },
  cancelBtnText: {
    color: "#64748b",
    fontWeight: "600",
  },
  saveBtn: {
    backgroundColor: "#0284c7",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  saveBtnText: {
    color: "#fff",
    fontWeight: "600",
  },
});
