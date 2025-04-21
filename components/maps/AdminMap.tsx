"use client";

import React, { useEffect, useState } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Report } from "@prisma/client";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useSearchParams } from "next/navigation";

const AdminMap = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  const searchParams = useSearchParams();
  const lat = Number(searchParams?.get("lat"));
  const lng = Number(searchParams?.get("lng"));

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/reports");
      const apiData = await response.json();

      const reportsArray = Array.isArray(apiData)
        ? apiData
        : Array.isArray(apiData?.data)
        ? apiData.data
        : [];

      setReports(reportsArray);
    } catch (error) {
      console.error("Error fetching reports:", error);
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  };

  const filteredReport = reports?.filter(
    (report) => report.status !== "RESOLVED"
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <MapContainer
      center={[
        reports[0]?.latitude || 7.6890118,
        reports[0]?.longitude || 36.8198714,
      ]}
      zoom={10}
      scrollWheelZoom={true}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {filteredReport?.map((report) => (
        <Marker
          position={[
            (report.latitude as number) || 7.4230114,
            (report.longitude as number) || 36.8594321,
          ]}
          draggable={false}
        >
          <Popup>{report.status}</Popup>
        </Marker>
      ))}
      <ChangeCenter lat={lat} lng={lng} />
    </MapContainer>
  );
};

function ChangeCenter({ lat, lng }: { lat: number; lng: number }) {
  const map = useMap();

  map.setView([lat, lng]);
  return null;
}

export default AdminMap;
