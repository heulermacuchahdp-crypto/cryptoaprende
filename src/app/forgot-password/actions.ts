"use server";

import { createClient } from "@/lib/supabase/server";

type State = { error: string | null; success: boolean };

export async function forgotPasswordAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  const email = formData.get("email")?.toString().trim() || "";

  if (!email || !email.includes("@")) {
    return { error: "Introduz um email valido.", success: false };
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"}/reset-password`,
  });

  if (error) {
    return { error: error.message, success: false };
  }

  return { error: null, success: true };
}
