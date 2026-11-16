"use client";

import { useState, useMemo } from "react";
import { Clock, CheckCircle, XCircle, Package, Filter } from "lucide-react";
import RedemptionRowActions from "./RedemptionRowActions";

type Redemption = {
  id: string;
  user_id: string;
  username: string | null;
  user_email: string | null;
  reward_id: string;
  reward_title: string | null;
  points_spent: number;
  status: string;
  created_at: string;
};

function statusBadge(s: string) {
  if (s === "pending") return { Icon: Clock, label: "Pendente", color: "text-yellow-400 bg-yellow-500/10" };
  if (s === "approved") return { Icon: CheckCircle, label: "Aprovado", color: "text-teal-400 bg-teal-400/10" };
  if (s === "rejected") return { Icon: XCircle, label: "Rejeitado", color: "text-red-400 bg-red-500/10" };
  if (s === "delivered") return { Icon: Package, label: "Entregue", color: "text-teal-400 bg-teal-400/10" };
  return { Icon: Clock, label: s, color: "text-gray-400 bg-gray-500/10" };
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default function RedemptionsTable({
  redemptions,
}: {
  redemptions: Redemption[];
}) {
  const [filter, setFilter] = useState<string>("all");

  const counts = useMemo(
    () => ({
      all: redemptions.length,
      pending: redemptions.filter((r) => r.status === "pending").length,
      approved: redemptions.filter((r) => r.status === "approved").length,
      delivered: redemptions.filter((r) => r.status === "delivered").length,
      rejected: redemptions.filter((r) => r.status === "rejected").length,
    }),
    [redemptions]
  );

  const filtered = useMemo(() => {
    if (filter === "all") return redemptions;
    return redemptions.filter((r) => r.status === filter);
  }, [redemptions, filter]);

  return (
    <>
      <div className="flex flex-wrap items-center gap-2 mb-4">
        <Filter size={16} className="text-gray-400" />
        {(["all", "pending", "approved", "delivered", "rejected"] as const).map((s) => {
          const label =
            s === "all"
              ? "Todos"
              : s === "pending"
              ? "Pendentes"
              : s === "approved"
              ? "Aprovados"
              : s === "delivered"
              ? "Entregues"
              : "Rejeitados";
          const count = counts[s];
          const active = filter === s;
          return (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                active
                  ? "bg-teal-400 text-[#07111f]"
                  : "bg-[#101e30] border border-white/10 text-gray-400 hover:text-white hover:border-teal-400/50"
              }`}
            >
              {label} ({count})
            </button>
          );
        })}
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#101e30] p-8 text-center">
          <Package className="text-teal-400 mx-auto mb-3" size={40} />
          <p className="text-gray-400">
            {filter === "all"
              ? "Ainda não há resgates."
              : "Nenhum resgate com este estado."}
          </p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-[#101e30] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#0b1828] text-left text-xs uppercase tracking-widest text-gray-500">
                <tr>
                  <th className="px-5 py-3">Utilizador</th>
                  <th className="px-5 py-3">Recompensa</th>
                  <th className="px-5 py-3">Pontos</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3">Data</th>
                  <th className="px-5 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((r) => {
                  const badge = statusBadge(r.status);
                  const Icon = badge.Icon;
                  return (
                    <tr key={r.id} className="hover:bg-white/5">
                      <td className="px-5 py-4">
                        <div>
                          <p className="font-medium">
                            {r.username || "Sem username"}
                          </p>
                          <p className="text-xs text-gray-500">
                            {r.user_email || "—"}
                          </p>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-300">
                        {r.reward_title || "—"}
                      </td>
                      <td className="px-5 py-4 text-xs text-teal-400 font-semibold">
                        {r.points_spent} pts
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${badge.color}`}
                        >
                          <Icon size={10} /> {badge.label}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-500">
                        {formatDate(r.created_at)}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <RedemptionRowActions
                          id={r.id}
                          currentStatus={r.status}
                          pointsSpent={r.points_spent}
                          username={r.username || "utilizador"}
                          rewardTitle={r.reward_title || "recompensa"}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </>
  );
}