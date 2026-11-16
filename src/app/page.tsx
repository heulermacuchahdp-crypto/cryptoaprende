
import {
  Bitcoin,
  BookOpen,
  Trophy,
  Wallet,
  ArrowRight,
  ShieldCheck,
  GraduationCap,
  Coins,
  Menu,
  Globe,
  CheckCircle,  
  PlayCircle,
  Target,
} from "lucide-react";
import Link from "next/link";
const features = [
  {
    icon: BookOpen,
    title: "Aprende criptomoedas",
    description:
      "Aprende desde o básico até conceitos avançados através de cursos e lições simples.",
  },
  {
    icon: Target,
    title: "Realiza tarefas",
    description:
      "Participa em desafios educativos e completa actividades para acumular pontos.",
  },
  {
    icon: Trophy,
    title: "Acumula pontos",
    description:
      "Acompanha o teu progresso e consulta as tuas conquistas na plataforma.",
  },
  {
    icon: Wallet,
    title: "Explora recompensas",
    description:
      "Descobre oportunidades de recompensa disponíveis e consulta as respectivas condições.",
  },
];

const steps = [
  "Cria a tua conta gratuitamente.",
  "Estuda os cursos e completa as lições.",
  "Participa em tarefas e desafios.",
  "Acumula pontos e acompanha o teu progresso.",
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      {/* NAVEGAÇÃO */}
      <header className="border-b border-white/10">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-5">
          <a href="#" className="flex items-center gap-2">
            <div className="rounded-xl bg-teal-400 p-2 text-[#07111f]">
              <Bitcoin size={25} />
            </div>
            <span className="text-xl font-bold">
              Crypto<span className="text-teal-400">Aprende</span>
            </span>
          </a>

          <nav className="hidden items-center gap-8 text-sm text-gray-300 md:flex">
            <a href="#inicio" className="hover:text-teal-400">Início</a>
            <a href="#sobre" className="hover:text-teal-400">Sobre nós</a>
            <a href="#cursos" className="hover:text-teal-400">Cursos</a>
            <a href="#como-funciona" className="hover:text-teal-400">Como funciona</a>
          </nav>

          <div className="hidden gap-3 md:flex">
                        <Link href="/login" className="rounded-lg px-4 py-2 text-sm hover:text-teal-400">
              Entrar
            </Link>
            <Link href="/register" className="rounded-lg bg-teal-400 px-5 py-2 text-sm font-bold text-[#07111f] hover:bg-teal-300">
              Criar conta
            </Link>
          </div>

          <button className="md:hidden" aria-label="Menu">
            <Menu />
          </button>
        </div>
      </header>

      {/* HERO */}
      <section id="inicio" className="relative overflow-hidden">
        <div className="absolute -right-40 -top-40 h-96 w-96 rounded-full bg-teal-500/10 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-6 py-24 md:grid-cols-2 md:py-32">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-teal-400/30 bg-teal-400/10 px-4 py-2 text-sm text-teal-300">
              <Globe size={16} />
              Educação financeira para todos
            </div>

            <h1 className="text-4xl font-extrabold leading-tight md:text-6xl">
              Aprende sobre
              <span className="block text-teal-400">criptomoedas.</span>
              Constrói o teu futuro digital.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-8 text-gray-400">
              Aprende, participa em desafios educativos e acumula pontos.
              Descobre o universo das criptomoedas de forma simples, segura e
              acessível.
            </p>

            <div className="mt-9 flex flex-wrap gap-4">
              <a
                href="#cursos"
                className="inline-flex items-center gap-2 rounded-xl bg-teal-400 px-6 py-4 font-bold text-[#07111f] transition hover:bg-teal-300"
              >
                Começar a aprender <ArrowRight size={19} />
              </a>

              <a
                href="#sobre"
                className="rounded-xl border border-white/20 px-6 py-4 font-semibold transition hover:border-teal-400"
              >
                Conhecer a plataforma
              </a>
            </div>

            <div className="mt-10 flex flex-wrap gap-6 text-sm text-gray-400">
              <span className="flex items-center gap-2">
                <CheckCircle size={17} className="text-teal-400" />
                Aprendizagem gratuita
              </span>
              <span className="flex items-center gap-2">
                <ShieldCheck size={17} className="text-teal-400" />
                Educação responsável
              </span>
            </div>
          </div>

          {/* PAINEL ILUSTRATIVO */}
          <div className="rounded-3xl border border-white/10 bg-[#101e30] p-6 shadow-2xl shadow-teal-950/30">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-400">Painel de aprendizagem</p>
                <h2 className="mt-1 text-xl font-bold">O teu progresso</h2>
              </div>
              <div className="rounded-xl bg-teal-400/10 p-3 text-teal-400">
                <GraduationCap size={28} />
              </div>
            </div>

            <div className="mt-8 rounded-2xl bg-[#172a40] p-5">
              <div className="flex items-center justify-between">
                <span className="text-gray-400">Pontos ilustrativos</span>
                <Coins className="text-teal-400" />
              </div>
              <div className="mt-3 text-4xl font-bold">1.250 <span className="text-lg text-teal-400">PTS</span></div>
              <p className="mt-2 text-sm text-gray-400">
                Exemplo de pontos que poderás acumular.
              </p>
            </div>

            <div className="mt-5 space-y-5">
              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Introdução às criptomoedas</span>
                  <span className="text-teal-400">80%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-700">
                  <div className="h-full w-4/5 rounded-full bg-teal-400" />
                </div>
              </div>

              <div>
                <div className="mb-2 flex justify-between text-sm">
                  <span>Segurança digital</span>
                  <span className="text-teal-400">45%</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-gray-700">
                  <div className="h-full w-[45%] rounded-full bg-teal-400" />
                </div>
              </div>
            </div>

            <div className="mt-7 flex items-center gap-3 rounded-xl border border-white/10 p-4">
              <PlayCircle size={30} className="text-teal-400" />
              <div>
                <p className="font-semibold">Continua a aprender</p>
                <p className="text-sm text-gray-400">O teu próximo desafio espera por ti.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* SOBRE */}
      <section id="sobre" className="border-y border-white/10 bg-[#0b1828] py-20">
        <div className="mx-auto max-w-4xl px-6 text-center">
          <p className="font-semibold uppercase tracking-widest text-teal-400">
            Sobre o CryptoAprende
          </p>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            O conhecimento é o primeiro investimento.
          </h2>
          <p className="mt-6 text-lg leading-8 text-gray-400">
            O CryptoAprende é uma plataforma educativa que pretende tornar
            o conhecimento sobre criptomoedas acessível a pessoas de todo o
            mundo. Aprende ao teu ritmo, testa os teus conhecimentos e
            participa em actividades educativas.
          </p>
        </div>
      </section>

      {/* FUNCIONALIDADES */}
      <section id="cursos" className="mx-auto max-w-7xl px-6 py-24">
        <div className="text-center">
          <p className="font-semibold uppercase tracking-widest text-teal-400">
            O que podes fazer
          </p>
          <h2 className="mt-4 text-3xl font-bold md:text-4xl">
            Tudo para começares a tua jornada
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-gray-400">
            Uma experiência que combina educação, participação e progresso.
          </p>
        </div>

        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.title}
                className="rounded-2xl border border-white/10 bg-[#101e30] p-7 transition hover:-translate-y-1 hover:border-teal-400/50"
              >
                <div className="inline-flex rounded-xl bg-teal-400/10 p-3 text-teal-400">
                  <Icon size={27} />
                </div>
                <h3 className="mt-6 text-xl font-bold">{feature.title}</h3>
                <p className="mt-3 leading-7 text-gray-400">
                  {feature.description}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* COMO FUNCIONA */}
      <section id="como-funciona" className="bg-[#0b1828] py-24">
        <div className="mx-auto max-w-5xl px-6">
          <div className="text-center">
            <p className="font-semibold uppercase tracking-widest text-teal-400">
              Como funciona
            </p>
            <h2 className="mt-4 text-3xl font-bold md:text-4xl">
              Quatro passos para começar
            </h2>
          </div>

          <div className="mt-14 grid gap-5 sm:grid-cols-2">
            {steps.map((step, index) => (
              <div
                key={step}
                className="flex items-center gap-5 rounded-2xl border border-white/10 bg-[#101e30] p-6"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-teal-400 font-bold text-[#07111f]">
                  {index + 1}
                </div>
                <p className="font-semibold">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CHAMADA FINAL */}
      <section className="px-6 py-24 text-center">
        <div className="mx-auto max-w-3xl">
          <h2 className="text-3xl font-extrabold md:text-5xl">
            O teu futuro digital começa com conhecimento.
          </h2>
          <p className="mt-6 text-gray-400">
            Dá o primeiro passo e começa a explorar o mundo das criptomoedas.
          </p>
          <a
            href="#cursos"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-teal-400 px-7 py-4 font-bold text-[#07111f] hover:bg-teal-300"
          >
            Explorar a plataforma <ArrowRight size={19} />
          </a>
        </div>
      </section>

      {/* RODAPÉ */}
      <footer className="border-t border-white/10 bg-[#050d18] px-6 py-8">
        <div className="mx-auto flex max-w-7xl flex-col justify-between gap-4 text-sm text-gray-500 md:flex-row">
          <p>
            © 2026 CryptoAprende. Todos os direitos reservados.
          </p>
          <p>
            Aprende primeiro. Participa com responsabilidade.
          </p>
        </div>
        <p className="mx-auto mt-4 max-w-7xl text-xs leading-6 text-gray-600">
          Os pontos apresentados são ilustrativos e não representam dinheiro
          nem criptomoedas. Recompensas reais dependerão de disponibilidade,
          financiamento e condições publicadas pela plataforma.
        </p>
      </footer>
    </main>
  );
}
