"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type State = { error: string | null } | null;

export async function registerAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  const username = formData.get("username")?.toString().trim() || "";
  const email = formData.get("email")?.toString().trim() || "";
  const password = formData.get("password")?.toString() || "";
  const confirm = formData.get("confirm")?.toString() || "";

  if (username.length < 3) {
    return { error: "O username tem de ter pelo menos 3 caracteres." };
  }
  if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
    return { error: "O username só pode ter letras, números, ponto, hífen ou underscore." };
  }
  if (!email.includes("@") || email.length < 5) {
    return { error: "Introduz um email válido." };
  }
  if (password.length < 8) {
    return { error: "A password tem de ter pelo menos 8 caracteres." };
  }
  if (password !== confirm) {
    return { error: "As passwords não coincidem." };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: { data: { username } },
  });

  if (error) {
    if (
      error.message.toLowerCase().includes("already registered") ||
      error.message.toLowerCase().includes("user already")
    ) {
      return { error: "Este email já está registado. Tenta entrar." };
    }
    return { error: error.message };
  }

  redirect("/dashboard");
}