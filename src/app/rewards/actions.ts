"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type Result = { success: boolean; error: string | null };

export async function redeemRewardAction(rewardId: string): Promise<Result> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Precisas de estar autenticado." };
  }

  const { data, error } = await supabase.rpc("redeem_reward", {
    p_reward_id: rewardId,
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("insuficiente")) {
      return { success: false, error: "Nao tens pontos suficientes." };
    }
    if (msg.includes("stock")) {
      return { success: false, error: "Esta recompensa ja esgotou." };
    }
    if (msg.includes("indisponivel")) {
      return { success: false, error: "Recompensa indisponivel." };
    }
    return { success: false, error: error.message };
  }

  revalidatePath("/rewards");
  revalidatePath("/dashboard");

  return { success: true, error: null };
}