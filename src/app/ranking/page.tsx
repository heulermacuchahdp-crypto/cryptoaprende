import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Bitcoin,
  Crown,
  Users,
  Coins,
  ArrowLeft,
  BookOpen,
} from "lucide-react";

type RankedUser = {
  rank: number;
  id: string;
  username: string;
  full_name: string | null;
  avatar_url: string | null;
  total_points: number;
  lessons_completed: number;
};

function initials(name: string | null | undefined) {
  const s = (name || "?").trim();
  return s.slice(0, 2).toUpperCase();
}

export default async function RankingPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data, error } = await supabase.rpc("get_public_leaderboard", {
    p_limit: 100,
  });

  if (error) {
    return (
      <main className="min-h-screen bg-[#07111f] text-white p-8">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
          Erro ao carregar ranking: {error.message}
        </div>
      </main>
    );
  }

  const users = (data as RankedUser[]) ?? [];
  const top3 = users.slice(0, 3);
  const myPosition = user ? users.find((u) => u.id === user.id) : null;

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
            href={user ? "/dashboard" : "/login"}
            className="flex items-center gap-2 text-sm text-gray-400 hover:text-teal-400"
          >
            <ArrowLeft size={16} /> {user ? "Painel" : "Entrar"}
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-5xl px-6 py-10">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-bold mb-2">Ranking Global</h1>
          <p className="text-gray-400">
            Os melhores aprendizes do CryptoAprende
          </p>
        </div>

        {users.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#101e30] p-8 text-center">
            <Users className="text-teal-400 mx-auto mb-3" size={40} />
            <p className="text-gray-400">Ainda sem utilizadores no ranking.</p>
          </div>
        ) : (
          <>
            {/* PÓDIO */}
            <div className="grid grid-cols-3 gap-3 mb-10 max-w-2xl mx-auto">
              {/* 2º lugar */}
              {top3[1] && (
                <Link
                  href={`/u/${top3[1].username}`}
                  className="mt-8 rounded-2xl border border-white/10 bg-[#101e30] p-4 text-center block hover:border-teal-400/50 hover:-translate-y-1 transition-all"
                >
                  <div className="relative inline-block">
                    <div className="h-14 w-14 rounded-full overflow-hidden bg-gray-400 text-[#07111f] text-lg font-bold flex items-center justify-center mx-auto">
                      {top3[1].avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={top3[1].avatar_url}
                          alt={top3[1].username}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initials(top3[1].full_name || top3[1].username)
                      )}
                    </div>
                    <div className="absolute -top-2 -right-2 bg-gray-400 text-[#07111f] rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
                      2
                    </div>
                  </div>
                  <p className="mt-3 font-semibold truncate text-sm">
                    {top3[1].username}
                  </p>
                  <p className="text-xs text-teal-400 font-bold mt-1">
                    {top3[1].total_points} pts
                  </p>
                </Link>
              )}

              {/* 1º lugar */}
              {top3[0] && (
                <Link
                  href={`/u/${top3[0].username}`}
                  className="rounded-2xl border border-yellow-400/40 bg-yellow-400/5 p-4 text-center block hover:border-yellow-400/80 hover:-translate-y-1 transition-all"
                >
                  <Crown className="text-yellow-400 mx-auto mb-2" size={24} />
                  <div className="relative inline-block">
                    <div className="h-16 w-16 rounded-full overflow-hidden bg-yellow-400 text-[#07111f] text-xl font-bold flex items-center justify-center mx-auto">
                      {top3[0].avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={top3[0].avatar_url}
                          alt={top3[0].username}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initials(top3[0].full_name || top3[0].username)
                      )}
                    </div>
                    <div className="absolute -top-2 -right-2 bg-yellow-400 text-[#07111f] rounded-full h-7 w-7 flex items-center justify-center text-sm font-bold">
                      1
                    </div>
                  </div>
                  <p className="mt-3 font-bold truncate">{top3[0].username}</p>
                  <p className="text-sm text-yellow-400 font-bold mt-1">
                    {top3[0].total_points} pts
                  </p>
                </Link>
              )}

              {/* 3º lugar */}
              {top3[2] && (
                <Link
                  href={`/u/${top3[2].username}`}
                  className="mt-8 rounded-2xl border border-white/10 bg-[#101e30] p-4 text-center block hover:border-teal-400/50 hover:-translate-y-1 transition-all"
                >
                  <div className="relative inline-block">
                    <div className="h-14 w-14 rounded-full overflow-hidden bg-amber-600 text-[#07111f] text-lg font-bold flex items-center justify-center mx-auto">
                      {top3[2].avatar_url ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={top3[2].avatar_url}
                          alt={top3[2].username}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        initials(top3[2].full_name || top3[2].username)
                      )}
                    </div>
                    <div className="absolute -top-2 -right-2 bg-amber-600 text-white rounded-full h-6 w-6 flex items-center justify-center text-xs font-bold">
                      3
                    </div>
                  </div>
                  <p className="mt-3 font-semibold truncate text-sm">
                    {top3[2].username}
                  </p>
                  <p className="text-xs text-teal-400 font-bold mt-1">
                    {top3[2].total_points} pts
                  </p>
                </Link>
              )}
            </div>

            {/* TABELA COMPLETA */}
            <div className="rounded-2xl border border-white/10 bg-[#101e30] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-[#0b1828] text-left text-xs uppercase tracking-widest text-gray-500">
                    <tr>
                      <th className="px-5 py-3 w-16">#</th>
                      <th className="px-5 py-3">Utilizador</th>
                      <th className="px-5 py-3">Lições</th>
                      <th className="px-5 py-3 text-right">Pontos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {users.map((u) => {
                      const isMe = user?.id === u.id;
                      return (
                        <tr
                          key={u.id}
                          className={isMe ? "bg-teal-400/5" : "hover:bg-white/5"}
                        >
                          <td className="px-5 py-3">
                            <span
                              className={`inline-flex items-center justify-center h-7 w-7 rounded-full text-xs font-bold ${
                                u.rank === 1
                                  ? "bg-yellow-400 text-[#07111f]"
                                  : u.rank === 2
                                  ? "bg-gray-400 text-[#07111f]"
                                  : u.rank === 3
                                  ? "bg-amber-600 text-white"
                                  : "text-gray-500"
                              }`}
                            >
                              {u.rank}
                            </span>
                          </td>
                          <td className="px-5 py-3">
                            <Link
                              href={`/u/${u.username}`}
                              className="flex items-center gap-3 group"
                            >
                              <div className="h-8 w-8 rounded-full overflow-hidden bg-teal-400 text-[#07111f] text-xs font-bold flex items-center justify-center shrink-0">
                                {u.avatar_url ? (
                                  // eslint-disable-next-line @next/next/no-img-element
                                  <img
                                    src={u.avatar_url}
                                    alt={u.username}
                                    className="h-full w-full object-cover"
                                  />
                                ) : (
                                  initials(u.full_name || u.username)
                                )}
                              </div>
                              <div className="min-w-0">
                                <p className="font-medium truncate group-hover:text-teal-400">
                                  {u.username}
                                  {isMe && (
                                    <span className="text-teal-400 text-xs ml-1">
                                      (tu)
                                    </span>
                                  )}
                                </p>
                                {u.full_name && (
                                  <p className="text-xs text-gray-500 truncate">
                                    {u.full_name}
                                  </p>
                                )}
                              </div>
                            </Link>
                          </td>
                          <td className="px-5 py-3 text-xs text-gray-400">
                            <span className="inline-flex items-center gap-1">
                              <BookOpen size={12} /> {u.lessons_completed}
                            </span>
                          </td>
                          <td className="px-5 py-3 text-right">
                            <span className="text-teal-400 font-bold">
                              {u.total_points}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>

            {/* MINHA POSIÇÃO (se fora do top 100) */}
            {myPosition && myPosition.rank > 100 && (
              <Link
                href={`/u/${myPosition.username}`}
                className="mt-4 rounded-2xl border border-teal-400/30 bg-teal-400/5 p-4 flex items-center justify-between hover:bg-teal-400/10 transition"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-bold text-teal-400">
                    #{myPosition.rank}
                  </span>
                  <span className="font-medium">{myPosition.username} (tu)</span>
                </div>
                <span className="text-teal-400 font-bold">
                  {myPosition.total_points} pts
                </span>
              </Link>
            )}

            {/* CTA */}
            <div className="mt-8 text-center">
              {!user ? (
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-[#07111f] font-bold px-6 py-3 transition"
                >
                  <Coins size={18} /> Entrar no ranking
                </Link>
              ) : (
                <Link
                  href="/courses"
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-[#07111f] font-bold px-6 py-3 transition"
                >
                  <BookOpen size={18} /> Concluir mais lições
                </Link>
              )}
            </div>
          </>
        )}
      </section>
    </main>
  );
}
