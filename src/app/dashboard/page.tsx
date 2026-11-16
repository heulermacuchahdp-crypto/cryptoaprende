import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  Bitcoin,
  Coins,
  LogOut,
  BookOpen,
  Trophy,
  ArrowRight,
  Clock,
  TrendingUp,
  Target,
  Flame,
  Award,
  Star,
  Zap,
  Lock,
  CheckCircle,
  Gift,
  GraduationCap,
  ShoppingBag,
  User,
  Medal,
} from "lucide-react";
import { logoutAction } from "./actions";
import PointsChart from "./PointsChart";
import NotificationBell from "@/components/NotificationBell";
import StreakWidget from "@/components/StreakWidget";

function initials(name: string | null | undefined, fallback: string) {
  const source = (name || fallback || "?").trim();
  return source.slice(0, 2).toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "short",
  });
}

function reasonLabel(reason: string) {
  if (reason === "lesson_completed") return "Licao concluida";
  if (reason === "reward_redeemed") return "Recompensa resgatada";
  if (reason === "quiz_bonus") return "Bonus de quiz";
  if (reason === "redemption_refunded") return "Reembolso de resgate";
  if (reason === "streak_bonus") return "Bonus de streak";
  return reason;
}

function calcStreak(dates: string[]) {
  if (dates.length === 0) return 0;
  const days = new Set(
    dates.map((d) => new Date(d).toISOString().slice(0, 10))
  );
  let streak = 0;
  const today = new Date();
  for (let i = 0; i < 365; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const key = d.toISOString().slice(0, 10);
    if (days.has(key)) {
      streak++;
    } else if (i === 0) {
      continue;
    } else {
      break;
    }
  }
  return streak;
}

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  // 1. Profile (antes do Promise.all para permitir redirect de admin)
  const { data: profile } = await supabase
    .from("profiles")
    .select("username, full_name, avatar_url, total_points, role")
    .eq("id", user.id)
    .single();

  if (profile?.role === "admin") {
    redirect("/admin");
  }

  // 2. Resto em paralelo (incluindo streak bonus e notificações)
  const [
    { count: lessonsCompleted },
    { data: allLessons },
    { data: progressRows },
    { data: recentTx },
    { count: totalLessons },
    { data: coursesProgress },
    { data: allTxDates },
    { data: leaderboard },
    { count: myRank },
    { data: unreadCount },
    { data: streakBonusResult },
  ] = await Promise.all([
    supabase
      .from("user_progress")
      .select("*", { count: "exact", head: true })
      .eq("user_id", user.id)
      .eq("completed", true),
    supabase
      .from("lessons")
      .select(
        "id, slug, title, points_reward, duration_minutes, courses(slug, title)"
      )
      .eq("is_published", true)
      .order("order_index"),
    supabase
      .from("user_progress")
      .select("lesson_id, completed, completed_at")
      .eq("user_id", user.id),
    supabase
      .from("points_transactions")
      .select("id, amount, reason, created_at")
      .eq("user_id", user.id)
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("lessons")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabase.rpc("get_courses_progress"),
    supabase
      .from("user_progress")
      .select("completed_at")
      .eq("user_id", user.id)
      .eq("completed", true),
    supabase
      .from("profiles")
      .select("id, username, full_name, avatar_url, total_points")
      .order("total_points", { ascending: false })
      .limit(3),
    supabase
      .from("profiles")
      .select("*", { count: "exact", head: true })
      .gt("total_points", profile?.total_points ?? 0),
    supabase.rpc("get_unread_notification_count"),
    supabase.rpc("award_streak_bonus"),
  ]);

  // Extrair streak bonus
  const streakBonusRow = Array.isArray(streakBonusResult)
    ? streakBonusResult[0]
    : streakBonusResult;
  const streakBonus = streakBonusRow?.bonus_awarded ?? 0;
  const streakMilestone = streakBonusRow?.milestone;

  const completedSet = new Set(
    (progressRows ?? []).filter((p) => p.completed).map((p) => p.lesson_id)
  );
  const nextLesson = (allLessons ?? []).find((l) => !completedSet.has(l.id));
  const nextCourse = nextLesson
    ? Array.isArray(nextLesson.courses)
      ? nextLesson.courses[0]
      : nextLesson.courses
    : null;

  const lessonProgress =
    totalLessons && totalLessons > 0
      ? Math.round(((lessonsCompleted ?? 0) / totalLessons) * 100)
      : 0;

  const displayName =
    profile?.username || user.email?.split("@")[0] || "Aprendiz";
  const avatar = initials(profile?.full_name || displayName, "?");
  const totalPoints = profile?.total_points ?? 0;

  const streak = calcStreak(
    (allTxDates ?? [])
      .map((d) => d.completed_at)
      .filter((v): v is string => Boolean(v))
  );

  const myPosition = (myRank ?? 0) + 1;
  const leaderboardWithMe = (leaderboard ?? []).map((u, i) => ({
    ...u,
    position: i + 1,
    isMe: u.id === user.id,
  }));
  const imInTop3 = leaderboardWithMe.some((u) => u.isMe);

  const achievements = [
    {
      icon: <Star size={20} />,
      label: "Primeiro passo",
      description: "Concluir a primeira licao",
      current: lessonsCompleted ?? 0,
      target: 1,
      unlocked: (lessonsCompleted ?? 0) >= 1,
    },
    {
      icon: <Flame size={20} />,
      label: "Aprendiz dedicado",
      description: "Concluir 5 licoes",
      current: lessonsCompleted ?? 0,
      target: 5,
      unlocked: (lessonsCompleted ?? 0) >= 5,
    },
    {
      icon: <Coins size={20} />,
      label: "Colecionador",
      description: "Acumular 50 pontos",
      current: totalPoints,
      target: 50,
      unlocked: totalPoints >= 50,
    },
    {
      icon: <Zap size={20} />,
      label: "Imparavel",
      description: "Acumular 100 pontos",
      current: totalPoints,
      target: 100,
      unlocked: totalPoints >= 100,
    },
    {
      icon: <Trophy size={20} />,
      label: "Maratonista",
      description: "Concluir 10 licoes",
      current: lessonsCompleted ?? 0,
      target: 10,
      unlocked: (lessonsCompleted ?? 0) >= 10,
    },
    {
      icon: <Award size={20} />,
      label: "Mestre",
      description: "Acumular 500 pontos",
      current: totalPoints,
      target: 500,
      unlocked: totalPoints >= 500,
    },
  ];

  const quickActions = [
    {
      href: "/courses",
      label: "Continuar curso",
      icon: BookOpen,
      description: "Aprende mais",
    },
    {
      href: nextLesson ? `/lessons/${nextLesson.slug}` : "/courses",
      label: "Proxima licao",
      icon: GraduationCap,
      description: nextLesson?.title || "Explora cursos",
    },
    {
      href: "/rewards",
      label: "Recompensas",
      icon: ShoppingBag,
      description: `${totalPoints} pts disponiveis`,
    },
    {
      href: "/perfil",
      label: "O meu perfil",
      icon: User,
      description: "Editar dados",
    },
  ];

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <header className="border-b border-white/10 sticky top-0 bg-[#07111f]/95 backdrop-blur z-10">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-xl bg-teal-400 p-2 text-[#07111f]">
              <Bitcoin size={22} />
            </div>
            <span className="text-lg font-bold">
              Crypto<span className="text-teal-400">Aprende</span>
            </span>
          </Link>

          <nav className="hidden md:flex gap-6 text-sm text-gray-300">
            <Link href="/dashboard" className="text-teal-400">
              Painel
            </Link>
            <Link href="/courses" className="hover:text-teal-400">
              Cursos
            </Link>
            <Link href="/rewards" className="hover:text-teal-400">
              Recompensas
            </Link>
            <Link href="/ranking" className="hover:text-teal-400">
              Ranking
            </Link>
            <Link href="/perfil" className="hover:text-teal-400">
              Perfil
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            <NotificationBell initialUnread={unreadCount ?? 0} />
            <form action={logoutAction}>
              <button
                type="submit"
                className="flex items-center gap-2 text-sm text-gray-400 hover:text-teal-400"
              >
                <LogOut size={16} /> Sair
              </button>
            </form>
          </div>
        </div>
      </header>

      {/* BANNER DE STREAK BONUS */}
      {streakBonus > 0 && (
        <div className="mx-auto max-w-7xl px-6 pt-4">
          <div className="rounded-xl border border-teal-400/40 bg-teal-400/10 p-4 flex items-center gap-3">
            <Flame className="text-teal-400 shrink-0" size={24} />
            <div>
              <p className="font-bold text-teal-300">
                🔥 Streak de {streakMilestone} dias!
              </p>
              <p className="text-sm text-teal-400">
                Ganhaste +{streakBonus} pontos bónus.
              </p>
            </div>
          </div>
        </div>
      )}

      <section className="mx-auto max-w-7xl px-6 py-10">
        {/* HERO */}
        <div className="rounded-3xl border border-white/10 bg-linear-to-br from-[#101e30] to-[#0b1828] p-8 mb-8 flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-5">
            <div className="h-16 w-16 rounded-full overflow-hidden bg-teal-400 text-[#07111f] font-bold text-xl flex items-center justify-center">
              {profile?.avatar_url ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={profile.avatar_url}
                  alt={displayName}
                  className="h-full w-full object-cover"
                />
              ) : (
                avatar
              )}
            </div>
            <div>
              <p className="text-sm text-gray-400 mb-1">Bem-vindo de volta</p>
              <h1 className="text-3xl font-bold">{displayName}</h1>
              <div className="flex flex-wrap items-center gap-2 mt-2">
                {streak > 0 && (
                  <span className="inline-flex items-center gap-1 text-xs bg-orange-400/10 text-orange-300 px-2 py-1 rounded-full">
                    <Flame size={12} /> {streak}{" "}
                    {streak === 1 ? "dia" : "dias"} seguidos
                  </span>
                )}
                <Link
                  href="/ranking"
                  className="inline-flex items-center gap-1 text-xs bg-teal-400/10 text-teal-400 px-2 py-1 rounded-full hover:bg-teal-400/20"
                >
                  <Medal size={12} /> #{myPosition} no ranking
                </Link>
              </div>
            </div>
          </div>

          <Link
            href="/courses"
            className="inline-flex items-center gap-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-[#07111f] font-bold px-5 py-3 transition"
          >
            Continuar a aprender <ArrowRight size={18} />
          </Link>
        </div>

        {/* STATS */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          <StatCard
            icon={<Coins size={20} />}
            label="Pontos totais"
            value={totalPoints}
          />
          <StatCard
            icon={<BookOpen size={20} />}
            label="Licoes concluidas"
            value={lessonsCompleted ?? 0}
          />
          <StatCard
            icon={<Target size={20} />}
            label="Progresso global"
            value={`${lessonProgress}%`}
          />
          <StatCard
            icon={<Flame size={20} />}
            label="Streak"
            value={`${streak}d`}
          />
        </div>

        {/* ACOES RAPIDAS */}
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4 mb-8">
          {quickActions.map((a) => {
            const Icon = a.icon;
            return (
              <Link
                key={a.label}
                href={a.href}
                className="rounded-xl border border-white/10 bg-[#101e30] p-4 hover:border-teal-400/50 transition group"
              >
                <div className="flex items-center gap-2 mb-2 text-teal-400">
                  <Icon size={18} />
                  <span className="text-sm font-semibold text-white">
                    {a.label}
                  </span>
                </div>
                <p className="text-xs text-gray-500 truncate group-hover:text-gray-400">
                  {a.description}
                </p>
              </Link>
            );
          })}
        </div>

        {/* GRID PRINCIPAL */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#101e30] p-6">
            <div className="flex items-center gap-2 mb-5">
              <TrendingUp className="text-teal-400" size={20} />
              <h2 className="text-lg font-bold">Pontos nos ultimos 7 dias</h2>
            </div>
            <PointsChart userId={user.id} />
          </div>

          <div className="space-y-6">
            {/* STREAK WIDGET substitui Meta semanal */}
            <StreakWidget currentStreak={streak} />

            <div className="rounded-2xl border border-white/10 bg-[#101e30] p-6">
              <div className="flex items-center gap-2 mb-4">
                <Trophy className="text-teal-400" size={20} />
                <h2 className="text-lg font-bold">Continua a aprender</h2>
              </div>

              {nextLesson && nextCourse ? (
                <Link
                  href={`/lessons/${nextLesson.slug}`}
                  className="block rounded-xl bg-[#0b1828] border border-white/10 p-4 hover:border-teal-400/50 transition group"
                >
                  <p className="text-xs uppercase tracking-widest text-teal-400 mb-1">
                    {nextCourse.title}
                  </p>
                  <h3 className="text-base font-bold mb-3 group-hover:text-teal-400">
                    {nextLesson.title}
                  </h3>
                  <div className="flex items-center gap-3 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Clock size={12} /> {nextLesson.duration_minutes} min
                    </span>
                    <span className="flex items-center gap-1">
                      <Coins size={12} /> +{nextLesson.points_reward} pts
                    </span>
                  </div>
                </Link>
              ) : (
                <div className="text-center py-4">
                  <Trophy className="text-teal-400 mx-auto mb-2" size={32} />
                  <p className="text-sm font-semibold mb-1">Concluiste tudo!</p>
                  <p className="text-xs text-gray-500">Novas em breve.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* RANKING + ATIVIDADE */}
        <div className="grid gap-6 lg:grid-cols-3 mb-8">
          <div className="rounded-2xl border border-white/10 bg-[#101e30] p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2">
                <Medal className="text-teal-400" size={20} />
                <h2 className="text-lg font-bold">Top 3 global</h2>
              </div>
              <Link
                href="/ranking"
                className="text-xs text-teal-400 hover:underline"
              >
                Ver tudo
              </Link>
            </div>

            {leaderboardWithMe.length > 0 ? (
              <ul className="space-y-3">
                {leaderboardWithMe.map((u) => {
                  const avatarU = initials(
                    u.full_name || u.username || "?",
                    "?"
                  );
                  const medalColor =
                    u.position === 1
                      ? "text-yellow-400"
                      : u.position === 2
                      ? "text-gray-300"
                      : "text-amber-600";
                  return (
                    <li
                      key={u.id}
                      className={`flex items-center gap-3 rounded-xl p-2 ${
                        u.isMe ? "bg-teal-400/10 border border-teal-400/30" : ""
                      }`}
                    >
                      <span
                        className={`w-6 text-center font-bold ${medalColor}`}
                      >
                        {u.position}
                      </span>
                      <div className="h-8 w-8 rounded-full overflow-hidden bg-teal-400 text-[#07111f] text-xs font-bold flex items-center justify-center">
                        {u.avatar_url ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={u.avatar_url}
                            alt={u.username || "?"}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          avatarU
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">
                          {u.username || "Anonimo"}
                          {u.isMe && (
                            <span className="text-teal-400 text-xs ml-1">
                              (tu)
                            </span>
                          )}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-teal-400">
                        {u.total_points} pts
                      </span>
                    </li>
                  );
                })}
                {!imInTop3 && myPosition > 3 && (
                  <li className="flex items-center gap-3 rounded-xl p-2 bg-teal-400/10 border border-teal-400/30">
                    <span className="w-6 text-center font-bold text-gray-400">
                      {myPosition}
                    </span>
                    <div className="h-8 w-8 rounded-full overflow-hidden bg-teal-400 text-[#07111f] text-xs font-bold flex items-center justify-center">
                      {avatar}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">
                        {displayName}{" "}
                        <span className="text-teal-400 text-xs">(tu)</span>
                      </p>
                    </div>
                    <span className="text-xs font-bold text-teal-400">
                      {totalPoints} pts
                    </span>
                  </li>
                )}
              </ul>
            ) : (
              <p className="text-sm text-gray-500">Sem ranking ainda.</p>
            )}
          </div>

          <div className="lg:col-span-2 rounded-2xl border border-white/10 bg-[#101e30] p-6">
            <div className="flex items-center gap-2 mb-5">
              <Coins className="text-teal-400" size={20} />
              <h2 className="text-lg font-bold">Atividade recente</h2>
            </div>

            {recentTx && recentTx.length > 0 ? (
              <ul className="space-y-3">
                {recentTx.map((tx) => (
                  <li
                    key={tx.id}
                    className="flex items-center justify-between text-sm"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      {tx.amount > 0 ? (
                        <CheckCircle
                          size={14}
                          className="text-teal-400 shrink-0"
                        />
                      ) : (
                        <Gift size={14} className="text-red-400 shrink-0" />
                      )}
                      <div className="min-w-0">
                        <p className="font-medium truncate">
                          {reasonLabel(tx.reason)}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(tx.created_at)}
                        </p>
                      </div>
                    </div>
                    <span
                      className={
                        tx.amount > 0
                          ? "text-teal-400 font-bold shrink-0"
                          : "text-red-400 font-bold shrink-0"
                      }
                    >
                      {tx.amount > 0 ? "+" : ""}
                      {tx.amount}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-gray-500 py-4">
                Ainda sem atividade. Conclui uma licao para comecar.
              </p>
            )}
          </div>
        </div>

        {/* PROGRESSO POR CURSO */}
        <div className="rounded-2xl border border-white/10 bg-[#101e30] p-6 mb-8">
          <div className="flex items-center gap-2 mb-5">
            <BookOpen className="text-teal-400" size={20} />
            <h2 className="text-lg font-bold">Progresso por curso</h2>
          </div>

          {coursesProgress && coursesProgress.length > 0 ? (
            <div className="space-y-4">
              {coursesProgress.map(
                (c: {
                  course_id: string;
                  slug: string;
                  title: string;
                  level: string;
                  total_lessons: number;
                  completed_lessons: number;
                }) => {
                  const total = Number(c.total_lessons);
                  const done = Number(c.completed_lessons);
                  const pct = total > 0 ? Math.round((done / total) * 100) : 0;
                  return (
                    <Link
                      key={c.course_id}
                      href={`/courses/${c.slug}`}
                      className="block rounded-xl bg-[#0b1828] border border-white/10 p-4 hover:border-teal-400/50 transition"
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{c.title}</h3>
                        <span className="text-sm text-teal-400 font-bold">
                          {pct}%
                        </span>
                      </div>
                      <div className="h-2 rounded-full bg-gray-700 overflow-hidden">
                        <div
                          className="h-full bg-teal-400 transition-all"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        {done} de {total} licoes concluidas
                      </p>
                    </Link>
                  );
                }
              )}
            </div>
          ) : (
            <p className="text-sm text-gray-500">
              Ainda nao ha cursos publicados.
            </p>
          )}
        </div>

        {/* CONQUISTAS */}
        <div className="rounded-2xl border border-white/10 bg-[#101e30] p-6">
          <div className="flex items-center gap-2 mb-5">
            <Award className="text-teal-400" size={20} />
            <h2 className="text-lg font-bold">Conquistas</h2>
            <span className="text-xs text-gray-500 ml-2">
              {achievements.filter((a) => a.unlocked).length} de{" "}
              {achievements.length} desbloqueadas
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
            {achievements.map((a) => {
              const pct = Math.min(
                100,
                Math.round((a.current / a.target) * 100)
              );
              return (
                <div
                  key={a.label}
                  className={`rounded-xl p-4 text-center border transition ${
                    a.unlocked
                      ? "border-teal-400/40 bg-teal-400/10"
                      : "border-white/10 bg-[#0b1828] opacity-80"
                  }`}
                >
                  <div
                    className={`mx-auto mb-2 flex h-10 w-10 items-center justify-center rounded-full ${
                      a.unlocked
                        ? "bg-teal-400 text-[#07111f]"
                        : "bg-gray-700 text-gray-400"
                    }`}
                  >
                    {a.unlocked ? a.icon : <Lock size={18} />}
                  </div>
                  <p
                    className={`text-sm font-semibold ${
                      a.unlocked ? "text-white" : "text-gray-400"
                    }`}
                  >
                    {a.label}
                  </p>
                  <p className="text-xs text-gray-500 mt-1 mb-2">
                    {a.description}
                  </p>
                  {!a.unlocked && (
                    <>
                      <div className="h-1 rounded-full bg-gray-700 overflow-hidden">
                        <div
                          className="h-full bg-teal-400/60"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <p className="text-[10px] text-gray-500 mt-1">
                        {Math.min(a.current, a.target)}/{a.target}
                      </p>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </main>
  );
}

function StatCard({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-[#101e30] p-5">
      <div className="flex items-center gap-2 mb-2 text-teal-400">
        {icon}
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <div className="text-2xl font-bold capitalize">{value}</div>
    </div>
  );
}