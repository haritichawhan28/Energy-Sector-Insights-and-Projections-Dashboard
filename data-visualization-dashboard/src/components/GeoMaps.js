// src/components/GeoMap.js
import React, { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import "leaflet/dist/leaflet.css";

const GeoMap = () => {
  const [geoData, setGeoData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/geodata"); // Adjust URL if needed
        setGeoData(response.data);
      } catch (error) {
        setError("Error fetching data.");
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const geoJSONData = geoData.map((item) => ({
    type: "Feature",
    properties: {
      intensity: item.intensity,
      likelihood: item.likelihood,
      relevance: item.relevance,
    },
    geometry: {
      type: "Point",
      coordinates: [item.lon, item.lat], // Adjust based on data structure
    },
  }));

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <MapContainer
      center={[51.505, -0.09]}
      zoom={13}
      style={{ height: "500px", width: "100%" }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      <GeoJSON data={{ type: "FeatureCollection", features: geoJSONData }} />
    </MapContainer>
  );
};

export default GeoMap;
