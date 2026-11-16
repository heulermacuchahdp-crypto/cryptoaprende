import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import {
  Users,
  Coins,
  Calendar,
  ArrowLeft,
  ShieldCheck,
} from "lucide-react";
import UserActions from "./UserActions";

type AdminUser = {
  id: string;
  email: string | null;
  username: string | null;
  full_name: string | null;
  avatar_url: string | null;
  total_points: number;
  role: string;
  created_at: string;
};

function initials(name: string | null | undefined) {
  const s = (name || "?").trim();
  return s.slice(0, 2).toUpperCase();
}

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

export default async function AdminUsersPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: users, error } = await supabase.rpc("admin_list_users");

  if (error) {
    return (
      <div className="p-8">
        <p className="text-red-400">Erro: {error.message}</p>
      </div>
    );
  }

  const list = (users as AdminUser[]) ?? [];
  const totalAdmins = list.filter((u) => u.role === "admin").length;

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Utilizadores</h1>
          <p className="text-gray-400">
            {list.length} utilizadores · {totalAdmins} admin
            {totalAdmins !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-teal-400"
        >
          <ArrowLeft size={16} /> Voltar
        </Link>
      </div>

      {list.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#101e30] p-8 text-center">
          <Users className="text-teal-400 mx-auto mb-3" size={40} />
          <p className="text-gray-400">Sem utilizadores registados.</p>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-[#101e30] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#0b1828] text-left text-xs uppercase tracking-widest text-gray-500">
                <tr>
                  <th className="px-5 py-3">Utilizador</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Pontos</th>
                  <th className="px-5 py-3">Role</th>
                  <th className="px-5 py-3">Registo</th>
                  <th className="px-5 py-3 text-right">Acoes</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {list.map((u) => {
                  const isMe = u.id === user?.id;
                  const avatar = initials(u.full_name || u.username);
                  return (
                    <tr
                      key={u.id}
                      className={isMe ? "bg-teal-400/5" : "hover:bg-white/5"}
                    >
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full overflow-hidden bg-teal-400 text-[#07111f] text-xs font-bold flex items-center justify-center shrink-0">
                            {u.avatar_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={u.avatar_url}
                                alt={u.username || "?"}
                                className="h-full w-full object-cover"
                              />
                            ) : (
                              avatar
                            )}
                          </div>
                          <div className="min-w-0">
                            <p className="font-medium truncate">
                              {u.username || "Sem username"}
                            </p>
                            {u.full_name && (
                              <p className="text-xs text-gray-500 truncate">
                                {u.full_name}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4 text-gray-400 truncate max-w-50">
                        {u.email || "—"}
                      </td>
                      <td className="px-5 py-4">
                        <span className="inline-flex items-center gap-1 text-teal-400 text-xs font-semibold">
                          <Coins size={12} /> {u.total_points}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span
                          className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                            u.role === "admin"
                              ? "bg-teal-400/10 text-teal-400"
                              : "bg-gray-700/50 text-gray-400"
                          }`}
                        >
                          {u.role === "admin" && <ShieldCheck size={10} />}
                          {u.role}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-xs text-gray-500">
                        <span className="inline-flex items-center gap-1">
                          <Calendar size={10} /> {formatDate(u.created_at)}
                        </span>
                      </td>
                      <td className="px-5 py-4 text-right">
                        <UserActions
                          userId={u.id}
                          currentRole={u.role}
                          isMe={isMe}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}