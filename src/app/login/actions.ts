"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

type State = { error: string | null } | null;

export async function loginAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  const email = formData.get("email")?.toString().trim() || "";
  const password = formData.get("password")?.toString() || "";

  if (!email || !password) {
    return { error: "Preenche o email e a password." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    if (error.message.toLowerCase().includes("invalid login")) {
      return { error: "Email ou password incorretos." };
    }
    return { error: error.message };
  }

  if (!data?.user) {
    return { error: "Erro desconhecido no login." };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (profile?.role === "admin") {
    redirect("/admin");
  }

  redirect("/dashboard");
}