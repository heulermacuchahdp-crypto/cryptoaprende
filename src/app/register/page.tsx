"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Bitcoin, Mail, User, ArrowRight, AlertCircle } from "lucide-react";
import { registerAction } from "./actions";
import PasswordInput from "@/components/PasswordInput";

export default function RegisterPage() {
  const [state, formAction, pending] = useActionState(registerAction, null);

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
          <h1 className="text-2xl font-bold mb-2">Criar conta</h1>
          <p className="text-gray-400 mb-6">Comeca a aprender gratuitamente.</p>

          {state?.error && (
            <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-300 flex items-start gap-2">
              <AlertCircle size={18} className="shrink-0 mt-0.5" />
              <span>{state.error}</span>
            </div>
          )}

          <form action={formAction} className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">Username</label>
              <div className="relative">
                <User
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 pointer-events-none"
                />
                <input
                  name="username"
                  type="text"
                  required
                  minLength={3}
                  autoComplete="username"
                  className="w-full rounded-lg bg-[#0b1828] border border-white/10 pl-10 pr-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400"
                  placeholder="o-teu-username"
                />
              </div>
            </div>

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
              <label className="block text-sm font-medium mb-2">Password</label>
              <PasswordInput
                name="password"
                required
                minLength={8}
                autoComplete="new-password"
                showStrength
                placeholder="Minimo 8 caracteres"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">
                Confirmar password
              </label>
              <PasswordInput
                name="confirm"
                required
                minLength={8}
                autoComplete="new-password"
                placeholder="Repete a password"
              />
            </div>

            <label className="flex items-start gap-2 text-xs text-gray-400 cursor-pointer">
              <input
                type="checkbox"
                required
                className="mt-0.5 accent-teal-400"
              />
              <span>
                Aceito os{" "}
                <Link href="/terms" className="text-teal-400 hover:underline">
                  Termos
                </Link>{" "}
                e a{" "}
                <Link href="/privacy" className="text-teal-400 hover:underline">
                  Politica de Privacidade
                </Link>
                .
              </span>
            </label>

            <button
              type="submit"
              disabled={pending}
              className="w-full rounded-xl bg-teal-400 hover:bg-teal-300 disabled:opacity-50 disabled:cursor-not-allowed text-[#07111f] font-bold py-3 flex items-center justify-center gap-2 transition"
            >
              {pending ? (
                "A criar conta..."
              ) : (
                <>
                  Criar conta <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>

          <p className="text-center text-sm text-gray-400 mt-6">
            Ja tens conta?{" "}
            <Link href="/login" className="text-teal-400 hover:underline">
              Entrar
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
