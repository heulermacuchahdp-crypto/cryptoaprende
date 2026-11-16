"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type Result = { success: boolean; error: string | null };

/**
 * Valida e traduz erros do RPC para mensagens amigáveis.
 */
function translateError(message: string): string {
  const m = message.toLowerCase();

  if (m.includes("apenas admins")) {
    return "Apenas administradores podem alterar roles.";
  }
  if (m.includes("role invalido")) {
    return "Role inválido. Usa 'user' ou 'admin'.";
  }
  if (m.includes("remover o teu proprio")) {
    return "Não podes remover o teu próprio acesso de administrador.";
  }
  if (m.includes("pelo menos um admin")) {
    return "Tem de existir sempre pelo menos um administrador.";
  }
  if (m.includes("not authenticated") || m.includes("jwt")) {
    return "Sessão expirada. Faz login novamente.";
  }

  return message;
}

/**
 * Verifica se um valor é um UUID v4 válido.
 */
function isValidUuid(value: string): boolean {
  const uuidRegex =
    /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
  return uuidRegex.test(value);
}

export async function setUserRoleAction(
  targetId: string,
  role: "user" | "admin"
): Promise<Result> {
  // ---------- 1. Validação de entrada ----------
  if (!targetId || !isValidUuid(targetId)) {
    return { success: false, error: "ID de utilizador inválido." };
  }

  if (role !== "user" && role !== "admin") {
    return { success: false, error: "Role inválido. Usa 'user' ou 'admin'." };
  }

  const supabase = await createClient();

  // ---------- 2. Verificar autenticação ----------
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Sessão expirada. Faz login novamente." };
  }

  // ---------- 3. Verificar que é admin ----------
  const { data: callerProfile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (callerProfile?.role !== "admin") {
    return {
      success: false,
      error: "Apenas administradores podem alterar roles.",
    };
  }

  // ---------- 4. Impedir auto-rebaixamento (defesa em profundidade) ----------
  if (user.id === targetId && role !== "admin") {
    return {
      success: false,
      error: "Não podes remover o teu próprio acesso de administrador.",
    };
  }

  // ---------- 5. Chamar o RPC (validação final no PostgreSQL) ----------
  const { error } = await supabase.rpc("admin_set_role", {
    p_target_id: targetId,
    p_role: role,
  });

  if (error) {
    return { success: false, error: translateError(error.message) };
  }

  // ---------- 6. Revalidar caches afetados ----------
  revalidatePath("/admin/users");
  revalidatePath("/admin");
  revalidatePath("/dashboard");

  return { success: true, error: null };
}