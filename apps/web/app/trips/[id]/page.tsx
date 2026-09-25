"use client";

import React, { useState, useEffect, useMemo } from "react";
import dynamic from "next/dynamic";
import { useParams, useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import { getTripWithDetails, reorderTripDayStops, removeStopFromTripDay } from "@gezgin/supabase-queries";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  useSortable,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import type { TripWithDays, TripStop, Place } from "@gezgin/types";

const TripMap = dynamic(() => import("@/components/TripMap"), {
  ssr: false,
  loading: () => (
    <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", backgroundColor: "#f8fafc" }}>
      Loading Map...
    </div>
  ),
});

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

// Sortable item component
function SortableStopItem({ stop, index, onDelete }: { stop: TripStop & { place: Place }, index: number, onDelete: (id: string) => void }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: stop.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="profile-card"
    >
      <div style={{ display: "flex", alignItems: "flex-start", gap: "1rem" }}>
        <div 
          {...attributes} 
          {...listeners} 
          style={{ cursor: "grab", fontSize: "1.5rem", color: "#cbd5e1", padding: "0.5rem" }}
        >
          ⋮⋮
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <h4 style={{ margin: 0 }}>{index + 1}. {stop.place.name}</h4>
            <button 
              onClick={() => onDelete(stop.id)}
              style={{ background: "none", border: "none", color: "#ef4444", cursor: "pointer", padding: "0.25rem" }}
              title="Remove stop"
            >
              ✕
            </button>
          </div>
          
          <div style={{ display: "flex", gap: "1rem", marginTop: "0.5rem", fontSize: "0.9rem", color: "var(--text-dim)" }}>
            <div>🕒 Arrive: {formatTime(stop.start_time)}</div>
            <div>⏱️ Duration: {stop.duration_minutes || 60} min</div>
          </div>
          
          {stop.notes && (
            <div style={{ marginTop: "0.5rem", fontSize: "0.85rem", backgroundColor: "#f1f5f9", padding: "0.5rem", borderRadius: "6px" }}>
              {stop.notes}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}


export default function TripBuilderPage() {
  const params = useParams();
  const router = useRouter();
  const { user, supabase, isLoading: authLoading } = useAuth();
  
  const tripId = params.id as string;
  const [trip, setTrip] = useState<TripWithDays | null>(null);
  const [activeDayId, setActiveDayId] = useState<string | null>(null);
  
  // Local state for optimistic drag & drop
  const [localStops, setLocalStops] = useState<(TripStop & { place: Place })[]>([]);
  const [isSaving, setIsSaving] = useState(false);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  useEffect(() => {
    async function loadTrip() {
      if (!user || !supabase || !tripId) return;
      try {
        const data = await getTripWithDetails(supabase as any, tripId);
        setTrip(data);
        if (data?.days && data.days.length > 0) {
          const firstDay = data.days[0];
          setActiveDayId(firstDay.id);
          setLocalStops(firstDay.stops);
        }
      } catch (err) {
        console.error("Failed to load trip:", err);
      }
    }
    loadTrip();
  }, [user, supabase, tripId]);

  // Handle switching days
  const handleDaySelect = (dayId: string) => {
    setActiveDayId(dayId);
    const day = trip?.days.find(d => d.id === dayId);
    if (day) {
      setLocalStops(day.stops);
    }
  };

  // Recalculate schedule based on order and travel times
  const recalculatedStops = useMemo(() => {
    if (!localStops.length) return [];
    
    // We assume a fixed 15 min travel time between stops for now.
    // The first stop starts at trip's start_time or 09:00.
    const TRAVEL_TIME = 15;
    let currentTime = trip?.start_time || "09:00";
    
    return localStops.map((stop, index) => {
      const updatedStop = { ...stop, start_time: currentTime };
      const duration = stop.duration_minutes || 60; // default 1 hr
      currentTime = addMinutesToTime(currentTime, duration + TRAVEL_TIME);
      return updatedStop;
    });
  }, [localStops, trip?.start_time]);

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id || !activeDayId) return;

    const oldIndex = localStops.findIndex((s) => s.id === active.id);
    const newIndex = localStops.findIndex((s) => s.id === over.id);

    // Optimistic update
    const newStops = arrayMove(localStops, oldIndex, newIndex);
    setLocalStops(newStops);
    
    setIsSaving(true);
    try {
      if (supabase) {
        await reorderTripDayStops(supabase as any, activeDayId, newStops.map(s => s.id));
      }
    } catch (err) {
      console.error("Failed to reorder stops:", err);
      // Revert on error
      setLocalStops(localStops);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDeleteStop = async (stopId: string) => {
    if (!confirm("Are you sure you want to remove this stop?")) return;
    
    // Optimistic delete
    const newStops = localStops.filter(s => s.id !== stopId);
    setLocalStops(newStops);
    
    setIsSaving(true);
    try {
      if (supabase) {
        await removeStopFromTripDay(supabase as any, stopId);
      }
    } catch (err) {
      console.error("Failed to remove stop:", err);
      setLocalStops(localStops); // Revert
    } finally {
      setIsSaving(false);
    }
  };

  if (authLoading || !trip) {
    return <div style={{ padding: "2rem", textAlign: "center" }}>Loading trip...</div>;
  }

  return (
    <div style={{ display: "flex", height: "calc(100vh - 64px)", overflow: "hidden" }}>
      {/* Left Sidebar: Itinerary Builder */}
      <div style={{ width: "450px", minWidth: "400px", display: "flex", flexDirection: "column", borderRight: "1px solid var(--border)", backgroundColor: "var(--bg)", zIndex: 10 }}>
        
        {/* Header */}
        <div style={{ padding: "1.5rem", borderBottom: "1px solid var(--border)" }}>
          <button onClick={() => router.back()} className="btn btn-secondary" style={{ padding: "0.25rem 0.5rem", marginBottom: "1rem" }}>
            ← Back
          </button>
          <h2 style={{ margin: "0 0 0.5rem 0" }}>{trip.title}</h2>
          <p style={{ margin: 0, color: "var(--text-dim)", fontSize: "0.9rem" }}>
            {trip.start_date} to {trip.end_date} • {trip.pace} pace
          </p>
        </div>

        {/* Days Tabs */}
        <div style={{ display: "flex", overflowX: "auto", borderBottom: "1px solid var(--border)", padding: "0.5rem", gap: "0.5rem" }}>
          {trip.days.map((day, idx) => (
            <button
              key={day.id}
              onClick={() => handleDaySelect(day.id)}
              style={{
                padding: "0.5rem 1rem",
                borderRadius: "20px",
                border: "none",
                cursor: "pointer",
                backgroundColor: activeDayId === day.id ? "var(--primary)" : "#f1f5f9",
                color: activeDayId === day.id ? "white" : "var(--text)",
                fontWeight: activeDayId === day.id ? "600" : "normal",
                whiteSpace: "nowrap"
              }}
            >
              Day {idx + 1} ({day.trip_date})
            </button>
          ))}
        </div>

        {/* Stops List */}
        <div style={{ flex: 1, overflowY: "auto", padding: "1rem", backgroundColor: "#f8fafc" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
            <h3 style={{ margin: 0 }}>Itinerary</h3>
            {isSaving && <span style={{ fontSize: "0.8rem", color: "var(--primary)" }}>Saving...</span>}
          </div>
          
          {recalculatedStops.length === 0 ? (
            <div style={{ textAlign: "center", padding: "2rem", color: "var(--text-dim)" }}>
              No stops added to this day yet.<br/><br/>
              Explore places and add them to your trip!
            </div>
          ) : (
            <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
              <SortableContext items={recalculatedStops.map(s => s.id)} strategy={verticalListSortingStrategy}>
                <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                  {recalculatedStops.map((stop, index) => (
                    <SortableStopItem 
                      key={stop.id} 
                      stop={stop} 
                      index={index} 
                      onDelete={handleDeleteStop} 
                    />
                  ))}
                </div>
              </SortableContext>
            </DndContext>
          )}
        </div>
      </div>

      {/* Right Map Pane */}
      <div style={{ flex: 1, position: "relative" }}>
        <TripMap stops={recalculatedStops} />
      </div>
    </div>
  );
}
