"use client";

import { useScaffoldReadContract } from "../../hooks/scaffold-eth";

export default function MyProperties() {
  const { data: properties } = useScaffoldReadContract({
    contractName: "PropertyNFT",
    functionName: "tokensByAddress",
    args: ["0xB2A043a4F4BB5090f1D5D012c9f8767bA9Eba866"],
  });

  console.log(properties);

  return <div>My Properties</div>;
}
