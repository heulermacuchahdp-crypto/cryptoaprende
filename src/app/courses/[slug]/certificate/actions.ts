"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type Result = {
  success: boolean;
  error: string | null;
  code?: string;
  alreadyExisted?: boolean;
};

export async function issueCertificateAction(
  courseId: string
): Promise<Result> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { success: false, error: "Precisas de estar autenticado." };
  }

  const { data, error } = await supabase.rpc("issue_certificate", {
    p_course_id: courseId,
  });

  if (error) {
    const msg = error.message.toLowerCase();
    if (msg.includes("ainda nao completaste")) {
      return {
        success: false,
        error: "Ainda não completaste todas as lições deste curso.",
      };
    }
    return { success: false, error: error.message };
  }

  const row = Array.isArray(data) ? data[0] : data;

  revalidatePath(`/courses`);
  revalidatePath("/dashboard");

  return {
    success: true,
    error: null,
    code: row?.code,
    alreadyExisted: row?.already_existed ?? false,
  };
}