"use client";

import React, { useEffect, useRef, useState } from "react";
import { PropertyCard } from "../../components/PropertyCard";
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
    const popup = new maplibregl.Popup({ offset: 25 }).setHTML(`
      <div class="p-2">
        <h3 class="font-bold">${EXAMPLE_PROPERTIES[0].title}</h3>
        <p class="text-sm">${EXAMPLE_PROPERTIES[0].address}</p>
        <p class="text-primary font-bold">$${EXAMPLE_PROPERTIES[0].price.toLocaleString()}</p>
      </div>
    `);
    const map = new maplibregl.Map({
      // @ts-ignore
      container: mapContainer.current,
      style: "https://tiles.openfreemap.org/styles/bright",
      ...viewState,
    });

    map.addControl(new maplibregl.NavigationControl());
    const marker = new maplibregl.Marker({ color: "#93BBFB" }).setLngLat([121.5654, 25.033]).setPopup(popup).addTo(map);

    marker.getElement().addEventListener("click", () => {
      console.log("clicked");
    });

    return () => {
      map.remove();
    };
  }, []);

  return (
    <div className="flex h-screen">
      <div className="w-1/3 overflow-y-auto p-4 space-y-4">
        {EXAMPLE_PROPERTIES.map(property => (
          <PropertyCard
            key={property.id}
            property={property}
            onClick={() => {
              console.log("clicked");
            }}
            isSelected={false}
          />
        ))}
      </div>
      <div className="w-2/3 relative">
        <div className="h-screen w-screen absolute inset-0" id="map" ref={mapContainer} />
      </div>
    </div>
  );
}
