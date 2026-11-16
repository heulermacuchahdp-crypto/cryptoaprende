import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Users,
  BookOpen,
  GraduationCap,
  ShoppingBag,
  Coins,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

export default async function AdminHomePage() {
  const supabase = await createClient();

  const [
    { count: totalUsers },
    { count: totalCourses },
    { count: publishedCourses },
    { count: totalLessons },
    { count: publishedLessons },
    { count: totalRedemptions },
    { count: pendingRedemptions },
    { data: recentUsers },
  ] = await Promise.all([
    supabase.from("profiles").select("*", { count: "exact", head: true }),
    supabase.from("courses").select("*", { count: "exact", head: true }),
    supabase
      .from("courses")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabase.from("lessons").select("*", { count: "exact", head: true }),
    supabase
      .from("lessons")
      .select("*", { count: "exact", head: true })
      .eq("is_published", true),
    supabase.from("redemptions").select("*", { count: "exact", head: true }),
    supabase
      .from("redemptions")
      .select("*", { count: "exact", head: true })
      .eq("status", "pending"),
    supabase
      .from("profiles")
      .select("id, username, total_points, role, created_at")
      .order("created_at", { ascending: false })
      .limit(5),
  ]);

  const stats = [
    {
      label: "Utilizadores",
      value: totalUsers ?? 0,
      icon: Users,
      href: "/admin/users",
      color: "text-teal-400",
    },
    {
      label: "Cursos",
      value: `${publishedCourses ?? 0} / ${totalCourses ?? 0}`,
      icon: BookOpen,
      href: "/admin/courses",
      color: "text-blue-400",
    },
    {
      label: "Licoes",
      value: `${publishedLessons ?? 0} / ${totalLessons ?? 0}`,
      icon: GraduationCap,
      href: "/admin/lessons",
      color: "text-purple-400",
    },
    {
      label: "Resgates pendentes",
      value: `${pendingRedemptions ?? 0} / ${totalRedemptions ?? 0}`,
      icon: ShoppingBag,
      href: "/admin/redemptions",
      color: "text-yellow-400",
    },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Painel de administracao</h1>
        <p className="text-gray-400">
          Visao geral da plataforma CryptoAprende.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-10">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <Link
              key={s.label}
              href={s.href}
              className="rounded-2xl border border-white/10 bg-[#101e30] p-6 hover:border-teal-400/50 transition group"
            >
              <div className={`flex items-center gap-2 mb-3 ${s.color}`}>
                <Icon size={20} />
                <span className="text-xs text-gray-400">{s.label}</span>
              </div>
              <div className="text-3xl font-bold mb-3">{s.value}</div>
              <span className="text-xs text-gray-500 group-hover:text-teal-400 flex items-center gap-1">
                Gerir <ArrowRight size={12} />
              </span>
            </Link>
          );
        })}
      </div>

      <div className="rounded-2xl border border-white/10 bg-[#101e30] p-6">
        <div className="flex items-center gap-2 mb-5">
          <TrendingUp className="text-teal-400" size={20} />
          <h2 className="text-lg font-bold">Utilizadores recentes</h2>
        </div>

        {recentUsers && recentUsers.length > 0 ? (
          <ul className="divide-y divide-white/10">
            {recentUsers.map((u) => (
              <li
                key={u.id}
                className="flex items-center justify-between py-3 text-sm"
              >
                <div>
                  <p className="font-medium">{u.username || "Sem username"}</p>
                  <p className="text-xs text-gray-500">
                    Registado:{" "}
                    {new Date(u.created_at).toLocaleDateString("pt-PT")}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="inline-flex items-center gap-1 text-teal-400 text-xs font-semibold">
                    <Coins size={12} /> {u.total_points} pts
                  </span>
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      u.role === "admin"
                        ? "bg-teal-400/10 text-teal-400"
                        : "bg-gray-700/50 text-gray-400"
                    }`}
                  >
                    {u.role}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-sm text-gray-500">Sem utilizadores ainda.</p>
        )}
      </div>
    </div>
  );
}