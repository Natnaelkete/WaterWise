"use client";

import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { LatLngExpression, LatLngTuple } from "leaflet";

import "leaflet/dist/leaflet.css";
import "leaflet-defaulticon-compatibility/dist/leaflet-defaulticon-compatibility.css";
import "leaflet-defaulticon-compatibility";
import { useEffect, useState } from "react";

const defaults = {
  zoom: 19,
};

const Map = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [reports, setReports] = useState<Report[]>([]);
  console.log("This is from Map", reports);

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/reports");
      const data = await response.json();
      setReports(data);
    } catch (error) {
      console.error("Error fetching reports:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // const latestPosix = reports.map(()=> )
  // const testPosix = {[latestPosix, latestPosix]}

  return (
    <MapContainer
      center={[7.6890118, 36.8198714]}
      zoom={19}
      scrollWheelZoom={false}
      style={{ height: "100%", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={[7.6890118, 36.8198714]} draggable={false}>
        <Popup>Hey ! I study here</Popup>
      </Marker>
      {/* {reports.map((report) => (
      ))} */}
    </MapContainer>
  );
};

export default Map;
