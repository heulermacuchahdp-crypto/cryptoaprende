"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  ShieldCheck,
  ShieldOff,
  AlertCircle,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { setUserRoleAction } from "./actions";

export default function UserActions({
  userId,
  currentRole,
  isMe,
}: {
  userId: string;
  currentRole: string;
  isMe: boolean;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const makeAdmin = currentRole === "user";
  const label = makeAdmin ? "Tornar admin" : "Rebaixar a user";
  const Icon = makeAdmin ? ShieldCheck : ShieldOff;

  function handleClick() {
    setError(null);
    setSuccess(false);

    const confirmMsg = makeAdmin
      ? "Tornar este utilizador administrador?\n\nTerá acesso total ao painel de admin, incluindo gestão de utilizadores, cursos e recompensas."
      : "Rebaixar este administrador a utilizador normal?\n\nPerderá imediatamente o acesso ao painel de admin.";

    if (!window.confirm(confirmMsg)) return;

    const targetRole: "user" | "admin" = makeAdmin ? "admin" : "user";

    start(async () => {
      try {
        const res = await setUserRoleAction(userId, targetRole);
        if (res.error) {
          setError(res.error);
          return;
        }
        setSuccess(true);
        router.refresh();
        setTimeout(() => setSuccess(false), 2000);
      } catch (e) {
        setError(
          e instanceof Error
            ? e.message
            : "Erro inesperado. Tenta novamente."
        );
      }
    });
  }

  if (isMe) {
    return (
      <span
        className="text-xs text-gray-500 italic"
        title="Não podes alterar o teu próprio role"
      >
        (tu)
      </span>
    );
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending || success}
        aria-busy={pending}
        aria-label={pending ? "A processar" : success ? "Concluído" : label}
        className={`inline-flex items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold transition disabled:opacity-60 disabled:cursor-not-allowed ${
          success
            ? "bg-teal-400/20 text-teal-300"
            : makeAdmin
            ? "bg-teal-400/10 text-teal-400 hover:bg-teal-400/20"
            : "bg-red-500/10 text-red-400 hover:bg-red-500/20"
        }`}
      >
        {pending ? (
          <>
            <Loader2 size={12} className="animate-spin" />
            A processar...
          </>
        ) : success ? (
          <>
            <CheckCircle size={12} />
            Feito!
          </>
        ) : (
          <>
            <Icon size={12} />
            {label}
          </>
        )}
      </button>

      {error && (
        <span
          role="alert"
          className="text-xs text-red-400 flex items-center gap-1 max-w-55 text-right"
        >
          <AlertCircle size={10} className="shrink-0" /> {error}
        </span>
      )}
    </div>
  );
}