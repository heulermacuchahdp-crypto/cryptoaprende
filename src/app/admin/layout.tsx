import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import Sidebar from "./Sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, username")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") redirect("/dashboard");

  const { data: unreadCount } = await supabase.rpc(
    "get_unread_notification_count"
  );

  return (
    <div className="min-h-screen bg-[#07111f] text-white flex">
      <Sidebar
        username={profile.username || user.email || "admin"}
        unreadCount={unreadCount ?? 0}
      />
      <main className="flex-1 min-w-0">{children}</main>
    </div>
  );
}