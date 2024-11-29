"use client";

import React, { useEffect, useRef, useState } from "react";
import maplibregl from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";

// Example properties data
const EXAMPLE_PROPERTIES = [
  {
    id: "1",
    title: "Modern Apartment in Xinyi",
    price: 750000,
    size: 85,
    bedrooms: 2,
    bathrooms: 1,
    address: "No. 45, Xinyi Road Section 5, Xinyi District",
    coordinates: [121.5656, 25.0334],
    imageUrl: "https://picsum.photos/seed/prop1/800/600",
  },
  {
    id: "2",
    title: "Luxury Condo near Taipei 101",
    price: 1200000,
    size: 120,
    bedrooms: 3,
    bathrooms: 2,
    address: "No. 7, Songren Road, Xinyi District",
    coordinates: [121.5674, 25.0356],
    imageUrl: "https://picsum.photos/seed/prop2/800/600",
  },
  {
    id: "3",
    title: "Traditional House in Daan",
    price: 980000,
    size: 150,
    bedrooms: 4,
    bathrooms: 2,
    address: "No. 122, Daan Road Section 1, Daan District",
    coordinates: [121.5435, 25.0329],
    imageUrl: "https://picsum.photos/seed/prop3/800/600",
  },
  {
    id: "4",
    title: "Studio near MRT Station",
    price: 350000,
    size: 45,
    bedrooms: 1,
    bathrooms: 1,
    address: "No. 88, Songjiang Road, Zhongshan District",
    coordinates: [121.5339, 25.0504],
    imageUrl: "https://picsum.photos/seed/prop4/800/600",
  },
];

export default function Properties() {
  const mapContainer = useRef(null);
  const [viewState, setViewState] = useState({
    center: [121.5654, 25.033],
    zoom: 11,
    pitch: 0,
  });

  useEffect(() => {
    const map = new maplibregl.Map({
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/bright",
      ...viewState,
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="h-screen w-screen absolute top-0 left-0">
      <div className="h-screen w-screen absolute top-0 left-0" id="map" ref={mapContainer} />
    </div>
  );
}
