"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";

type State = { error: string | null; success: boolean };

// ============================================
// 1. Atualizar dados do perfil
// ============================================
export async function updateProfileAction(
  prevState: State,
  formData: FormData
): Promise<State> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sessao expirada. Faz login de novo.", success: false };
  }

  const username = formData.get("username")?.toString().trim() || "";
  const fullName = formData.get("full_name")?.toString().trim() || "";
  const bio = formData.get("bio")?.toString().trim() || "";

  if (username.length < 3 || username.length > 20) {
    return {
      error: "O username tem de ter entre 3 e 20 caracteres.",
      success: false,
    };
  }
  if (!/^[a-zA-Z0-9_.-]+$/.test(username)) {
    return {
      error:
        "Username invalido. Usa apenas letras, numeros, ponto, hifen ou underscore.",
      success: false,
    };
  }
  if (bio.length > 200) {
    return {
      error: "A bio nao pode ter mais de 200 caracteres.",
      success: false,
    };
  }

  const { error } = await supabase
    .from("profiles")
    .update({
      username,
      full_name: fullName,
      bio,
      updated_at: new Date().toISOString(),
    })
    .eq("id", user.id);

  if (error) {
    if (error.message.toLowerCase().includes("duplicate")) {
      return {
        error: "Este username ja esta em uso. Escolhe outro.",
        success: false,
      };
    }
    return { error: error.message, success: false };
  }

  revalidatePath("/perfil");
  revalidatePath("/dashboard");
  revalidatePath("/admin/perfil");
  revalidatePath("/admin/users");

  return { error: null, success: true };
}

// ============================================
// 2. Upload de avatar
// ============================================
export async function uploadAvatarAction(formData: FormData): Promise<State> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: "Sessao expirada.", success: false };
  }

  const file = formData.get("avatar") as File | null;
  if (!file || file.size === 0) {
    return { error: "Escolhe uma imagem.", success: false };
  }

  if (file.size > 5 * 1024 * 1024) {
    return { error: "A imagem nao pode ter mais de 5 MB.", success: false };
  }

  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.type)) {
    return {
      error: "Formato invalido. Usa JPEG, PNG ou WebP.",
      success: false,
    };
  }

  const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
  const path = `${user.id}/avatar.${ext}`;

  const { error: uploadError } = await supabase.storage
    .from("avatars")
    .upload(path, file, { upsert: true, contentType: file.type });

  if (uploadError) {
    return { error: uploadError.message, success: false };
  }

  const {
    data: { publicUrl },
  } = supabase.storage.from("avatars").getPublicUrl(path);

  const urlWithCache = `${publicUrl}?t=${Date.now()}`;

  const { error: updateError } = await supabase
    .from("profiles")
    .update({ avatar_url: urlWithCache, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (updateError) {
    return { error: updateError.message, success: false };
  }

  revalidatePath("/perfil");
  revalidatePath("/dashboard");
  revalidatePath("/admin/perfil");
  revalidatePath("/admin/users");

  return { error: null, success: true };
}

// ============================================
// 3. Remover avatar
// ============================================
export async function removeAvatarAction(): Promise<State> {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return { error: "Sessao expirada.", success: false };

  const { error } = await supabase
    .from("profiles")
    .update({ avatar_url: null, updated_at: new Date().toISOString() })
    .eq("id", user.id);

  if (error) return { error: error.message, success: false };

  revalidatePath("/perfil");
  revalidatePath("/dashboard");
  revalidatePath("/admin/perfil");
  revalidatePath("/admin/users");

  return { error: null, success: true };
}