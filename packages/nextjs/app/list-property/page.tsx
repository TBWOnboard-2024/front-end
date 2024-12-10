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
    // listingType: "rent",
    canBid: false,
    title: "",
    rooms: 1,
    bathrooms: 1,
    compartmentalization: "",
    comfort: "",
    floor: "",
    usableSurface: 0,
    price: 0,
    location: "",
    constructionYear: "",
    description: "",
    images: [],
  });

  const { writeContractAsync } = useScaffoldWriteContract("PropertyNFT");

  useScaffoldWatchContractEvent({
    contractName: "PropertyNFT",
    eventName: "Minted",
    onLogs: async logs => {
      logs.map(async log => {
        const { tokenId, to } = log.args;
        console.log("Token ID:", tokenId);
        console.log("To:", to);

        try {
          const loadingToastId = notification.loading("Uploading property metadata to IPFS...");

          // Upload images to Pinata
          const imageUrls = await pinataService.uploadImages(form.images);

          // Generate metadata
          const metadata = pinataService.generateMetadata(tokenId?.toString() || "", form, imageUrls);

          // Upload metadata to Pinata
          const tokenUri = await pinataService.uploadMetadata(tokenId?.toString() || "", metadata);

          // Set the token URI

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
    console.log(form);

    try {
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
        {/* Bid or Direct Sale*/}
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

        {/* Listing Type */}
        {/* <div className="flex gap-4">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="listingType"
              checked={form.listingType === "sale"}
              onChange={() => setForm({ ...form, listingType: "sale" })}
              className="radio radio-primary"
            />
            For Sale
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="listingType"
              checked={form.listingType === "rent"}
              onChange={() => setForm({ ...form, listingType: "rent" })}
              className="radio radio-primary"
            />
            For Rent
          </label>
        </div> */}

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

        {/* Compartmentalization */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Compartmentalization</span>
          </label>
          <select
            value={form.compartmentalization}
            onChange={e => setForm({ ...form, compartmentalization: e.target.value })}
            className="select select-bordered w-full"
          >
            <option value="">Choose</option>
            <option value="detached">Detached</option>
            <option value="semi-detached">Semi-detached</option>
            <option value="not-detached">Not-detached</option>
            <option value="circular">Circular</option>
          </select>
        </div>

        {/* Comfort */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Comfort</span>
          </label>
          <select
            value={form.comfort}
            onChange={e => setForm({ ...form, comfort: e.target.value })}
            className="select select-bordered w-full"
          >
            <option value="">Choose</option>
            <option value="1">Comfort 1</option>
            <option value="2">Comfort 2</option>
            <option value="3">Comfort 3</option>
            <option value="lux">Lux</option>
          </select>
        </div>

        {/* Floor */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Floor</span>
          </label>
          <select
            value={form.floor}
            onChange={e => setForm({ ...form, floor: e.target.value })}
            className="select select-bordered w-full"
          >
            <option value="">Choose</option>
            <option value="basement">Basement</option>
            <option value="ground">Ground Floor</option>
            {[...Array(20)].map((_, i) => (
              <option key={i + 1} value={`${i + 1}`}>
                Floor {i + 1}
              </option>
            ))}
          </select>
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

        {/* Construction Year */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Construction Year</span>
          </label>
          <select
            value={form.constructionYear}
            onChange={e => setForm({ ...form, constructionYear: e.target.value })}
            className="select select-bordered w-full"
          >
            <option value="">Choose</option>
            {[...Array(124)].map((_, i) => (
              <option key={i} value={`${2024 - i}`}>
                {2024 - i}
              </option>
            ))}
          </select>
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
