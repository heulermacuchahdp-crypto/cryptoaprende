"use client";

import Link from "next/link";
import { useEffect } from "react";
import { Bitcoin, AlertTriangle, RotateCcw, Home } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Erro na aplicação:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-[#07111f] text-white flex items-center justify-center px-6">
      <div className="text-center max-w-md">
        <Link href="/" className="inline-flex items-center gap-2 mb-8">
          <div className="rounded-xl bg-teal-400 p-2 text-[#07111f]">
            <Bitcoin size={22} />
          </div>
          <span className="text-lg font-bold">
            Crypto<span className="text-teal-400">Aprende</span>
          </span>
        </Link>

        <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-red-500/10 text-red-400 mb-4">
          <AlertTriangle size={32} />
        </div>
        <h1 className="text-2xl font-bold mb-3">Algo correu mal</h1>
        <p className="text-gray-400 mb-8">
          Ocorreu um erro inesperado. Tenta novamente ou volta à página inicial.
        </p>

        {process.env.NODE_ENV === "development" && (
          <div className="mb-6 rounded-lg bg-red-500/5 border border-red-500/20 p-3 text-left">
            <p className="text-xs font-mono text-red-300 break-all">
              {error.message}
            </p>
            {error.digest && (
              <p className="text-xs text-gray-500 mt-1">
                Digest: {error.digest}
              </p>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-[#07111f] font-bold px-5 py-3 transition"
          >
            <RotateCcw size={18} /> Tentar de novo
          </button>
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 hover:border-teal-400 px-5 py-3 font-semibold transition"
          >
            <Home size={18} /> Ir para casa
          </Link>
        </div>
      </div>
    </main>
  );
}