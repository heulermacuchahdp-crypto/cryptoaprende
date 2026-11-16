"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Check,
  X,
  Package,
  AlertCircle,
  Loader2,
} from "lucide-react";
import { setRedemptionStatusAction } from "./actions";

export default function RedemptionRowActions({
  id,
  currentStatus,
  pointsSpent,
  username,
  rewardTitle,
}: {
  id: string;
  currentStatus: string;
  pointsSpent: number;
  username: string;
  rewardTitle: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handle(newStatus: "approved" | "rejected" | "delivered") {
    const labels = {
      approved: "aprovar",
      rejected: `rejeitar (devolve ${pointsSpent} pts a ${username})`,
      delivered: "marcar como entregue",
    };

    if (
      !confirm(
        `Tens a certeza que queres ${labels[newStatus]} o resgate "${rewardTitle}"?`
      )
    )
      return;

    setError(null);
    start(async () => {
      const res = await setRedemptionStatusAction(id, newStatus);
      if (res.error) setError(res.error);
      else router.refresh();
    });
  }

  if (currentStatus === "delivered" || currentStatus === "rejected") {
    return <span className="text-xs text-gray-500 italic">—</span>;
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <div className="flex gap-1">
        {currentStatus === "pending" && (
          <>
            <button
              onClick={() => handle("approved")}
              disabled={pending}
              className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-teal-400 bg-teal-400/10 hover:bg-teal-400/20 disabled:opacity-50"
              title="Aprovar"
            >
              {pending ? <Loader2 size={10} className="animate-spin" /> : <Check size={10} />}
              Aprovar
            </button>
            <button
              onClick={() => handle("rejected")}
              disabled={pending}
              className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-red-400 bg-red-500/10 hover:bg-red-500/20 disabled:opacity-50"
              title="Rejeitar (devolve pontos)"
            >
              <X size={10} /> Rejeitar
            </button>
          </>
        )}
        {currentStatus === "approved" && (
          <button
            onClick={() => handle("delivered")}
            disabled={pending}
            className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-semibold text-teal-400 bg-teal-400/10 hover:bg-teal-400/20 disabled:opacity-50"
            title="Marcar como entregue"
          >
            {pending ? <Loader2 size={10} className="animate-spin" /> : <Package size={10} />}
            Entregar
          </button>
        )}
      </div>
      {error && (
        <span className="text-xs text-red-400 flex items-center gap-1 max-w-55 text-right">
          <AlertCircle size={10} className="shrink-0" /> {error}
        </span>
      )}
    </div>
  );
}