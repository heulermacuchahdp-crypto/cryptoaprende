"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type Result = {
  success: boolean;
  error: string | null;
  score?: number;
  total?: number;
  bonus?: number;
  attemptsUsed?: number;
  attemptsLeft?: number;
};

export async function submitQuizAction(
  lessonId: string,
  answers: Record<string, string>
): Promise<Result> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Precisas de estar autenticado." };
  }

  const { data, error } = await supabase.rpc("submit_quiz", {
    p_lesson_id: lessonId,
    p_answers: answers,
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("limite de") && msg.includes("tentativas")) {
      return {
        success: false,
        error: "Atingiste o limite de 3 tentativas para este quiz.",
      };
    }
    return { success: false, error: error.message };
  }

  const row = Array.isArray(data) ? data[0] : data;

  revalidatePath("/dashboard");
  revalidatePath("/rewards");
  revalidatePath("/ranking");

  return {
    success: true,
    error: null,
    score: row?.score ?? 0,
    total: row?.total ?? 0,
    bonus: row?.points_awarded ?? 0,
    attemptsUsed: row?.attempts_used ?? 0,
    attemptsLeft: row?.attempts_left ?? 0,
  };
}