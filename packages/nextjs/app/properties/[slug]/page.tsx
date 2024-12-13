"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Bath, BedSingle, Ruler } from "lucide-react";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { MARKETPLACE_CONTRACT } from "~~/contracts/const";
import { useScaffoldReadContract, useScaffoldWriteContract } from "~~/hooks/scaffold-eth";
import { notification } from "~~/utils/scaffold-eth";

interface Property {
  id: string;
  tokenId: string;
  name: string;
  description: string;
  image: string;
  isShared: boolean;
  canBid: boolean;
  totalShares: number;
  pricePerShare: number;
  propertyToken: string;
  properties: {
    title: string;
    price: number;
    rooms: number;
    bathrooms: number;
    location: string;
    usableSurface: number;
    seller: string;
    canBid: boolean;
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
  const { writeContractAsync: tBUSDWrite } = useScaffoldWriteContract("tBUSD");

  // Marketplace Contract writes
  const { data: allowance } = useScaffoldReadContract({
    contractName: "tBUSD",
    functionName: "allowance",
    args: [address, MARKETPLACE_CONTRACT],
  });

  const buyProperty = async () => {
    const price = parseEther(property?.properties.price.toString() || "0");
    console.log("Allowance:", allowance?.toString());
    console.log("Price:", price.toString());

    if (!allowance || allowance < price) {
      console.log("Approving transaction...");
      try {
        await tBUSDWrite({
          functionName: "approve",
          args: [MARKETPLACE_CONTRACT, price],
        });
        notification.success("Approval successful!");
      } catch (error) {
        console.error("Approval error:", error);
        notification.error("Failed to approve transaction");
        return;
      }
    }

    try {
      await marketplaceWrite({
        functionName: "buyProperty",
        args: [BigInt(params.slug), price],
      });
      notification.success("Property purchased successfully!");
    } catch (error) {
      console.error("Purchase error:", error);
      notification.error("Failed to purchase property");
    }
  };

  const buyWithInstallment = async () => {
    await marketplaceWrite({
      functionName: "buyWithInstallment",
      args: [BigInt(params.slug), parseEther(property?.properties.price.toString() || "0")],
    });
  };

  const updatePrice = async () => {
    if (!newPrice) return;
    try {
      await marketplaceWrite({
        functionName: "updatePrice",
        args: [BigInt(params.slug), parseEther(newPrice)],
      });
      await fetch(`/api/properties/${params.slug}`, {
        method: "PUT",
        body: JSON.stringify({ price: newPrice }),
      });

      // Refetch property data
      const response = await fetch(`/api/properties/${params.slug}`);
      if (!response.ok) throw new Error("Failed to fetch updated property");
      const updatedProperty = await response.json();
      setProperty(updatedProperty);
      setNewPrice(""); // Clear the input field
      notification.success("Price updated successfully!");
    } catch (error) {
      console.error("Error updating price:", error);
      notification.error("Failed to update price");
    }
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
          <p className="text-2xl text-primary">{property.properties.price.toLocaleString()} tBUSD</p>

          <div className="grid grid-cols-3 gap-4">
            <div className="stat-box">
              <span className="text-lg flex items-center gap-2">
                {property.properties.rooms} <BedSingle />
              </span>
            </div>
            <div className="stat-box">
              <span className="text-lg flex items-center gap-2">
                {property.properties.bathrooms} <Bath />
              </span>
            </div>
            <div className="stat-box">
              <span className="text-lg flex items-center gap-2">
                {property.properties.usableSurface} <Ruler />
              </span>
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
                  <p className="font-bold">{(Number(getDownPayment) / 10 ** 18).toFixed(2)} tBUSD</p>
                </div>
                <div>
                  <p className="text-sm">Monthly Payment</p>
                  <p className="font-bold">{(Number(getMonthlyPayment) / 10 ** 18).toFixed(2)} tBUSD</p>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="space-y-4">
            {/* Regular Purchase Options */}
            {!isOwner && (
              <div className="flex flex-col gap-3">
                <button onClick={buyProperty} className="btn btn-primary w-full">
                  Buy Now
                </button>
                <button onClick={buyWithInstallment} className="btn btn-secondary w-full">
                  Buy with Installments
                </button>
              </div>
            )}

            {/* Owner Actions */}
            {isOwner && (
              <div className="space-y-3">
                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="New Price (tBUSD)"
                    value={newPrice}
                    onChange={e => setNewPrice(e.target.value)}
                    className="input input-bordered flex-1"
                  />
                  <button onClick={updatePrice} className="btn btn-primary">
                    Update Price
                  </button>
                </div>
                <button onClick={cancelSelling} className="btn btn-error w-full">
                  Cancel Selling
                </button>
                {property.canBid && (
                  <button onClick={acceptBid} className="btn btn-success w-full">
                    Accept Current Bid
                  </button>
                )}
              </div>
            )}

            {/* Bidding Section */}
            {property.canBid && !isOwner && (
              <div className="space-y-3">
                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="Bid Amount (tBUSD)"
                    value={bidAmount}
                    onChange={e => setBidAmount(e.target.value)}
                    className="input input-bordered flex-1"
                  />
                  <button onClick={placeBid} className="btn btn-primary">
                    Place Bid
                  </button>
                </div>
                <button onClick={withdrawBid} className="btn btn-warning w-full">
                  Withdraw Bid
                </button>
              </div>
            )}

            {/* Fractional Purchase Section */}
            {!isOwner && property.isShared && (
              <div className="space-y-3">
                <div className="flex gap-3">
                  <input
                    type="number"
                    placeholder="Share Amount"
                    value={shareAmount}
                    onChange={e => setShareAmount(e.target.value)}
                    className="input input-bordered flex-1"
                  />
                  <button onClick={buyPropertyShare} className="btn btn-accent">
                    Buy Shares
                  </button>
                </div>
              </div>
            )}

            {/* Payment Button */}
            <button onClick={makePayment} className="btn btn-info w-full">
              Make Monthly Payment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
