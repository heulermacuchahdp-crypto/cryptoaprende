import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { BookOpen, ArrowLeft } from "lucide-react";
import CoursesTable from "./CoursesTable";

type Course = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  level: string;
  icon: string | null;
  is_published: boolean;
  order_index: number;
  lesson_count: number;
  created_at: string;
};

export default async function AdminCoursesPage() {
  const supabase = await createClient();
  const { data, error } = await supabase.rpc("admin_list_courses");

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
          Erro ao carregar cursos: {error.message}
        </div>
      </div>
    );
  }

  const courses = (data as Course[]) ?? [];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Cursos</h1>
          <p className="text-gray-400">
            {courses.length} curso{courses.length !== 1 ? "s" : ""} no total
          </p>
        </div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-teal-400"
        >
          <ArrowLeft size={16} /> Voltar
        </Link>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#101e30] p-8 text-center">
          <BookOpen className="text-teal-400 mx-auto mb-3" size={40} />
          <p className="text-gray-400">
            Ainda não há cursos. Cria o primeiro.
          </p>
        </div>
      ) : null}

      <CoursesTable initialCourses={courses} />
    </div>
  );
}