"use client";

import Link from "next/link";
import { useActionState, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Bitcoin, Mail, ArrowRight, AlertCircle } from "lucide-react";
import { loginAction } from "./actions";
import { createClient } from "@/lib/supabase/client";
import PasswordInput from "@/components/PasswordInput";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState(loginAction, null);
  const router = useRouter();
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (user) {
        router.push("/dashboard");
        router.refresh();
      } else {
        setChecking(false);
      }
    });
  }, [router]);

  if (checking) {
    return (
      <main className="min-h-screen bg-[#07111f] text-white flex items-center justify-center">
        <p className="text-sm text-gray-500">A verificar sessao...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white flex items-center justify-center px-6 py-16">
      <div className="w-full max-w-md">
        <Link href="/" className="flex items-center gap-2 justify-center mb-8">
          <div className="rounded-xl bg-teal-400 p-2 text-[#07111f]">
            <Bitcoin size={25} />
          </div>
          <span className="text-2xl font-bold">
            Crypto<span className="text-teal-400">Aprende</span>
          </span>
        </Link>

        <div className="rounded-2xl border border-white/10 bg-[#101e30] p-8">
          <h1 className="text-2xl font-bold mb-2">Entrar</h1>
          <p className="text-gray-400 mb-6">Bem-vindo de volta.</p>

          {state?.error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-300 flex items-start gap-2">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Email</label>
              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                />
                <input
                  name="email"
                  type="email"
                  required
                  autoComplete="email"
                  className="w-full rounded-lg bg-[#0b1828] border border-white/10 pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400"
                  placeholder="teu@email.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">Password</label>
                <Link
                  href="/forgot-password"
                  className="text-xs text-teal-400 hover:underline"
                >
                  Esqueci-me
                </Link>
              </div>
              <PasswordInput
                name="password"
                required
                autoComplete="current-password"
                placeholder="A tua password"
              />
            </div>

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-xl bg-teal-400 hover:bg-teal-300 disabled:opacity-50 text-[#07111f] font-bold py-3 flex items-center justify-center gap-2 transition"
            >
              {pending ? (
                "A entrar..."
              ) : (
                <>
                  Entrar <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Ainda nao tens conta?{" "}
            <Link href="/register" className="text-teal-400 hover:underline">
              Criar conta
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
