"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useRouter, useSearchParams } from "next/navigation";

const UserMap = () => {
  const searchParams = useSearchParams();
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));
  return (
    <MapContainer
      center={[lat || 0, lng || 0]}
      zoom={10}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[lat || 0, lng || 0]} draggable={false}>
        <Popup>Hey ! I study here</Popup>
      </Marker>
      <DetectClick />
      <ChangeCenter lat={lat} lng={lng} />
    </MapContainer>
  );
};

function DetectClick() {
  const router = useRouter();

  useMapEvents({
    click: (e) => {
      router.push(`map?lat=${e.latlng.lat}&lng=${e.latlng.lng}`);
    },
  });

  return null;
}

function ChangeCenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  map.setView([lat, lng]);
  return null;
}

export default UserMap;
