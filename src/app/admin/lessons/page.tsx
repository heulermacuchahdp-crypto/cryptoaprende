import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ArrowLeft } from "lucide-react";
import LessonsTable from "./LessonsTable";

type Lesson = {
  id: string;
  course_id: string;
  course_title: string;
  course_slug: string;
  slug: string;
  title: string;
  content: string | null;
  duration_minutes: number;
  points_reward: number;
  order_index: number;
  is_published: boolean;
  created_at: string;
};

type CourseOption = { id: string; title: string; slug: string };

export default async function AdminLessonsPage() {
  const supabase = await createClient();

  const [{ data: lessonsData, error }, { data: coursesData }] =
    await Promise.all([
      supabase.rpc("admin_list_lessons"),
      supabase.rpc("admin_list_courses_simple"),
    ]);

  if (error) {
    return (
      <div className="p-8">
        <div className="rounded-2xl border border-red-500/30 bg-red-500/10 p-4 text-red-300">
          Erro ao carregar lições: {error.message}
        </div>
      </div>
    );
  }

  const lessons = (lessonsData as Lesson[]) ?? [];
  const courses = (coursesData as CourseOption[]) ?? [];

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold mb-2">Lições</h1>
          <p className="text-gray-400">
            {lessons.length} liç{lessons.length !== 1 ? "ões" : "ão"} no total ·{" "}
            {courses.length} curso{courses.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/admin"
          className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-teal-400"
        >
          <ArrowLeft size={16} /> Voltar
        </Link>
      </div>

      <LessonsTable lessons={lessons} courses={courses} />
    </div>
  );
}