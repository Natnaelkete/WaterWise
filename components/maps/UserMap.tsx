"use client";

import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { LatLngBounds } from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect } from "react";

type FormType = {
  setCoordinates: (lat: number, lng: number) => void;
  LatLng: { latitude: number; longitude: number };
};

const UserMap = ({
  setCoordinates,
  LatLng: { latitude, longitude },
}: FormType) => {
  // Define the bounding box for Ethiopia (approximate coordinates)
  const ethiopiaBounds = new LatLngBounds([3.385, 32.98], [14.875, 48.02]);

  return (
    <MapContainer
      center={[latitude || 9.145, longitude || 40.4897]}
      className="h-screen"
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
      maxBounds={ethiopiaBounds}
      minZoom={3}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker
        position={[latitude || 9.145, longitude || 40.4897]}
        draggable={false}
      >
        <Popup>
          <h2 className="font-bold mb-2">
            Latitude: <span className="selection:bg-zinc-300">{latitude}</span>
          </h2>
          <h2 className="font-bold">
            Longitude:{" "}
            <span className="selection:bg-zinc-300">{longitude}</span>
          </h2>
        </Popup>
      </Marker>
      <DetectClick setCoordinates={setCoordinates} />
      {latitude && longitude && <ChangeCenter lat={latitude} lng={longitude} />}
      <SetInitialView bounds={ethiopiaBounds} />
    </MapContainer>
  );
};

function SetInitialView({ bounds }: { bounds: LatLngBounds }) {
  const map = useMap();
  useEffect(() => {
    map.fitBounds(bounds, {
      padding: [50, 50],
      animate: false,
    });
  }, [map, bounds]);
  return null;
}

function DetectClick({ setCoordinates }: any) {
  const router = useRouter();

  useMapEvents({
    click: (e) => {
      setCoordinates(e.latlng.lat, e.latlng.lng);
    },
  });

  return null;
}

function ChangeCenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();
  useEffect(() => {
    map.setView([lat, lng]);
  }, [map, lat, lng]);
  return null;
}

export default UserMap;
