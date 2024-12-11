"use client";

import { useState } from "react";
import { useScaffoldWatchContractEvent, useScaffoldWriteContract } from "../../hooks/scaffold-eth";
import { pinataService } from "../../services/pinata";
import { ListingForm, PropertyType } from "../../types/all-types";
import { notification } from "../../utils/scaffold-eth";
import { parseEther } from "viem";
import { BuildingOffice2Icon, HomeIcon } from "@heroicons/react/24/outline";

export default function ListPropertyPage() {
  const [form, setForm] = useState<ListingForm>({
    propertyType: PropertyType.Apartment,
    isShared: false,
    canBid: false,
    title: "",
    rooms: 1,
    bathrooms: 1,
    usableSurface: 0,
    price: 0,
    location: "",
    description: "",
    images: [],
  });

  const { writeContractAsync } = useScaffoldWriteContract("PropertyNFT");

  useScaffoldWatchContractEvent({
    contractName: "Marketplace_Fractional",
    eventName: "PropertyListed",
    onLogs: async logs => {
      console.log("PropertyListed event received. Logs:", logs);

      logs.map(async log => {
        const { lister, price, pricePerShare, propertyToken, tokenId } = log.args;
        console.log("PropertyListed Fractional details:", {
          lister,
          price,
          pricePerShare,
          propertyToken,
          tokenId,
        });

        try {
          const loadingToastId = notification.loading("Uploading property metadata to IPFS...");
          console.log("Current form state:", form);

          // Upload images to Pinata
          console.log("Uploading images:", form.images);
          const imageUrls = await pinataService.uploadImages(form.images);
          console.log("Image URLs received:", imageUrls);

          // Generate metadata with propertyToken
          console.log("Generating metadata with:", {
            tokenId: tokenId?.toString(),
            form,
            imageUrls,
            propertyToken: propertyToken?.toString(),
          });

          const metadata = pinataService.generateMetadata(
            tokenId?.toString() || "",
            form,
            imageUrls,
            propertyToken?.toString(),
          );
          console.log("Generated metadata:", metadata);

          // Upload metadata to Pinata
          console.log("Uploading metadata to Pinata...");
          const tokenUri = await pinataService.uploadMetadata(tokenId?.toString() || "", metadata);
          console.log("Token URI received:", tokenUri);

          // Save to MongoDB
          console.log("Saving to MongoDB...");
          const dbResponse = await fetch("/api/properties", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tokenId: tokenId?.toString(),
              ...metadata,
              isShared: true,
              totalShares: 1000,
              pricePerShare: Number(pricePerShare),
              propertyToken: propertyToken?.toString(),
            }),
          });

          if (!dbResponse.ok) {
            console.error("MongoDB save failed:", await dbResponse.json());
            throw new Error("Failed to save property to database");
          }

          console.log("MongoDB save successful");
          notification.remove(loadingToastId);
          notification.success("Property metadata uploaded successfully!");
        } catch (error) {
          console.error("Detailed error in property listing process:", error);
          notification.error(
            <>
              <p className="font-bold mt-0 mb-1">Error uploading property metadata</p>
              <p className="m-0">Please try again.</p>
            </>,
          );
        }
      });
    },
  });

  useScaffoldWatchContractEvent({
    contractName: "Marketplace",
    eventName: "PropertyListed",
    onLogs: async logs => {
      logs.map(async log => {
        const { seller, tokenId, price, canBid } = log.args;
        console.log("PropertyListed", seller, tokenId, price, canBid);

        try {
          const loadingToastId = notification.loading("Uploading property metadata to IPFS...");

          // Upload images to Pinata
          const imageUrls = await pinataService.uploadImages(form.images);

          // Generate metadata
          const metadata = pinataService.generateMetadata(tokenId?.toString() || "", form, imageUrls);

          // Upload metadata to Pinata
          const tokenUri = await pinataService.uploadMetadata(tokenId?.toString() || "", metadata);

          // TODO: Set the token URI

          // Save the same metadata to MongoDB
          const dbResponse = await fetch("/api/properties", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              tokenId: tokenId?.toString(),
              ...metadata, // This spreads all the metadata fields (name, description, image, attributes, properties)
            }),
          });

          if (!dbResponse.ok) {
            throw new Error("Failed to save property to database");
          }

          notification.remove(loadingToastId);
          notification.success("Property metadata uploaded successfully!");

          console.log("Token URI:", tokenUri);
        } catch (error) {
          notification.error(
            <>
              <p className="font-bold mt-0 mb-1">Error uploading property metadata</p>
              <p className="m-0">Please try again.</p>
            </>,
          );
          console.error("Error uploading metadata:", error);
        }
      });
    },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (form.isShared) {
        await writeContractAsync({
          functionName: "createPropertyShared",
          args: [
            parseEther(form.price.toString()),
            BigInt(form.propertyType),
            form.location,
            BigInt(form.rooms),
            BigInt(form.bathrooms),
            BigInt(form.usableSurface),
          ],
        });
      } else {
        await writeContractAsync({
          functionName: "createProperty",
          args: [
            parseEther(form.price.toString()),
            form.canBid,
            BigInt(form.propertyType),
            form.location,
            BigInt(form.rooms),
            BigInt(form.bathrooms),
            BigInt(form.usableSurface),
          ],
        });
      }
    } catch (error) {
      console.error("Error handling property submission:", error);
    }
  };

  return (
    <div className="container mx-auto max-w-3xl px-6 py-8">
      <h1 className="text-4xl font-bold mb-8">List Your Property</h1>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Property Type Selection */}
        <div className="grid grid-cols-4 gap-4">
          <button
            type="button"
            onClick={() => setForm({ ...form, propertyType: PropertyType.Apartment })}
            className={`flex flex-col items-center p-4 rounded-lg border-2 ${
              form.propertyType === PropertyType.Apartment ? "border-primary bg-primary/10" : "border-base-200"
            }`}
          >
            <BuildingOffice2Icon className="h-6 w-6" />
            <span>Apartment</span>
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, propertyType: PropertyType.House })}
            className={`flex flex-col items-center p-4 rounded-lg border-2 ${
              form.propertyType === PropertyType.House ? "border-primary bg-primary/10" : "border-base-200"
            }`}
          >
            <HomeIcon className="h-6 w-6" />
            <span>House</span>
          </button>
          {/* Add similar buttons for Ground and Commercial */}
        </div>

        {/* Property Ownership Type */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="isShared"
              checked={!form.isShared}
              onChange={() => setForm({ ...form, isShared: false })}
              className="radio radio-primary"
            />
            Whole Property
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="isShared"
              checked={form.isShared}
              onChange={() => setForm({ ...form, isShared: true })}
              className="radio radio-primary"
            />
            Fractional Property
          </label>
        </div>

        {/* Bid or Direct Sale - Only show for non-fractional properties */}
        {!form.isShared && (
          <div className="flex gap-4">
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="canBid"
                checked={form.canBid}
                onChange={() => setForm({ ...form, canBid: !form.canBid })}
                className="radio radio-primary"
              />
              Bid
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="canBid"
                checked={!form.canBid}
                onChange={() => setForm({ ...form, canBid: !form.canBid })}
                className="radio radio-primary"
              />
              Direct Sale
            </label>
          </div>
        )}

        {/* Title */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Title</span>
          </label>
          <input
            type="text"
            value={form.title}
            onChange={e => setForm({ ...form, title: e.target.value })}
            className="input input-bordered w-full"
            placeholder="Property Title"
          />
        </div>

        {/* Images Upload */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Images</span>
          </label>
          <div className="border-2 border-dashed border-base-300 rounded-lg p-8 text-center">
            <input
              type="file"
              multiple
              accept="image/*"
              onChange={e => setForm({ ...form, images: Array.from(e.target.files || []) })}
              className="hidden"
              id="images"
            />
            <label htmlFor="images" className="btn btn-outline">
              Upload Images
            </label>
            <p className="text-sm mt-2">Maximum 10 pictures. Supported formats: PNG, JPG. Maximum size 10MB</p>
          </div>
        </div>

        {/* Number of Rooms */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Number of Rooms</span>
          </label>
          <div className="flex gap-4">
            {[1, 2, 3, 4, "5+"].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => setForm({ ...form, rooms: typeof num === "string" ? 5 : num })}
                className={`btn ${form.rooms === (typeof num === "string" ? 5 : num) ? "btn-primary" : "btn-outline"}`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Number of Bathrooms */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Number of Bathrooms</span>
          </label>
          <div className="flex gap-4">
            {[1, 2, 3, 4, "5+"].map(num => (
              <button
                key={num}
                type="button"
                onClick={() => setForm({ ...form, bathrooms: typeof num === "string" ? 5 : num })}
                className={`btn ${form.bathrooms === (typeof num === "string" ? 5 : num) ? "btn-primary" : "btn-outline"}`}
              >
                {num}
              </button>
            ))}
          </div>
        </div>

        {/* Usable Surface */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Usable Surface</span>
          </label>
          <div className="relative">
            <input
              type="number"
              value={form.usableSurface || ""}
              onChange={e => setForm({ ...form, usableSurface: Number(e.target.value) })}
              className="input input-bordered w-full pr-12"
              placeholder="Usable surface"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50">m²</span>
          </div>
        </div>

        {/* Price */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Price</span>
          </label>
          <div className="relative">
            <input
              type="number"
              value={form.price || ""}
              onChange={e => setForm({ ...form, price: Number(e.target.value) })}
              className="input input-bordered w-full pr-12"
              placeholder="Price"
            />
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50">tBUSD</span>
          </div>
        </div>

        {/* Location */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Location</span>
          </label>
          <input
            type="text"
            value={form.location}
            onChange={e => setForm({ ...form, location: e.target.value })}
            className="input input-bordered w-full"
            placeholder="Property location"
          />
        </div>

        {/* Description */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Description</span>
          </label>
          <textarea
            value={form.description}
            onChange={e => setForm({ ...form, description: e.target.value })}
            className="textarea textarea-bordered h-32"
            placeholder="Property description"
          />
        </div>

        <button type="submit" className="btn btn-primary w-full">
          List Property
        </button>
      </form>
    </div>
  );
}
