"use client";

import { useEffect, useState } from "react";
import { NewPropertyCard } from "~~/components/NewPropertyCard";

interface Property {
  id: string;
  tokenId: string;
  name: string;
  image: string;
  properties: {
    title: string;
    price: number;
    rooms: number;
    bathrooms: number;
    location: string;
    usableSurface: number;
  };
}

export default function PropertiesMarketplace() {
  const [properties, setProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        const response = await fetch("/api/properties");
        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }
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
      <div className="flex justify-center items-center min-h-[60vh]">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="text-center pt-16 md:pt-24">
        <h2 className="text-3xl md:text-5xl font-bold mb-4">Properties Marketplace</h2>
        <p className="text-gray-600 text-lg md:text-xl max-w-2xl mx-auto px-4">
          Discover our selection of the finest properties available for sale or rent
        </p>
      </div>
      {properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">No properties available</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 md:gap-12 lg:gap-16 py-20 md:py-[160px] px-4 md:px-[100px]">
          {properties.map(property => (
            <NewPropertyCard
              key={property.tokenId}
              id={property.id}
              title={property.properties.title || property.name}
              price={property.properties.price}
              location={property.properties.location}
              bedrooms={property.properties.rooms}
              bathrooms={property.properties.bathrooms}
              size={property.properties.usableSurface}
              imageUrl={property.image}
            />
          ))}
        </div>
      )}
    </div>
  );
}
