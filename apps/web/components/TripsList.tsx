"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useAuth } from "@/context/auth-context";
import { getTripsByUser, getDestinations, createTrip } from "@gezgin/supabase-queries";
import { createTripSchema } from "@gezgin/validation";
import type { Trip, Destination } from "@gezgin/types";

export function TripsList() {
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
          getTripsByUser(supabase as any, user.id),
          getDestinations(supabase as any),
        ]);
        setTrips(fetchedTrips);
        setDestinations(fetchedDestinations);
        if (fetchedDestinations.length > 0) {
          setDestinationId(fetchedDestinations[0].id);
        }
      } catch (err) {
        console.error("Failed to fetch trips data:", err);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, [user, supabase]);

  const handleCreateTrip = async (e: React.FormEvent) => {
    e.preventDefault();
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

      const newTrip = await createTrip(supabase as any, user.id, result.data);
      setTrips([...trips, newTrip]);
      setShowModal(false);
      // Reset form
      setTitle("");
      setStartDate("");
      setEndDate("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create trip");
    } finally {
      setIsCreating(false);
    }
  };

  if (isLoading) {
    return <div className="spinner spinner-primary" style={{ width: 24, height: 24, margin: "2rem auto" }} />;
  }

  return (
    <div style={{ marginTop: "2rem", paddingTop: "2rem", borderTop: "1px solid var(--border)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
        <h3>My Trips</h3>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          Create Trip
        </button>
      </div>

      {trips.length === 0 ? (
        <p style={{ color: "var(--text-dim)" }}>You haven't created any trips yet.</p>
      ) : (
        <div style={{ display: "grid", gap: "1rem", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))" }}>
          {trips.map((trip) => (
            <Link key={trip.id} href={`/trips/${trip.id}`} style={{ textDecoration: "none" }}>
              <div className="profile-card" style={{ cursor: "pointer", transition: "transform 0.2s" }}>
                <h4 style={{ margin: "0 0 0.5rem 0", color: "var(--text)" }}>{trip.title}</h4>
                <div style={{ fontSize: "0.85rem", color: "var(--text-dim)" }}>
                  {trip.trip_type === "day_trip" ? "Day Trip" : "Multi-day Trip"} • {trip.start_date}
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-overlay" onClick={() => setShowModal(false)} style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ backgroundColor: "var(--bg)", padding: "2rem", borderRadius: "12px", width: "100%", maxWidth: "500px" }}>
            <div className="modal-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1.5rem" }}>
              <h2 className="modal-title" style={{ margin: 0 }}>Create New Trip</h2>
              <button className="modal-close" onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: "1.5rem", cursor: "pointer", color: "var(--text)" }}>×</button>
            </div>
            
            <form onSubmit={handleCreateTrip}>
              {error && <div className="alert alert-danger" style={{ marginBottom: "1rem" }}>{error}</div>}
              
              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label className="form-label">Destination</label>
                <select 
                  className="form-input" 
                  value={destinationId} 
                  onChange={(e) => setDestinationId(e.target.value)}
                  required
                >
                  {destinations.map(d => (
                    <option key={d.id} value={d.id}>{d.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label className="form-label">Trip Title</label>
                <input 
                  type="text" 
                  className="form-input" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  placeholder="e.g., Weekend in Istanbul"
                  required 
                />
              </div>

              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label className="form-label">Trip Type</label>
                <select 
                  className="form-input" 
                  value={tripType} 
                  onChange={(e) => setTripType(e.target.value as any)}
                >
                  <option value="day_trip">Day Trip</option>
                  <option value="multi_day">Multi-day Trip</option>
                </select>
              </div>

              <div className="form-group" style={{ marginBottom: "1rem" }}>
                <label className="form-label">Start Date</label>
                <input 
                  type="date" 
                  className="form-input" 
                  value={startDate} 
                  onChange={(e) => setStartDate(e.target.value)} 
                  required 
                />
              </div>

              {tripType === "multi_day" && (
                <div className="form-group" style={{ marginBottom: "1rem" }}>
                  <label className="form-label">End Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    value={endDate} 
                    onChange={(e) => setEndDate(e.target.value)} 
                    required 
                  />
                </div>
              )}

              <div style={{ display: "flex", justifyContent: "flex-end", gap: "0.5rem", marginTop: "1.5rem" }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isCreating}>
                  {isCreating ? "Creating..." : "Create Trip"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
