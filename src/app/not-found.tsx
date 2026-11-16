import Link from "next/link";
import { Bitcoin, Home, Search } from "lucide-react";

export default function NotFound() {
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

        <div className="text-8xl font-bold text-teal-400 mb-4">404</div>
        <h1 className="text-2xl font-bold mb-3">Página não encontrada</h1>
        <p className="text-gray-400 mb-8">
          A página que procuras não existe ou foi movida.
        </p>

        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/"
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-[#07111f] font-bold px-5 py-3 transition"
          >
            <Home size={18} /> Ir para casa
          </Link>
          <Link
            href="/courses"
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/20 hover:border-teal-400 px-5 py-3 font-semibold transition"
          >
            <Search size={18} /> Ver cursos
          </Link>
        </div>
      </div>
    </main>
  );
}