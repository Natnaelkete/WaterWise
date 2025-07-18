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
import { useRouter } from "next/navigation";
import { useEffect } from "react";

type FormType = {
  setCoordinates: (lat: number, lng: number) => void;
  LatLng: { latitude: number; longitude: number };
};

const UserMap = ({
  setCoordinates,
  LatLng: { latitude, longitude },
}: FormType) => {
  return (
    <div className="bg-white-700 mx-auto my-5 w-[100%] h-[300px]">
      <MapContainer
        center={[latitude || 7.6890118, longitude || 36.8198714]}
        style={{ height: "100%", width: "100%" }}
        zoom={5}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <Marker
          position={[latitude || 7.6890118, longitude || 36.8198714]}
          draggable={false}
        >
          <Popup>
            <h2 className="font-bold mb-2">
              Latitude:{" "}
              <span className="selection:bg-zinc-300">{latitude}</span>
            </h2>
            <h2 className="font-bold">
              Longitude:{" "}
              <span className="selection:bg-zinc-300">{longitude}</span>
            </h2>
          </Popup>
        </Marker>
        <DetectClick setCoordinates={setCoordinates} />
        {latitude && longitude && (
          <ChangeCenter lat={latitude} lng={longitude} />
        )}
      </MapContainer>
    </div>
  );
};

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
