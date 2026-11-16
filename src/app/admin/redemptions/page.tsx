import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft } from "lucide-react";
import RedemptionsTable from "./RedemptionsTable";

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

export default async function AdminRedemptionsPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("admin_list_redemptions");

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
          Erro ao carregar resgates: {error.message}
        </div>
      </div>
    );
  }

  const redemptions = (data as Redemption[]) ?? [];
  const pending = redemptions.filter((r) => r.status === "pending").length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Resgates</h1>
          <p className="text-gray-400">
            {redemptions.length} resgate{redemptions.length !== 1 ? "s" : ""} ·{" "}
            {pending} pendente{pending !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-teal-400"
        >
          <ArrowLeft size={16} /> Voltar
        </Link>
      </div>

      <RedemptionsTable redemptions={redemptions} />
    </div>
  );
}