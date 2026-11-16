"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bitcoin,
  LayoutDashboard,
  Users,
  BookOpen,
  GraduationCap,
  ShoppingBag,
  Medal,
  User,
  LogOut,
} from "lucide-react";
import { adminLogoutAction } from "./actions";
import NotificationBell from "@/components/NotificationBell";

const items = [
  { href: "/admin", label: "Visao geral", icon: LayoutDashboard },
  { href: "/admin/users", label: "Utilizadores", icon: Users },
  { href: "/admin/courses", label: "Cursos", icon: BookOpen },
  { href: "/admin/lessons", label: "Licoes", icon: GraduationCap },
  { href: "/admin/redemptions", label: "Resgates", icon: ShoppingBag },
  { href: "/ranking", label: "Ranking publico", icon: Medal },
  { href: "/admin/perfil", label: "Meu perfil", icon: User },
];

export default function Sidebar({
  username,
  unreadCount = 0,
}: {
  username: string;
  unreadCount?: number;
}) {
  const pathname = usePathname();

  return (
    <aside className="w-64 shrink-0 border-r border-white/10 bg-[#0b1828] min-h-screen flex flex-col">
      <div className="px-6 py-5 border-b border-white/10">
        <Link href="/admin" className="flex items-center gap-2">
          <div className="rounded-xl bg-teal-400 p-2 text-[#07111f]">
            <Bitcoin size={20} />
          </div>
          <span className="font-bold">
            Crypto<span className="text-teal-400">Aprende</span>
          </span>
        </Link>
        <p className="text-xs text-gray-500 mt-3 truncate">
          Admin: {username}
        </p>
      </div>

      <nav className="flex-1 py-4 space-y-1 px-3">
        {items.map((item) => {
          const Icon = item.icon;
          const active =
            item.href === "/admin"
              ? pathname === "/admin"
              : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition ${
                active
                  ? "bg-teal-400/10 text-teal-400"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <Icon size={16} /> {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-3 border-t border-white/10 space-y-2">
        <div className="flex items-center justify-between px-2">
          <span className="text-xs text-gray-500">Notificacoes</span>
          <NotificationBell initialUnread={unreadCount} />
        </div>
        <form action={adminLogoutAction}>
          <button
            type="submit"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-red-400 hover:bg-red-500/5 transition"
          >
            <LogOut size={16} /> Sair
          </button>
        </form>
      </div>
    </aside>
  );
}