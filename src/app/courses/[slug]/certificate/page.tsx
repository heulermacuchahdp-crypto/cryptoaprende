import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Bitcoin, ArrowLeft, Award, Lock, CheckCircle } from "lucide-react";
import CertificateView from "./CertificateView";
import CertificateButton from "@/components/CertificateButton";

export default async function CertificatePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: course } = await supabase
    .from("courses")
    .select("id, slug, title, description")
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!course) notFound();

  const { data: certData } = await supabase.rpc("get_certificate_info", {
    p_course_id: course.id,
  });

  const certificate = Array.isArray(certData) ? certData[0] : certData;

  if (certificate) {
    return (
      <main className="min-h-screen bg-[#07111f] text-white">
        <header className="print:hidden border-b border-white/10 sticky top-0 bg-[#07111f]/95 backdrop-blur z-10">
          <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="rounded-xl bg-teal-400 p-2 text-[#07111f]">
                <Bitcoin size={22} />
              </div>
              <span className="text-lg font-bold">
                Crypto<span className="text-teal-400">Aprende</span>
              </span>
            </Link>
            <Link
              href={`/courses/${course.slug}`}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-teal-400"
            >
              <ArrowLeft size={16} /> Voltar ao curso
            </Link>
          </div>
        </header>

        <section className="mx-auto max-w-5xl px-6 py-10 print:p-0 print:max-w-none print:mx-0">
          <div className="print:hidden text-center mb-8">
            <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-teal-400/10 text-teal-400 mb-4">
              <Award size={32} />
            </div>
            <h1 className="text-3xl font-bold mb-2">O teu certificado</h1>
            <p className="text-gray-400">
              Parabéns por completar o curso «{course.title}»!
            </p>
          </div>

          <CertificateView certificate={certificate} />
        </section>
      </main>
    );
  }

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id")
    .eq("course_id", course.id)
    .eq("is_published", true);

  const totalLessons = lessons?.length ?? 0;
  const lessonIds = (lessons ?? []).map((l) => l.id);

  const { data: progress } = await supabase
    .from("user_progress")
    .select("lesson_id, completed")
    .eq("user_id", user.id)
    .in("lesson_id", lessonIds)
    .eq("completed", true);

  const completedLessons = progress?.length ?? 0;
  const pct =
    totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const hasCompleted = completedLessons >= totalLessons && totalLessons > 0;

  if (!hasCompleted) {
    return (
      <main className="min-h-screen bg-[#07111f] text-white">
        <header className="border-b border-white/10 sticky top-0 bg-[#07111f]/95 backdrop-blur z-10">
          <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2">
              <div className="rounded-xl bg-teal-400 p-2 text-[#07111f]">
                <Bitcoin size={22} />
              </div>
              <span className="text-lg font-bold">
                Crypto<span className="text-teal-400">Aprende</span>
              </span>
            </Link>
            <Link
              href={`/courses/${course.slug}`}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-teal-400"
            >
              <ArrowLeft size={16} /> Voltar ao curso
            </Link>
          </div>
        </header>

        <section className="mx-auto max-w-2xl px-6 py-16 text-center">
          <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-yellow-500/10 text-yellow-400 mb-6">
            <Lock size={36} />
          </div>
          <h1 className="text-3xl font-bold mb-3">Certificado bloqueado</h1>
          <p className="text-gray-400 mb-8">
            Completa todas as lições do curso «{course.title}» para
            desbloquear o teu certificado.
          </p>

          <div className="rounded-2xl border border-white/10 bg-[#101e30] p-6 mb-8">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-400">Progresso</span>
              <span className="text-teal-400 font-bold">{pct}%</span>
            </div>
            <div className="h-3 rounded-full bg-gray-700 overflow-hidden">
              <div
                className="h-full bg-linear-to-r from-teal-400 to-teal-500 transition-all"
                style={{ width: `${pct}%` }}
              />
            </div>
            <p className="text-xs text-gray-500 mt-3">
              {completedLessons} de {totalLessons} lições concluídas
            </p>
          </div>

          <Link
            href={`/courses/${course.slug}`}
            className="inline-flex items-center gap-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-[#07111f] font-bold px-6 py-3 transition"
          >
            <CheckCircle size={18} /> Continuar curso
          </Link>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <header className="border-b border-white/10 sticky top-0 bg-[#07111f]/95 backdrop-blur z-10">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-xl bg-teal-400 p-2 text-[#07111f]">
              <Bitcoin size={22} />
            </div>
            <span className="text-lg font-bold">
              Crypto<span className="text-teal-400">Aprende</span>
            </span>
          </Link>
        </div>
      </header>

      <section className="mx-auto max-w-2xl px-6 py-16 text-center">
        <div className="inline-flex items-center justify-center h-20 w-20 rounded-full bg-teal-400/10 text-teal-400 mb-6">
          <Award size={36} />
        </div>
        <h1 className="text-3xl font-bold mb-3">Parabéns! 🎉</h1>
        <p className="text-gray-400 mb-8">
          Completaste todas as lições do curso «{course.title}». Gera agora
          o teu certificado.
        </p>

        <CertificateButton
          courseId={course.id}
          courseSlug={course.slug}
        />
      </section>
    </main>
  );
}