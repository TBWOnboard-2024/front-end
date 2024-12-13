"use client";

import { useEffect, useState } from "react";
import { useScaffoldReadContract } from "../../hooks/scaffold-eth";
import { useAccount } from "wagmi";
import { NewPropertyCard } from "~~/components/NewPropertyCard";
import { TBUSDMintButton } from "~~/components/scaffold-eth/TBUSDMintButton";

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
  };
}

export default function MyProperties() {
  const { address } = useAccount();
  const [listedProperties, setListedProperties] = useState<Property[]>([]);
  const [ownedProperties, setOwnedProperties] = useState<Property[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProperties = async () => {
      if (!address) return;

      try {
        const response = await fetch("/api/properties");
        const allProperties = await response.json();
      } catch (error) {
        console.error("Error fetching properties:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProperties();
  }, [address]);

  if (!address) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">Connect your wallet to view your properties</div>
    );
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      {/* TBUSD Section */}
      <div className="mb-8">
        <div className="bg-base-200 rounded-lg p-6">
          <h2 className="text-2xl font-bold mb-4">Mint some tBUSD</h2>
          <TBUSDMintButton />
        </div>
      </div>

      {/* Listed Properties Section */}
      {/* <div className="mb-12">
        <h1 className="text-4xl font-bold mb-8">Listed Properties</h1>
        {listedProperties.length === 0 ? (
          <div className="text-center py-8 bg-base-200 rounded-lg">
            <p className="text-lg text-gray-600">No listed properties found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listedProperties.map(property => (
              <NewPropertyCard
                key={property.tokenId}
                id={property.tokenId}
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
      </div> */}

      {/* Owned Properties Section */}

      {/* <div className="mb-12">
        <h1 className="text-4xl font-bold mb-8">Owned Properties</h1>
        {listedProperties.length === 0 ? (
          <div className="text-center py-8 bg-base-200 rounded-lg">
            <p className="text-lg text-gray-600">No owned properties found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {listedProperties.map(property => (
              <NewPropertyCard
                key={property.tokenId}
                id={property.tokenId}
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
      </div> */}
    </div>
  );
}
