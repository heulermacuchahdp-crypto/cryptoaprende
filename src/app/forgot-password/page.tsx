"use client";

import Link from "next/link";
import { useActionState } from "react";
import { Bitcoin, Mail, ArrowRight, AlertCircle, CheckCircle } from "lucide-react";
import { forgotPasswordAction } from "./actions";

export default function ForgotPasswordPage() {
  const [state, formAction, pending] = useActionState(forgotPasswordAction, {
    error: null,
    success: false,
  });

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
          <h1 className="text-2xl font-bold mb-2">Recuperar password</h1>
          <p className="text-gray-400 mb-6 text-sm">
            Introduz o teu email. Vais receber um link para criar uma nova
            password.
          </p>

          {state.success ? (
            <div className="rounded-lg bg-teal-500/10 border border-teal-500/30 p-4 text-sm text-teal-300 flex items-start gap-2">
              <CheckCircle size={18} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold mb-1">Email enviado!</p>
                <p className="text-xs">
                  Verifica a tua caixa de entrada (e o spam). Se nao receberes
                  em 2 minutos, tenta de novo.
                </p>
              </div>
            </div>
          ) : (
            <>
              {state.error && (
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

                <button
                  type="submit"
                  disabled={pending}
                  className="w-full rounded-xl bg-teal-400 hover:bg-teal-300 disabled:opacity-50 text-[#07111f] font-bold py-3 flex items-center justify-center gap-2 transition"
                >
                  {pending ? (
                    "A enviar..."
                  ) : (
                    <>
                      Enviar link <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </>
          )}

          <p className="text-center text-sm text-gray-400 mt-6">
            <Link href="/login" className="text-teal-400 hover:underline">
              Voltar ao login
            </Link>
          </p>
        </div>
      </div>
    </main>
  );
}
