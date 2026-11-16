import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Bitcoin,
  ArrowLeft,
  Coins,
  BookOpen,
  Calendar,
  Medal,
  Trophy,
  Star,
  Flame,
  Award,
  Zap,
} from "lucide-react";

type PublicProfile = {
  id: string;
  username: string;
  full_name: string | null;
  bio: string | null;
  avatar_url: string | null;
  total_points: number;
  lessons_completed: number;
  rank: number;
  created_at: string;
};

function initials(name: string | null | undefined) {
  const s = (name || "?").trim();
  return s.slice(0, 2).toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default async function PublicProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = await params;
  const decodedUsername = decodeURIComponent(username);
  const supabase = await createClient();

  const {
    data: { user: currentUser },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.rpc("get_public_profile", {
    p_username: decodedUsername,
  });

  if (error || !data || data.length === 0) {
    notFound();
  }

  const profile = (data as PublicProfile[])[0];
  const isMe = currentUser?.id === profile.id;

  const totalPoints = profile.total_points;
  const lessons = Number(profile.lessons_completed);

  const achievements = [
    {
      icon: <Star size={18} />,
      label: "Primeiro passo",
      unlocked: lessons >= 1,
    },
    {
      icon: <Flame size={18} />,
      label: "Aprendiz dedicado",
      unlocked: lessons >= 5,
    },
    {
      icon: <Coins size={18} />,
      label: "Colecionador",
      unlocked: totalPoints >= 50,
    },
    {
      icon: <Zap size={18} />,
      label: "Imparavel",
      unlocked: totalPoints >= 100,
    },
    {
      icon: <Trophy size={18} />,
      label: "Maratonista",
      unlocked: lessons >= 10,
    },
    {
      icon: <Award size={18} />,
      label: "Mestre",
      unlocked: totalPoints >= 500,
    },
  ];

  const unlockedCount = achievements.filter((a) => a.unlocked).length;

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <header className="border-b border-white/10 sticky top-0 bg-[#07111f]/95 backdrop-blur z-10">
        <div className="mx-auto max-w-4xl flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-xl bg-teal-400 p-2 text-[#07111f]">
              <Bitcoin size={22} />
            </div>
            <span className="text-lg font-bold">
              Crypto<span className="text-teal-400">Aprende</span>
            </span>
          </Link>
          <Link
            href={currentUser ? "/ranking" : "/login"}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-teal-400"
          >
            <ArrowLeft size={16} /> {currentUser ? "Ranking" : "Entrar"}
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-4xl px-6 py-10">
        {/* HERO DO PERFIL */}
        <div className="rounded-3xl border border-white/10 bg-linear-to-br from-[#101e30] to-[#0b1828] p-8 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
            <div className="h-24 w-24 rounded-full overflow-hidden bg-teal-400 text-[#07111f] text-3xl font-bold flex items-center justify-center shrink-0 border-4 border-[#07111f]">
              {profile.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={profile.username}
                  className="h-full w-full object-cover"
                />
              ) : (
                initials(profile.full_name || profile.username)
              )}
            </div>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="text-3xl font-bold mb-1">{profile.username}</h1>
              {profile.full_name && (
                <p className="text-gray-400 mb-3">{profile.full_name}</p>
              )}

              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                <Link
                  href="/ranking"
                  className="inline-flex items-center gap-1 text-xs bg-teal-400/10 text-teal-400 px-2 py-1 rounded-full hover:bg-teal-400/20"
                >
                  <Medal size={12} /> #{profile.rank} no ranking
                </Link>
                <span className="inline-flex items-center gap-1 text-xs bg-white/5 text-gray-400 px-2 py-1 rounded-full">
                  <Calendar size={12} /> Desde {formatDate(profile.created_at)}
                </span>
              </div>

              {profile.bio && (
                <p className="text-sm text-gray-300 mb-4 max-w-xl">
                  {profile.bio}
                </p>
              )}

              {isMe && (
                <Link
                  href="/perfil"
                  className="inline-block text-sm text-teal-400 hover:underline"
                >
                  Editar o meu perfil →
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* STATS */}
        <div className="grid gap-4 sm:grid-cols-3 mb-8">
          <div className="rounded-2xl border border-white/10 bg-[#101e30] p-5">
            <div className="flex items-center gap-2 mb-2 text-teal-400">
              <Coins size={18} />
              <span className="text-xs text-gray-400">Pontos totais</span>
            </div>
            <div className="text-2xl font-bold">{totalPoints}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#101e30] p-5">
            <div className="flex items-center gap-2 mb-2 text-teal-400">
              <BookOpen size={18} />
              <span className="text-xs text-gray-400">Licoes concluidas</span>
            </div>
            <div className="text-2xl font-bold">{lessons}</div>
          </div>
          <div className="rounded-2xl border border-white/10 bg-[#101e30] p-5">
            <div className="flex items-center gap-2 mb-2 text-teal-400">
              <Award size={18} />
              <span className="text-xs text-gray-400">Conquistas</span>
            </div>
            <div className="text-2xl font-bold">
              {unlockedCount}
              <span className="text-base text-gray-500 font-normal">
                /6
              </span>
            </div>
          </div>
        </div>

        {/* CONQUISTAS */}
        <div className="rounded-2xl border border-white/10 bg-[#101e30] p-6">
          <div className="flex items-center gap-2 mb-5">
            <Award className="text-teal-400" size={20} />
            <h2 className="text-lg font-bold">Conquistas</h2>
            <span className="text-xs text-gray-500 ml-2">
              {unlockedCount} de {achievements.length} desbloqueadas
            </span>
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
            {achievements.map((a) => (
              <div
                key={a.label}
                className={`rounded-xl p-3 text-center border ${
                  a.unlocked
                    ? "border-teal-400/40 bg-teal-400/10"
                    : "border-white/10 bg-[#0b1828] opacity-50"
                }`}
              >
                <div
                  className={`mx-auto mb-2 flex h-9 w-9 items-center justify-center rounded-full ${
                    a.unlocked
                      ? "bg-teal-400 text-[#07111f]"
                      : "bg-gray-700 text-gray-500"
                  }`}
                >
                  {a.icon}
                </div>
                <p
                  className={`text-xs font-semibold ${
                    a.unlocked ? "text-white" : "text-gray-500"
                  }`}
                >
                  {a.label}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}