import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Bitcoin, ArrowLeft, Clock, Coins, Trophy } from "lucide-react";
import CompleteButton from "./CompleteButton";

export default async function LessonPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: lesson } = await supabase
    .from("lessons")
    .select(
      "id, slug, title, content, duration_minutes, points_reward, course_id, courses(slug, title)"
    )
    .eq("slug", slug)
    .eq("is_published", true)
    .single();

  if (!lesson) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  let alreadyDone = false;
  if (user) {
    const { data: progress } = await supabase
      .from("user_progress")
      .select("completed")
      .eq("user_id", user.id)
      .eq("lesson_id", lesson.id)
      .maybeSingle();
    alreadyDone = !!progress?.completed;
  }

  const course = Array.isArray(lesson.courses)
    ? lesson.courses[0]
    : lesson.courses;

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-3xl flex items-center justify-between px-6 py-5">
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

      <article className="mx-auto max-w-3xl px-6 py-12">
        {course && (
          <Link
            href={`/courses/${course.slug}`}
            className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-teal-400 mb-6"
          >
            <ArrowLeft size={16} /> {course.title}
          </Link>
        )}

        <h1 className="text-3xl font-bold mb-3">{lesson.title}</h1>

        <div className="flex gap-4 mb-8 text-sm text-gray-500">
          <span className="flex items-center gap-1">
            <Clock size={14} /> {lesson.duration_minutes} min
          </span>
          <span className="flex items-center gap-1">
            <Coins size={14} /> +{lesson.points_reward} pts
          </span>
        </div>

        <div className="prose prose-invert max-w-none text-gray-300 leading-8 mb-10 whitespace-pre-line">
          {lesson.content || "Conteúdo em preparação."}
        </div>

        {user ? (
          <div className="space-y-3">
            <Link
              href={`/quiz/${lesson.id}`}
              className="inline-flex items-center gap-2 rounded-xl border border-teal-400 text-teal-400 hover:bg-teal-400/10 px-6 py-3 font-semibold transition"
            >
              <Trophy size={18} /> Fazer quiz (+3 pts por acerto)
            </Link>
            <div>
              <CompleteButton
                lessonId={lesson.id}
                alreadyDone={alreadyDone}
                points={lesson.points_reward}
              />
            </div>
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-[#101e30] p-5 text-center">
            <p className="text-gray-400 mb-3">
              Entra na tua conta para ganhar pontos ao concluir esta lição.
            </p>
            <Link
              href="/login"
              className="inline-block rounded-lg bg-teal-400 px-5 py-2 font-semibold text-[#07111f] hover:bg-teal-300"
            >
              Entrar
            </Link>
          </div>
        )}
      </article>
    </main>
  );
}