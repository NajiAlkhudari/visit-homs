"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

export default function Map({
  markers = [],
  center = [34.7326, 36.7136],
  zoom = 13,
}) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: "400px", width: "100%" }}
      className="rounded-2xl"
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="© OpenStreetMap"
      />
      {markers.map((m, i) => (
        <Marker key={i} position={[m.lat, m.lng]} icon={icon}>
          <Popup>{m.title}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
