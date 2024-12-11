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

  if (!address) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <div className="loading loading-spinner loading-lg"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-6 py-8">
      <div className="">
        <h1 className="text-4xl font-bold mb-8">Listed Properties</h1>
      </div>
      <div className="">
        <h1 className="text-4xl font-bold mb-8">Owned Properties</h1>
      </div>
      <div className="">
        <h1 className="text-4xl font-bold mb-8">Minted Properties</h1>
      </div>
    </div>
  );
}
