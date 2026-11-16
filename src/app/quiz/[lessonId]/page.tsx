import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Bitcoin, ArrowLeft } from "lucide-react";
import QuizForm from "./QuizForm";

const MAX_ATTEMPTS = 3;

export default async function QuizPage({
  params,
}: {
  params: Promise<{ lessonId: string }>;
}) {
  const { lessonId } = await params;
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: lesson } = await supabase
    .from("lessons")
    .select("id, slug, title, course_id, courses(slug, title)")
    .eq("id", lessonId)
    .single();

  if (!lesson) notFound();

  const [{ data: questions }, { data: attemptsUsedData }] = await Promise.all([
    supabase
      .from("quiz_questions")
      .select("id, question, options, correct_option_id, order_index")
      .eq("lesson_id", lessonId)
      .order("order_index"),
    supabase.rpc("get_quiz_attempt_count", { p_lesson_id: lessonId }),
  ]);

  const attemptsUsed = (attemptsUsedData as number | null) ?? 0;
  const course = Array.isArray(lesson.courses)
    ? lesson.courses[0]
    : lesson.courses;

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <header className="border-b border-white/10 sticky top-0 bg-[#07111f]/95 backdrop-blur z-10">
        <div className="mx-auto max-w-3xl flex items-center justify-between px-6 py-4">
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

      <section className="mx-auto max-w-3xl px-6 py-10">
        <Link
          href={`/lessons/${lesson.slug}`}
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-teal-400 mb-6"
        >
          <ArrowLeft size={16} /> Voltar a licao
        </Link>

        <h1 className="text-3xl font-bold mb-2">Quiz: {lesson.title}</h1>
        {course && <p className="text-gray-400 mb-8">{course.title}</p>}

        {!questions || questions.length === 0 ? (
          <div className="rounded-2xl border border-white/10 bg-[#101e30] p-8 text-center">
            <p className="text-gray-400 mb-4">
              Esta licao ainda nao tem quiz.
            </p>
            <Link
              href={`/lessons/${lesson.slug}`}
              className="inline-block rounded-lg bg-teal-400 px-5 py-2 font-semibold text-[#07111f] hover:bg-teal-300"
            >
              Voltar a licao
            </Link>
          </div>
        ) : (
          <QuizForm
            lessonId={lesson.id}
            lessonSlug={lesson.slug}
            questions={
              questions as {
                id: string;
                question: string;
                options: { id: string; text: string }[];
                correct_option_id: string;
              }[]
            }
            attemptsUsed={attemptsUsed}
            maxAttempts={MAX_ATTEMPTS}
          />
        )}
      </section>
    </main>
  );
}