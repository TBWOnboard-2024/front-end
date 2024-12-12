import { useState } from "react";
import { useScaffoldReadContract, useScaffoldWriteContract } from "../../hooks/scaffold-eth";
import { EtherInput } from "./Input";
import { formatUnits, parseUnits } from "viem";
import { useAccount } from "wagmi";
import { BanknotesIcon } from "@heroicons/react/24/outline";
import { notification } from "~~/utils/scaffold-eth";

export const TBUSDMintButton = () => {
  const { address } = useAccount();
  const [loading, setLoading] = useState(false);
  const [mintAmount, setMintAmount] = useState("");

  // Read tBUSD balance
  const { data: tbusdBalance } = useScaffoldReadContract({
    contractName: "tBUSD",
    functionName: "balanceOf",
    args: [address as `0x${string}`],
  });

  // Write mint function
  const { writeContractAsync: mintTBUSD } = useScaffoldWriteContract("tBUSD");

  const handleMint = async () => {
    if (!address || !mintAmount) return;

    try {
      setLoading(true);
      await mintTBUSD({
        functionName: "mint",
        args: [address, parseUnits(mintAmount, 18)],
      });

      notification.success("Successfully minted tBUSD!");
      setMintAmount("");
    } catch (error) {
      console.error("Error minting tBUSD:", error);
      notification.error("Error minting tBUSD");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-3">
        <span className="text-sm font-bold">tBUSD Balance:</span>
        <span>{tbusdBalance ? formatUnits(tbusdBalance, 18) : "0"} tBUSD</span>
      </div>
      <div className="flex gap-2">
        <EtherInput value={mintAmount} onChange={value => setMintAmount(value)} placeholder="Amount to mint" />
        <button
          className="btn btn-secondary btn-sm px-2 rounded-full"
          onClick={handleMint}
          disabled={loading || !mintAmount}
        >
          {loading ? (
            <span className="loading loading-spinner loading-xs"></span>
          ) : (
            <>
              <BanknotesIcon className="h-4 w-4" />
              <span>Mint tBUSD</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
