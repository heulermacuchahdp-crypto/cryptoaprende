"use client";

import {
  useState,
  useEffect,
  useRef,
  useTransition,
  useSyncExternalStore,
} from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import {
  Bell,
  Check,
  CheckCheck,
  Package,
  XCircle,
  Gift,
  Info,
  Loader2,
} from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Notification = {
  id: string;
  type: string;
  title: string;
  message: string | null;
  link: string | null;
  read: boolean;
  created_at: string;
};

function iconFor(type: string) {
  if (type === "redemption_approved") return Package;
  if (type === "redemption_rejected") return XCircle;
  if (type === "redemption_delivered") return Gift;
  return Info;
}

function colorFor(type: string) {
  if (type === "redemption_approved") return "text-teal-400 bg-teal-400/10";
  if (type === "redemption_rejected") return "text-red-400 bg-red-500/10";
  if (type === "redemption_delivered") return "text-teal-400 bg-teal-400/10";
  return "text-gray-400 bg-gray-500/10";
}

function timeAgo(iso: string) {
  const diff = Date.now() - new Date(iso).getTime();
  const min = Math.floor(diff / 60000);
  if (min < 1) return "agora";
  if (min < 60) return `${min}m`;
  const h = Math.floor(min / 60);
  if (h < 24) return `${h}h`;
  const d = Math.floor(h / 24);
  if (d < 7) return `${d}d`;
  return new Date(iso).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "short",
  });
}

function useIsClient() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
}

export default function NotificationBell({
  initialUnread = 0,
}: {
  initialUnread?: number;
}) {
  const isClient = useIsClient();
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0, width: 384 });
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unread, setUnread] = useState(initialUnread);
  const [loading, setLoading] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const [pending, start] = useTransition();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const supabase = createClient();

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      const target = e.target as Node;
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const close = () => setOpen(false);
    window.addEventListener("scroll", close, true);
    window.addEventListener("resize", close);
    return () => {
      window.removeEventListener("scroll", close, true);
      window.removeEventListener("resize", close);
    };
  }, [open]);

  async function loadNotifications() {
    setLoading(true);
    const { data } = await supabase.rpc("list_notifications", { p_limit: 10 });
    setNotifications((data as Notification[]) ?? []);
    setLoaded(true);
    setLoading(false);
  }

  function handleToggle() {
    if (open) {
      setOpen(false);
      return;
    }

    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      const width = Math.min(384, window.innerWidth - 16);
      let left = rect.right - width;
      if (left < 8) left = 8;
      if (left + width > window.innerWidth - 8) {
        left = window.innerWidth - width - 8;
      }

      const estimatedHeight = 380;
      const spaceBelow = window.innerHeight - rect.bottom;
      const openUp = spaceBelow < estimatedHeight + 16;

      const top = openUp
        ? Math.max(8, rect.top - estimatedHeight - 8)
        : rect.bottom + 8;

      setPos({ top, left, width });
    }

    setOpen(true);
    if (!loaded) loadNotifications();
  }

  function handleMarkAll() {
    start(async () => {
      await supabase.rpc("mark_all_notifications_read");
      setUnread(0);
      setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    });
  }

  function handleMarkOne(id: string) {
    start(async () => {
      await supabase.rpc("mark_notification_read", { p_id: id });
      setUnread((u) => Math.max(0, u - 1));
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, read: true } : n))
      );
    });
  }

  const dropdown =
    open && isClient
      ? createPortal(
          <div
            ref={dropdownRef}
            className="fixed z-100 rounded-2xl border border-white/10 bg-[#101e30] shadow-2xl shadow-black/60 overflow-hidden"
            style={{ top: pos.top, left: pos.left, width: pos.width }}
          >
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/10">
              <h3 className="font-bold text-sm">Notificações</h3>
              {unread > 0 && (
                <button
                  onClick={handleMarkAll}
                  disabled={pending}
                  className="inline-flex items-center gap-1 text-xs text-teal-400 hover:underline disabled:opacity-50"
                >
                  {pending ? (
                    <Loader2 size={12} className="animate-spin" />
                  ) : (
                    <CheckCheck size={12} />
                  )}
                  Marcar todas
                </button>
              )}
            </div>

            <div className="max-h-96 overflow-y-auto">
              {loading ? (
                <div className="p-6 text-center text-sm text-gray-500">
                  A carregar...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-8 text-center">
                  <Bell size={32} className="text-gray-600 mx-auto mb-2" />
                  <p className="text-sm text-gray-500">Sem notificações.</p>
                </div>
              ) : (
                <ul className="divide-y divide-white/5">
                  {notifications.map((n) => {
                    const Icon = iconFor(n.type);
                    const color = colorFor(n.type);
                    return (
                      <li
                        key={n.id}
                        className={`flex items-start gap-3 px-4 py-3 hover:bg-white/5 transition ${
                          !n.read ? "bg-teal-400/5" : ""
                        }`}
                      >
                        <div
                          className={`shrink-0 h-9 w-9 rounded-lg flex items-center justify-center ${color}`}
                        >
                          <Icon size={16} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0">
                              <p
                                className={`text-sm ${
                                  !n.read
                                    ? "font-semibold text-white"
                                    : "text-gray-300"
                                }`}
                              >
                                {n.title}
                              </p>
                              {n.message && (
                                <p className="text-xs text-gray-500 mt-0.5 line-clamp-2">
                                  {n.message}
                                </p>
                              )}
                              <div className="flex items-center gap-2 mt-1">
                                <span className="text-[10px] text-gray-600">
                                  {timeAgo(n.created_at)}
                                </span>
                                {n.link && (
                                  <Link
                                    href={n.link}
                                    onClick={() => setOpen(false)}
                                    className="text-[10px] text-teal-400 hover:underline"
                                  >
                                    Ver
                                  </Link>
                                )}
                              </div>
                            </div>
                            {!n.read && (
                              <button
                                onClick={() => handleMarkOne(n.id)}
                                className="shrink-0 text-gray-500 hover:text-teal-400 p-1"
                                title="Marcar como lida"
                              >
                                <Check size={12} />
                              </button>
                            )}
                          </div>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>
          </div>,
          document.body
        )
      : null;

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={handleToggle}
        className="relative flex items-center justify-center h-9 w-9 rounded-lg text-gray-400 hover:text-teal-400 hover:bg-white/5 transition"
        aria-label="Notificações"
        aria-expanded={open}
      >
        <Bell size={18} />
        {unread > 0 && (
          <span className="absolute -top-0.5 -right-0.5 h-5 min-w-5 px-1 rounded-full bg-red-500 text-white text-[10px] font-bold flex items-center justify-center">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>
      {dropdown}
    </>
  );
}