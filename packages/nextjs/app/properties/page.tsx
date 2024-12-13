"use client";

import { useEffect, useState } from "react";
import { APIProvider, Map } from "@vis.gl/react-google-maps";
import { PropertyCard } from "~~/components/PropertyCard";
import { PropertyMarkers } from "~~/components/PropertyMarkers";

const API_KEY = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string;

interface Property {
  id: string;
  tokenId: string;
  name: string;
  image: string;
  attributes: {
    rooms: number;
    bathrooms: number;
    location: string;
    usableSurface: number;
    propertyType: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  properties: {
    images: string[];
    title: string;
  };
}

export default function PropertiesPage() {
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("/api/properties");
        if (!response.ok) throw new Error("Failed to fetch properties");
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  // Calculate map center based on property coordinates
  const defaultCenter = { lat: 25.033, lng: 121.565 }; // Default to Taipei
  const mapCenter =
    properties.length > 0 && properties[0].attributes.coordinates
      ? properties[0].attributes.coordinates
      : defaultCenter;

  return (
    <div className="flex h-[calc(100vh-4rem)]">
      {/* Property List */}
      <div className="w-1/3 overflow-y-auto p-6 border-r">
        <h1 className="text-3xl font-bold mb-6">Available Properties</h1>
        <div className="space-y-6">
          {properties.map(property => (
            <PropertyCard
              key={property.tokenId}
              property={{
                id: property.tokenId,
                title: property.properties.title || property.name,
                size: property.attributes.usableSurface,
                bedrooms: property.attributes.rooms,
                bathrooms: property.attributes.bathrooms,
                address: property.attributes.location,
                coordinates: property.attributes.coordinates || defaultCenter,
                imageUrl: property.image,
              }}
              onClick={() => setSelectedProperty(property.tokenId)}
              isSelected={selectedProperty === property.tokenId}
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
            defaultCenter={mapCenter}
            gestureHandling={"greedy"}
            disableDefaultUI
          >
            <PropertyMarkers
              properties={properties.map(p => ({
                id: p.tokenId,
                title: p.properties.title || p.name,
                price: p.properties.price,
                coordinates: p.attributes.coordinates || defaultCenter,
              }))}
              selectedPropertyId={selectedProperty}
              onMarkerClick={id => setSelectedProperty(id)}
            />
          </Map>
        </APIProvider>
      </div>
    </div>
  );
}
