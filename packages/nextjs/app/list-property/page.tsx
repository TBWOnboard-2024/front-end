"use client";

import { useState } from "react";
import { useScaffoldReadContract, useScaffoldWriteContract } from "../../hooks/scaffold-eth";
import { parseEther } from "viem";
import { useAccount } from "wagmi";
import { BuildingOffice2Icon, HomeIcon } from "@heroicons/react/24/outline";

type PropertyType = "Apartment" | "House" | "Ground" | "Commercial";
type ListingType = "sale" | "rent";

interface ListingForm {
  propertyType: PropertyType;
  listingType: ListingType;
  title: string;
  rooms: number;
  compartmentalization: string;
  comfort: string;
  floor: string;
  usableSurface: number;
  price: number;
  buyerCommission: boolean;
  location: string;
  constructionYear: string;
  levelsAboveGround: number;
  description: string;
  images: File[];
}

export default function ListPropertyPage() {
  const [form, setForm] = useState<ListingForm>({
    propertyType: "Apartment",
    listingType: "rent",
    title: "",
    rooms: 1,
    compartmentalization: "",
    comfort: "",
    floor: "",
    usableSurface: 0,
    price: 0,
    buyerCommission: false,
    location: "",
    constructionYear: "",
    levelsAboveGround: 0,
    description: "",
    images: [],
  });

  const { writeContractAsync: propertyNFTWriteContractAsync } = useScaffoldWriteContract("PropertyNFT");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would handle the form submission
    console.log("Form submitted:", form);
    console.log(parseEther("0.1", "wei"), "Test");

    try {
      await propertyNFTWriteContractAsync({
        functionName: "mint",
        args: [parseEther("0.1", "wei"), false, BigInt(1), "Test Address", BigInt(2), BigInt(1), BigInt(120)],
      });
    } catch (e) {
      console.error("Error setting greeting:", e);
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
            onClick={() => setForm({ ...form, propertyType: "Apartment" })}
            className={`flex flex-col items-center p-4 rounded-lg border-2 ${
              form.propertyType === "Apartment" ? "border-primary bg-primary/10" : "border-base-200"
            }`}
          >
            <BuildingOffice2Icon className="h-6 w-6" />
            <span>Apartment</span>
          </button>
          <button
            type="button"
            onClick={() => setForm({ ...form, propertyType: "House" })}
            className={`flex flex-col items-center p-4 rounded-lg border-2 ${
              form.propertyType === "House" ? "border-primary bg-primary/10" : "border-base-200"
            }`}
          >
            <HomeIcon className="h-6 w-6" />
            <span>House</span>
          </button>
          {/* Add similar buttons for Ground and Commercial */}
        </div>

        {/* Listing Type */}
        <div className="flex gap-4">
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
        </div>

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
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50">€</span>
          </div>
        </div>

        {/* Buyer's Commission */}
        <div className="form-control">
          <label className="label cursor-pointer justify-start gap-4">
            <input
              type="checkbox"
              checked={form.buyerCommission}
              onChange={e => setForm({ ...form, buyerCommission: e.target.checked })}
              className="checkbox checkbox-primary"
            />
            <span className="label-text">Buyer&apos;s commission</span>
          </label>
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

        {/* Levels Above Ground */}
        <div className="form-control">
          <label className="label">
            <span className="label-text">Levels Above Ground</span>
          </label>
          <input
            type="number"
            value={form.levelsAboveGround || ""}
            onChange={e => setForm({ ...form, levelsAboveGround: Number(e.target.value) })}
            className="input input-bordered w-full"
            placeholder="Number of levels above ground"
            min="0"
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
