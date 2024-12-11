"use client";

import { useState } from "react";
import { properties } from "./propertyData";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { PropertyCard } from "~~/components/PropertyCard";
import { PropertyMarkers } from "~~/components/PropertyMarkers";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

export default function PropertiesPage() {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Property List */}
      <div className="w-1/3 overflow-y-auto p-6 border-r">
        <h1 className="text-3xl font-bold mb-6">Available Properties</h1>
        <div className="space-y-6">
          {properties.map(property => (
            <PropertyCard
              key={property.id}
              property={property}
              onClick={() => setSelectedProperty(property.id)}
              isSelected={selectedProperty === property.id}
            />
          ))}
        </div>
      </div>

      {/* Map */}
      <div className="w-2/3">
        <APIProvider apiKey={API_KEY}>
          <Map
            mapId={"bf51a910020fa25a"}
            defaultZoom={12}
            defaultCenter={{ lat: 25.033, lng: 121.565 }}
            gestureHandling={"greedy"}
            disableDefaultUI
          >
            <PropertyMarkers
              properties={properties}
              selectedPropertyId={selectedProperty}
              onMarkerClick={id => setSelectedProperty(id)}
            />
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}
