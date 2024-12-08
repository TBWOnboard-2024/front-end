"use client";

import { useEffect, useState } from "react";
import { PropertyCard } from "../../components/PropertyCard";
import { useScaffoldReadContract } from "../../hooks/scaffold-eth";
import { useAccount } from "wagmi";

interface Property {
  id: string;
  tokenId: string;
  name: string;
  description: string;
  image: string;
  attributes: {
    trait_type: string;
    value: string | number;
  }[];
  properties: {
    images: string[];
    title: string;
    price: number;
    rooms: number;
    bathrooms: number;
    location: string;
  };
}

export default function MyProperties() {
  const { address } = useAccount();
  const [properties, setProperties] = useState<Property[]>([]);

  const { data: tokenIds } = useScaffoldReadContract({
    contractName: "PropertyNFT",
    functionName: "tokensByAddress",
    args: ["0xB2A043a4F4BB5090f1D5D012c9f8767bA9Eba866"],
  });

  useEffect(() => {
    const fetchProperties = async () => {
      if (!tokenIds?.length) return;

      // Filter token IDs greater than 20
      const filteredTokenIds = tokenIds.filter(id => Number(id) > 20);
      if (filteredTokenIds.length === 0) return;

      try {
        const response = await fetch(`/api/properties`);
        if (!response.ok) {
          throw new Error("Failed to fetch properties");
        }
        const data = await response.json();
        setProperties(data);
      } catch (error) {
        console.error("Error fetching properties:", error);
      }
    };

    fetchProperties();
  }, [tokenIds]);

  if (!address) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <p className="text-xl">Please connect your wallet to view your properties</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <h1 className="text-4xl font-bold mb-8">My Properties</h1>

      {properties.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-xl text-gray-600">You don&apos;t own any properties yet</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {properties.map(property => (
            <PropertyCard
              key={property.tokenId}
              property={{
                id: property.tokenId,
                title: property.properties.title || property.name,
                price: property.properties.price,
                size: property.attributes.find(attr => attr.trait_type === "Area (sqm)")?.value as number,
                bedrooms: property.properties.rooms,
                bathrooms: property.properties.bathrooms,
                address: property.properties.location,
                coordinates: [0, 0], // You might want to add coordinates to your metadata if needed
                imageUrl: property.image,
              }}
              onClick={() => {
                // Implement navigation to property details page
                window.location.href = `/properties/${property.tokenId}`;
              }}
              isSelected={false}
            />
          ))}
        </div>
      )}
    </div>
  );
}
