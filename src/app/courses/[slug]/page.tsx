import Link from "next/link";
import { notFound } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Bitcoin, ArrowLeft, Clock, Coins } from "lucide-react";

export default async function CoursePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: course } = await supabase
    .from("courses")
    .select("id, slug, title, description, level")
    .eq("slug", slug)
    .single();

  if (!course) notFound();

  const { data: lessons } = await supabase
    .from("lessons")
    .select("id, slug, title, duration_minutes, points_reward, order_index")
    .eq("course_id", course.id)
    .eq("is_published", true)
    .order("order_index");

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-5xl flex items-center justify-between px-6 py-5">
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

      <section className="mx-auto max-w-5xl px-6 py-12">
        <Link
          href="/courses"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-teal-400 mb-6"
        >
          <ArrowLeft size={16} /> Todos os cursos
        </Link>

        <p className="text-xs uppercase tracking-widest text-teal-400 mb-2">
          {course.level}
        </p>
        <h1 className="text-3xl font-bold mb-3">{course.title}</h1>
        <p className="text-gray-400 mb-10">{course.description}</p>

        <h2 className="text-xl font-bold mb-5">
          Lições ({lessons?.length ?? 0})
        </h2>

        <div className="space-y-3">
          {(lessons ?? []).map((lesson, i) => (
            <Link
              key={lesson.id}
              href={`/lessons/${lesson.slug}`}
              className="flex items-center gap-4 rounded-xl border border-white/10 bg-[#101e30] p-5 hover:border-teal-400/50 transition"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-400/10 text-teal-400 font-bold">
                {i + 1}
              </div>
              <div className="flex-1">
                <h3 className="font-semibold">{lesson.title}</h3>
                <div className="flex gap-4 mt-1 text-xs text-gray-500">
                  <span className="flex items-center gap-1">
                    <Clock size={12} /> {lesson.duration_minutes} min
                  </span>
                  <span className="flex items-center gap-1">
                    <Coins size={12} /> +{lesson.points_reward} pts
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}