import Link from "next/link";
import { connection } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { Bitcoin, BookOpen, ArrowRight, GraduationCap } from "lucide-react";

export default async function CoursesPage() {
  await connection();

  const supabase = await createClient();
  const { data: courses } = await supabase
    .from("courses")
    .select("id, slug, title, description, level, icon, order_index")
    .order("order_index");

  return (
    <main className="min-h-screen bg-[#07111f] text-white">
      <header className="border-b border-white/10">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-6 py-5">
          <Link href="/" className="flex items-center gap-2">
            <div className="rounded-xl bg-teal-400 p-2 text-[#07111f]">
              <Bitcoin size={22} />
            </div>
            <span className="text-lg font-bold">
              Crypto<span className="text-teal-400">Aprende</span>
            </span>
          </Link>
          <nav className="flex gap-6 text-sm text-gray-300">
            <Link href="/courses" className="text-teal-400">
              Cursos
            </Link>
            <Link href="/dashboard" className="hover:text-teal-400">
              Painel
            </Link>
          </nav>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-12">
        <div className="mb-10">
          <h1 className="text-3xl font-bold mb-2">Cursos</h1>
          <p className="text-gray-400">
            Escolhe um curso para começar a aprender.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {(courses ?? []).map((course) => (
            <Link
              key={course.id}
              href={`/courses/${course.slug}`}
              className="group rounded-2xl border border-white/10 bg-[#101e30] p-6 transition hover:border-teal-400/50 hover:-translate-y-1"
            >
              <div className="flex items-center gap-3 mb-4">
                <div className="rounded-xl bg-teal-400/10 p-3 text-teal-400">
                  {course.icon === "Bitcoin" ? (
                    <Bitcoin size={22} />
                  ) : course.icon === "ShieldCheck" ? (
                    <GraduationCap size={22} />
                  ) : (
                    <BookOpen size={22} />
                  )}
                </div>
                <span className="text-xs uppercase tracking-widest text-gray-500">
                  {course.level}
                </span>
              </div>
              <h3 className="text-lg font-bold mb-2 group-hover:text-teal-400">
                {course.title}
              </h3>
              <p className="text-sm text-gray-400 line-clamp-3 mb-4">
                {course.description}
              </p>
              <span className="inline-flex items-center gap-1 text-sm text-teal-400">
                Abrir curso <ArrowRight size={15} />
              </span>
            </Link>
          ))}
        </div>

        {(!courses || courses.length === 0) && (
          <p className="text-gray-500">Ainda não há cursos publicados.</p>
        )}
      </section>
    </main>
  );
}