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
  if (m.includes("slug invalido")) return "Slug inválido (só a-z, 0-9 e hífen).";
  if (m.includes("ja existe")) return "Já existe uma lição com este slug neste curso.";
  if (m.includes("titulo")) return "Título demasiado curto (mínimo 3 caracteres).";
  if (m.includes("duracao")) return "Duração inválida (1 a 120 minutos).";
  if (m.includes("pontos")) return "Pontos inválidos (0 a 1000).";
  if (m.includes("curso nao encontrado")) return "Curso não encontrado.";
  if (m.includes("licao nao encontrada")) return "Lição não encontrada.";
  return msg;
}

export async function createLessonAction(formData: FormData): Promise<Result> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Sessão expirada." };

  const courseId = formData.get("course_id")?.toString() || "";
  const slug = formData.get("slug")?.toString().trim() || "";
  const title = formData.get("title")?.toString().trim() || "";
  const content = formData.get("content")?.toString() || "";
  const duration = parseInt(formData.get("duration_minutes")?.toString() || "5", 10);
  const points = parseInt(formData.get("points_reward")?.toString() || "10", 10);
  const isPublished = formData.get("is_published") === "on";

  if (!isValidUuid(courseId)) return { success: false, error: "Curso inválido." };
  if (!/^[a-z0-9-]+$/.test(slug)) return { success: false, error: "Slug inválido." };
  if (title.length < 3) return { success: false, error: "Título demasiado curto." };

  const { error } = await supabase.rpc("admin_create_lesson", {
    p_course_id: courseId,
    p_slug: slug,
    p_title: title,
    p_content: content,
    p_duration_minutes: duration,
    p_points_reward: points,
    p_is_published: isPublished,
  });

  if (error) return { success: false, error: translateError(error.message) };

  revalidatePath("/admin/lessons");
  revalidatePath("/courses");
  revalidatePath("/admin");
  return { success: true, error: null };
}

export async function updateLessonAction(formData: FormData): Promise<Result> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Sessão expirada." };

  const id = formData.get("id")?.toString() || "";
  const title = formData.get("title")?.toString().trim() || "";
  const content = formData.get("content")?.toString() || "";
  const duration = parseInt(formData.get("duration_minutes")?.toString() || "5", 10);
  const points = parseInt(formData.get("points_reward")?.toString() || "10", 10);
  const order = parseInt(formData.get("order_index")?.toString() || "0", 10);

  if (!isValidUuid(id)) return { success: false, error: "ID inválido." };
  if (title.length < 3) return { success: false, error: "Título demasiado curto." };

  const { error } = await supabase.rpc("admin_update_lesson", {
    p_id: id,
    p_title: title,
    p_content: content,
    p_duration_minutes: duration,
    p_points_reward: points,
    p_order_index: order,
  });

  if (error) return { success: false, error: translateError(error.message) };

  revalidatePath("/admin/lessons");
  revalidatePath("/courses");
  revalidatePath("/admin");
  return { success: true, error: null };
}

export async function toggleLessonPublishAction(id: string): Promise<Result> {
  if (!isValidUuid(id)) return { success: false, error: "ID inválido." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_toggle_lesson_publish", { p_id: id });

  if (error) return { success: false, error: translateError(error.message) };

  revalidatePath("/admin/lessons");
  revalidatePath("/courses");
  revalidatePath("/admin");
  return { success: true, error: null };
}

export async function deleteLessonAction(id: string): Promise<Result> {
  if (!isValidUuid(id)) return { success: false, error: "ID inválido." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_delete_lesson", { p_id: id });

  if (error) return { success: false, error: translateError(error.message) };

  revalidatePath("/admin/lessons");
  revalidatePath("/courses");
  revalidatePath("/admin");
  return { success: true, error: null };
}