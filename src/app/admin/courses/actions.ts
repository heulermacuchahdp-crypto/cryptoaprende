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
  if (m.includes("ja existe")) return "Já existe um curso com este slug.";
  if (m.includes("titulo")) return "Título demasiado curto (mínimo 3 caracteres).";
  if (m.includes("nivel invalido")) return "Nível inválido.";
  if (m.includes("nao encontrado")) return "Curso não encontrado.";
  return msg;
}

export async function createCourseAction(formData: FormData): Promise<Result> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Sessão expirada." };

  const slug = formData.get("slug")?.toString().trim() || "";
  const title = formData.get("title")?.toString().trim() || "";
  const description = formData.get("description")?.toString().trim() || "";
  const level = formData.get("level")?.toString() || "beginner";
  const icon = formData.get("icon")?.toString() || "BookOpen";
  const isPublished = formData.get("is_published") === "on";

  if (!/^[a-z0-9-]+$/.test(slug)) {
    return { success: false, error: "Slug inválido (só a-z, 0-9 e hífen)." };
  }
  if (title.length < 3) {
    return { success: false, error: "Título demasiado curto." };
  }

  const { error } = await supabase.rpc("admin_create_course", {
    p_slug: slug,
    p_title: title,
    p_description: description,
    p_level: level,
    p_icon: icon,
    p_is_published: isPublished,
  });

  if (error) return { success: false, error: translateError(error.message) };

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath("/admin");
  return { success: true, error: null };
}

export async function updateCourseAction(formData: FormData): Promise<Result> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { success: false, error: "Sessão expirada." };

  const id = formData.get("id")?.toString() || "";
  const title = formData.get("title")?.toString().trim() || "";
  const description = formData.get("description")?.toString().trim() || "";
  const level = formData.get("level")?.toString() || "beginner";
  const icon = formData.get("icon")?.toString() || "BookOpen";

  if (!isValidUuid(id)) return { success: false, error: "ID inválido." };
  if (title.length < 3) return { success: false, error: "Título demasiado curto." };

  const { error } = await supabase.rpc("admin_update_course", {
    p_id: id,
    p_title: title,
    p_description: description,
    p_level: level,
    p_icon: icon,
  });

  if (error) return { success: false, error: translateError(error.message) };

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath("/admin");
  return { success: true, error: null };
}

export async function togglePublishAction(id: string): Promise<Result> {
  if (!isValidUuid(id)) return { success: false, error: "ID inválido." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_toggle_course_publish", { p_id: id });

  if (error) return { success: false, error: translateError(error.message) };

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath("/admin");
  return { success: true, error: null };
}

export async function deleteCourseAction(id: string): Promise<Result> {
  if (!isValidUuid(id)) return { success: false, error: "ID inválido." };

  const supabase = await createClient();
  const { error } = await supabase.rpc("admin_delete_course", { p_id: id });

  if (error) return { success: false, error: translateError(error.message) };

  revalidatePath("/admin/courses");
  revalidatePath("/courses");
  revalidatePath("/admin");
  return { success: true, error: null };
}