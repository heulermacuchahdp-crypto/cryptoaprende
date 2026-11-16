import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Bitcoin,
  Coins,
  Gift,
  CheckCircle,
  Clock,
  ShoppingBag,
} from "lucide-react";
import RedeemButton from "./RedeemButton";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function statusLabel(s: string) {
  if (s === "pending") return "Pendente";
  if (s === "approved") return "Aprovado";
  if (s === "rejected") return "Rejeitado";
  if (s === "delivered") return "Entregue";
  return s;
}

function statusColor(s: string) {
  if (s === "approved" || s === "delivered") return "text-teal-400";
  if (s === "rejected") return "text-red-400";
  return "text-yellow-400";
}

export default async function RewardsPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const [{ data: rewards }, { data: profile }, { data: redemptions }] =
    await Promise.all([
      supabase
        .from("rewards")
        .select("id, title, description, cost_points, stock")
        .eq("is_active", true)
        .order("cost_points", { ascending: true }),
      user
        ? supabase
            .from("profiles")
            .select("total_points")
            .eq("id", user.id)
            .single()
        : Promise.resolve({ data: null }),
      user
        ? supabase
            .from("redemptions")
            .select("id, points_spent, status, created_at, rewards(title)")
            .eq("user_id", user.id)
            .order("created_at", { ascending: false })
            .limit(10)
        : Promise.resolve({ data: null }),
    ]);

  const userPoints = profile?.total_points ?? 0;

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <header className="border-b border-white/10 sticky top-0 bg-[#07111f]/95 backdrop-blur z-10">
        <div className="mx-auto max-w-6xl flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-xl bg-teal-400 p-2 text-[#07111f]">
              <Bitcoin size={22} />
            </div>
            <span className="text-lg font-bold">
              Crypto<span className="text-teal-400">Aprende</span>
            </span>
          </Link>
          <div className="flex items-center gap-4 text-sm">
            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-400 hover:text-teal-400"
                >
                  Painel
                </Link>
                <span className="inline-flex items-center gap-1 bg-teal-400/10 text-teal-400 px-3 py-1 rounded-full font-semibold">
                  <Coins size={14} /> {userPoints} pts
                </span>
              </>
            ) : (
              <Link
                href="/login"
                className="rounded-lg bg-teal-400 text-[#07111f] font-bold px-4 py-2"
              >
                Entrar
              </Link>
            )}
          </div>
        </div>
      </header>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Recompensas</h1>
          <p className="text-gray-400">
            Troca os teus pontos por recompensas exclusivas.
          </p>
        </div>

        {!user && (
          <div className="rounded-xl border border-yellow-500/30 bg-yellow-500/10 p-4 mb-8 text-sm text-yellow-300">
            Faz{" "}
            <Link href="/login" className="underline font-semibold">
              login
            </Link>{" "}
            para resgatar recompensas.
          </div>
        )}

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 mb-10">
          {rewards?.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-white/10 bg-[#101e30] p-6 flex flex-col"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl bg-teal-400/10 p-3 text-teal-400">
                  <Gift size={22} />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold truncate">{r.title}</h3>
                  {r.stock !== null && (
                    <p className="text-xs text-gray-500">
                      {r.stock > 0 ? `${r.stock} disponiveis` : "Esgotado"}
                    </p>
                  )}
                </div>
              </div>

              <p className="text-sm text-gray-400 mb-4 flex-1">
                {r.description || "Recompensa exclusiva."}
              </p>

              <div className="flex items-center justify-between mb-4">
                <span className="inline-flex items-center gap-1 text-lg font-bold text-teal-400">
                  <Coins size={16} /> {r.cost_points} pts
                </span>
              </div>

              <RedeemButton
                rewardId={r.id}
                cost={r.cost_points}
                stock={r.stock}
                userPoints={userPoints}
                isAuthenticated={!!user}
              />
            </div>
          ))}
        </div>

        {rewards && rewards.length === 0 && (
          <p className="text-gray-500 text-center py-10">
            Ainda sem recompensas disponiveis.
          </p>
        )}

        {user && (
          <div className="rounded-2xl border border-white/10 bg-[#101e30] p-6">
            <div className="flex items-center gap-2 mb-5">
              <ShoppingBag className="text-teal-400" size={20} />
              <h2 className="text-lg font-bold">Os meus resgates</h2>
            </div>

            {redemptions && redemptions.length > 0 ? (
              <ul className="divide-y divide-white/10">
                {redemptions.map((r) => {
                  const reward = Array.isArray(r.rewards)
                    ? r.rewards[0]
                    : r.rewards;
                  return (
                    <li
                      key={r.id}
                      className="flex items-center justify-between py-3 text-sm"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <CheckCircle
                          size={14}
                          className="text-teal-400 shrink-0"
                        />
                        <div className="min-w-0">
                          <p className="font-medium truncate">
                            {reward?.title || "Recompensa"}
                          </p>
                          <p className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock size={10} /> {formatDate(r.created_at)}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-xs text-gray-400">
                          -{r.points_spent} pts
                        </span>
                        <span
                          className={`text-xs font-semibold ${statusColor(
                            r.status
                          )}`}
                        >
                          {statusLabel(r.status)}
                        </span>
                      </div>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 py-4">
                Ainda nao resgataste nenhuma recompensa.
              </p>
            )}
          </div>
        )}
      </section>
    </main>
  );
}