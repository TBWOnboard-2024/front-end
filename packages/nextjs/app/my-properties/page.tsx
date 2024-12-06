"use client";

import { useScaffoldReadContract } from "../../hooks/scaffold-eth";
import { useAccount } from "wagmi";

export default function MyProperties() {
  const { address } = useAccount();
  const { data: properties } = useScaffoldReadContract({
    contractName: "PropertyNFT",
    functionName: "tokensByAddress",
    args: [address],
  });

  console.log(properties);

  return <div>My Properties</div>;
}
