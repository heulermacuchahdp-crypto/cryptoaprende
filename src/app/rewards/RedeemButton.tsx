"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Gift, AlertCircle, CheckCircle, Lock } from "lucide-react";
import { redeemRewardAction } from "./actions";

export default function RedeemButton({
  rewardId,
  cost,
  stock,
  userPoints,
  isAuthenticated,
}: {
  rewardId: string;
  cost: number;
  stock: number | null;
  userPoints: number;
  isAuthenticated: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const noStock = stock !== null && stock <= 0;
  const notEnough = userPoints < cost;
  const disabled = !isAuthenticated || noStock || notEnough || pending;

  function handleRedeem() {
    if (!confirm(`Resgatar por ${cost} pontos?`)) return;
    setError(null);
    start(async () => {
      const res = await redeemRewardAction(rewardId);
      if (res.error) {
        setError(res.error);
      } else {
        setSuccess(true);
        router.refresh();
      }
    });
  }

  if (success) {
    return (
      <div className="flex items-center gap-2 text-sm text-teal-400 font-semibold">
        <CheckCircle size={16} /> Resgatado!
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleRedeem}
        disabled={disabled}
        className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-bold transition ${
          disabled
            ? "bg-gray-700 text-gray-500 cursor-not-allowed"
            : "bg-teal-400 hover:bg-teal-300 text-[#07111f]"
        }`}
      >
        {noStock ? (
          <>
            <Lock size={14} /> Esgotado
          </>
        ) : notEnough ? (
          <>
            <Lock size={14} /> Faltam {cost - userPoints} pts
          </>
        ) : pending ? (
          "A resgatar..."
        ) : (
          <>
            <Gift size={14} /> Resgatar
          </>
        )}
      </button>

      {error && (
        <div className="mt-2 text-xs text-red-400 flex items-center gap-1">
          <AlertCircle size={12} /> {error}
        </div>
      )}
    </div>
  );
}