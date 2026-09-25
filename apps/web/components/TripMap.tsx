"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, Polyline } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import type { TripStop, Place } from "@gezgin/types";

// Fix for default marker icons in Leaflet with Next.js
const defaultIcon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

L.Marker.prototype.options.icon = defaultIcon;

interface TripMapProps {
  stops: (TripStop & { place: Place })[];
}

export default function TripMap({ stops }: TripMapProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return <div style={{ height: "100%", width: "100%", backgroundColor: "#e2e8f0" }} />;

  // Default center (Istanbul) if no stops
  const defaultCenter: [number, number] = [41.0082, 28.9784];
  
  const coordinates: [number, number][] = stops
    .filter(s => s.place.latitude && s.place.longitude)
    .map(s => [s.place.latitude, s.place.longitude]);

  const center = coordinates.length > 0 ? coordinates[0] : defaultCenter;

  return (
    <MapContainer 
      center={center} 
      zoom={13} 
      style={{ height: "100%", width: "100%", zIndex: 1 }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      
      {stops.map((stop, index) => {
        if (!stop.place.latitude || !stop.place.longitude) return null;
        
        return (
          <Marker 
            key={stop.id} 
            position={[stop.place.latitude, stop.place.longitude]}
          >
            <Popup>
              <div style={{ fontWeight: "bold" }}>
                {index + 1}. {stop.place.name}
              </div>
              {stop.start_time && (
                <div style={{ fontSize: "0.85rem", color: "#64748b" }}>
                  {stop.start_time} ({stop.duration_minutes} min)
                </div>
              )}
            </Popup>
          </Marker>
        );
      })}

      {coordinates.length > 1 && (
        <Polyline positions={coordinates} color="#0284c7" weight={4} opacity={0.7} />
      )}
    </MapContainer>
  );
}
