"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type Result = { points: number; error: string | null };

export async function completeLessonAction(lessonId: string): Promise<Result> {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { points: 0, error: "Precisas de estar autenticado." };
  }

  const { data, error } = await supabase.rpc("award_lesson_points", {
    p_lesson_id: lessonId,
    p_score: null,
  });

  if (error) {
    return { points: 0, error: error.message };
  }

  revalidatePath("/dashboard");
  return { points: typeof data === "number" ? data : 0, error: null };
}