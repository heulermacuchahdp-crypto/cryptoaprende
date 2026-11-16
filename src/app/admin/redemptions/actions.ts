"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type Result = { success: boolean; error: string | null };

function isValidUuid(v: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v);
}

function translateError(msg: string): string {
  const m = msg.toLowerCase();
  if (m.includes("apenas admins")) return "Apenas administradores podem fazer isto.";
  if (m.includes("estado invalido")) return "Estado inválido.";
  if (m.includes("nao encontrado")) return "Resgate não encontrado.";
  if (m.includes("rejeitado")) return "Um resgate rejeitado não pode mudar de estado.";
  if (m.includes("entregue")) return "Um resgate entregue não pode mudar de estado.";
  return msg;
}

export async function setRedemptionStatusAction(
  id: string,
  status: "pending" | "approved" | "rejected" | "delivered"
): Promise<Result> {
  if (!isValidUuid(id)) return { success: false, error: "ID inválido." };

  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Sessão expirada." };

  const { error } = await supabase.rpc("admin_set_redemption_status", {
    p_id: id,
    p_status: status,
  });

  if (error) return { success: false, error: translateError(error.message) };

  revalidatePath("/admin/redemptions");
  revalidatePath("/admin");
  revalidatePath("/rewards");
  revalidatePath("/dashboard");
  return { success: true, error: null };
}