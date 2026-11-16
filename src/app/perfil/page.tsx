import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Bitcoin, ArrowLeft, Mail, Coins, Calendar, Shield } from "lucide-react";
import ProfileForm from "./ProfileForm";
import AvatarUploader from "./AvatarUploader";

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function PerfilPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name, bio, avatar_url, total_points, role, created_at")
    .eq("id", user.id)
    .single();

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <header className="border-b border-white/10 sticky top-0 bg-[#07111f]/95 backdrop-blur z-10">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-xl bg-teal-400 p-2 text-[#07111f]">
              <Bitcoin size={22} />
            </div>
            <span className="text-lg font-bold">
              Crypto<span className="text-teal-400">Aprende</span>
            </span>
          </Link>
          <Link
            href="/dashboard"
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-teal-400"
          >
            <ArrowLeft size={16} /> Painel
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <h1 className="text-3xl font-bold mb-2">O meu perfil</h1>
        <p className="text-gray-400 mb-8">Edita os teus dados e personaliza o teu avatar.</p>

        <div className="grid gap-6 md:grid-cols-3">
          <div className="md:col-span-1 space-y-6">
            <div className="rounded-2xl border border-white/10 bg-[#101e30] p-6 flex flex-col items-center">
              <AvatarUploader
                currentUrl={profile?.avatar_url ?? null}
                displayName={profile?.full_name || profile?.username || "?"}
              />
              <h2 className="text-xl font-bold mt-4 text-center">
                {profile?.username || user.email?.split("@")[0]}
              </h2>
              {profile?.role === "admin" && (
                <span className="mt-2 text-xs bg-teal-400/10 text-teal-400 px-2 py-1 rounded-full">
                  Administrador
                </span>
              )}
            </div>

            <div className="rounded-2xl border border-white/10 bg-[#101e30] p-6 space-y-4 text-sm">
              <div className="flex items-center gap-3">
                <Mail size={16} className="text-teal-400 shrink-0" />
                <div className="min-w-0">
                  <p className="text-xs text-gray-500">Email</p>
                  <p className="truncate">{user.email}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Coins size={16} className="text-teal-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Pontos</p>
                  <p className="font-bold">{profile?.total_points ?? 0}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Shield size={16} className="text-teal-400 shrink-0" />
                <div>
                  <p className="text-xs text-gray-500">Nivel</p>
                  <p className="capitalize">{profile?.role || "user"}</p>
                </div>
              </div>
              {profile?.created_at && (
                <div className="flex items-center gap-3">
                  <Calendar size={16} className="text-teal-400 shrink-0" />
                  <div>
                    <p className="text-xs text-gray-500">Membro desde</p>
                    <p>{formatDate(profile.created_at)}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="md:col-span-2">
            <div className="rounded-2xl border border-white/10 bg-[#101e30] p-6">
              <h2 className="text-lg font-bold mb-5">Dados pessoais</h2>
              <ProfileForm
                initial={{
                  username: profile?.username ?? "",
                  full_name: profile?.full_name ?? "",
                  bio: profile?.bio ?? "",
                }}
              />
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}