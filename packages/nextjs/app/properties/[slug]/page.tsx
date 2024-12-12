"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

interface Property {
  id: string;
  tokenId: string;
  name: string;
  description: string;
  image: string;
  properties: {
    title: string;
    price: number;
    rooms: number;
    bathrooms: number;
    location: string;
    usableSurface: number;
    seller: string;
    canBid: boolean;
    listed: boolean;
  };
}

export default function PropertyDetails({ params }: { params: { slug: string } }) {
  const { address } = useAccount();
  const [property, setProperty] = useState<Property | null>(null);
  const [bidAmount, setBidAmount] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  // Add new states for UI controls
  const [newPrice, setNewPrice] = useState<string>("");
  const [shareAmount, setShareAmount] = useState<string>("");

  // Contract writes
  const { writeContractAsync: marketplaceWrite } = useScaffoldWriteContract("Marketplace");
  const { writeContractAsync: fractionalMarketplaceWrite } = useScaffoldWriteContract("Marketplace_Fractional");

  // Marketplace Contract writes
  const listProperty = async () => {
    await marketplaceWrite({
      functionName: "listProperty",
      args: [BigInt(params.slug), BigInt(property?.properties.price || 0), property?.properties.canBid],
    });
  };

  const buyProperty = async () => {
    console.log(parseEther(property?.properties.price.toString() || "0"));

    await marketplaceWrite({
      functionName: "buyProperty",
      args: [BigInt(params.slug), BigInt(property?.properties.price || 0)],
    });
  };

  const buyWithInstallment = async () => {
    await marketplaceWrite({
      functionName: "buyWithInstallment",
      args: [BigInt(params.slug), BigInt(property?.properties.price || 0)],
    });
  };

  const updatePrice = async () => {
    if (!newPrice) return;
    await marketplaceWrite({
      functionName: "updatePrice",
      args: [BigInt(params.slug), parseEther(newPrice)],
    });
  };

  const cancelSelling = async () => {
    await marketplaceWrite({
      functionName: "cancelSelling",
      args: [BigInt(params.slug)],
    });
  };

  const placeBid = async () => {
    await marketplaceWrite({
      functionName: "placeBid",
      args: [BigInt(params.slug), BigInt(bidAmount)],
    });
  };

  const acceptBid = async () => {
    await marketplaceWrite({
      functionName: "acceptBid",
      args: [BigInt(params.slug)],
    });
  };

  const withdrawBid = async () => {
    await marketplaceWrite({
      functionName: "withdrawBid",
      args: [BigInt(params.slug)],
    });
  };

  const makePayment = async () => {
    await marketplaceWrite({
      functionName: "makePayment",
      args: [BigInt(params.slug)],
    });
  };

  // Marketplace Contract reads
  const { data: getDownPayment } = useScaffoldReadContract({
    contractName: "Marketplace",
    functionName: "getDownPayment",
    args: [BigInt(params.slug)],
  });

  const { data: getMonthlyPayment } = useScaffoldReadContract({
    contractName: "Marketplace",
    functionName: "getMonthlyPayment",
    args: [BigInt(params.slug)],
  });

  console.log("getDownPayment", getDownPayment);
  console.log("getMonthlyPayment", getMonthlyPayment);

  // Fractional Contract writes
  const buyPropertyShare = async () => {
    await fractionalMarketplaceWrite({
      functionName: "buyPropertyShare",
      args: [BigInt(params.slug), BigInt(0)],
    });
  };

  useEffect(() => {
    const fetchProperty = async () => {
      try {
        const response = await fetch(`/api/properties/${params.slug}`);
        if (!response.ok) throw new Error("Failed to fetch property");
        const data = await response.json();
        setProperty(data);
      } catch (error) {
        console.error("Error fetching property:", error);
        notification.error("Failed to load property details");
      } finally {
        setIsLoading(false);
      }
    };

    fetchProperty();
  }, [params.slug]);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!property) {
    return <div className="text-center py-10">Property not found</div>;
  }

  const isOwner = address && property?.properties.seller === address;
  console.log("property.properties.seller", property?.properties.seller);
  console.log("address", address);
  console.log("isOwner", isOwner);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Property Image */}
        <div className="rounded-lg overflow-hidden h-[400px]">
          <Image
            src={property.image}
            alt={property.name}
            width={1000}
            height={1000}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Property Details */}
        <div className="space-y-6">
          <h1 className="text-4xl font-bold">{property.properties.title}</h1>
          <p className="text-2xl text-primary">${property.properties.price.toLocaleString()}</p>

          <div className="grid grid-cols-3 gap-4">
            <div className="stat-box">
              <span className="text-lg">{property.properties.rooms} Rooms</span>
            </div>
            <div className="stat-box">
              <span className="text-lg">{property.properties.bathrooms} Baths</span>
            </div>
            <div className="stat-box">
              <span className="text-lg">{property.properties.usableSurface} m²</span>
            </div>
          </div>

          <p className="text-gray-600">{property.description}</p>

          {/* Payment Information Section */}
          {getDownPayment && getMonthlyPayment && (
            <div className="bg-base-200 p-4 rounded-lg">
              <h3 className="text-xl font-bold mb-2">Installment Details</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm">Down Payment</p>
                  <p className="font-bold">{Number(getDownPayment) / 10 ** 18} tBUSD</p>
                </div>
                <div>
                  <p className="text-sm">Monthly Payment</p>
                  <p className="font-bold">{(Number(getMonthlyPayment) / 10 ** 18).toFixed(2)} tBUSD</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons - Reorganized */}
          <div className="space-y-4">
            {!isOwner && property.properties.listed && (
              <div className="space-y-2">
                {/* Regular Purchase Options */}
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={buyProperty} className="btn btn-primary">
                    Buy Now
                  </button>
                  <button onClick={buyWithInstallment} className="btn btn-secondary">
                    Buy with Installments
                  </button>
                </div>

                {/* Fractional Purchase */}
                {property.properties.isShared && (
                  <div className="flex gap-2">
                    <input
                      type="number"
                      value={shareAmount}
                      onChange={e => setShareAmount(e.target.value)}
                      className="input input-bordered flex-1"
                      placeholder="Share amount"
                    />
                    <button onClick={buyPropertyShare} className="btn btn-accent">
                      Buy Shares
                    </button>
                  </div>
                )}

                {/* Bidding Section */}
                {property.properties.canBid && (
                  <div className="space-y-2 border-t pt-2">
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={bidAmount}
                        onChange={e => setBidAmount(e.target.value)}
                        className="input input-bordered flex-1"
                        placeholder="Bid amount"
                      />
                      <button onClick={placeBid} className="btn btn-outline">
                        Place Bid
                      </button>
                    </div>
                    <button onClick={withdrawBid} className="btn btn-outline btn-warning w-full">
                      Withdraw Bid
                    </button>
                  </div>
                )}

                {/* Payment Button */}
                <button onClick={makePayment} className="btn btn-info w-full">
                  Make Payment
                </button>
              </div>
            )}

            {/* Owner Controls */}
            {isOwner && (
              <div className="space-y-2 border-t pt-2">
                {property.properties.listed ? (
                  <>
                    <div className="flex gap-2">
                      <input
                        type="number"
                        value={newPrice}
                        onChange={e => setNewPrice(e.target.value)}
                        className="input input-bordered flex-1"
                        placeholder="New price"
                      />
                      <button onClick={updatePrice} className="btn btn-secondary">
                        Update Price
                      </button>
                    </div>
                    <button onClick={cancelSelling} className="btn btn-error w-full">
                      Unlist Property
                    </button>
                    <button onClick={acceptBid} className="btn btn-success w-full">
                      Accept Current Bid
                    </button>
                  </>
                ) : (
                  <button onClick={listProperty} className="btn btn-primary w-full">
                    List Property
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
