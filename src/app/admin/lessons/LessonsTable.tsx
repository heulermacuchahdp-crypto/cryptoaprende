"use client";

import { useState, useMemo } from "react";
import { Plus, Eye, EyeOff, BookOpen, Filter } from "lucide-react";
import LessonForm from "./LessonForm";
import LessonRowActions from "./LessonRowActions";

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

export default function LessonsTable({
  lessons,
  courses,
}: {
  lessons: Lesson[];
  courses: CourseOption[];
}) {
  const [showForm, setShowForm] = useState(false);
  const [defaultCourseId, setDefaultCourseId] = useState<string | undefined>();
  const [filterCourse, setFilterCourse] = useState<string>("all");

  const filtered = useMemo(() => {
    if (filterCourse === "all") return lessons;
    return lessons.filter((l) => l.course_id === filterCourse);
  }, [lessons, filterCourse]);

  function handleNew() {
    setDefaultCourseId(filterCourse !== "all" ? filterCourse : undefined);
    setShowForm(true);
  }

  return (
    <>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
        <div className="flex items-center gap-2">
          <Filter size={16} className="text-gray-400" />
          <select
            value={filterCourse}
            onChange={(e) => setFilterCourse(e.target.value)}
            className="rounded-lg bg-[#101e30] border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-teal-400"
          >
            <option value="all">Todos os cursos</option>
            {courses.map((c) => (
              <option key={c.id} value={c.id}>
                {c.title}
              </option>
            ))}
          </select>
          <span className="text-xs text-gray-500">
            {filtered.length} liç{filtered.length !== 1 ? "ões" : "ão"}
          </span>
        </div>

        <button
          onClick={handleNew}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-400 text-[#07111f] px-4 py-2 text-sm font-bold hover:bg-teal-300 transition"
        >
          <Plus size={16} /> Nova lição
        </button>
      </div>

      {filtered.length === 0 ? (
        <div className="rounded-2xl border border-white/10 bg-[#101e30] p-8 text-center">
          <BookOpen className="text-teal-400 mx-auto mb-3" size={40} />
          <p className="text-gray-400 mb-4">
            {filterCourse === "all"
              ? "Ainda não há lições. Cria a primeira."
              : "Este curso ainda não tem lições."}
          </p>
          <button
            onClick={handleNew}
            className="rounded-lg bg-teal-400 text-[#07111f] px-4 py-2 text-sm font-bold"
          >
            Criar lição
          </button>
        </div>
      ) : (
        <div className="rounded-2xl border border-white/10 bg-[#101e30] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#0b1828] text-left text-xs uppercase tracking-widest text-gray-500">
                <tr>
                  <th className="px-5 py-3">Lição</th>
                  <th className="px-5 py-3">Curso</th>
                  <th className="px-5 py-3">Duração</th>
                  <th className="px-5 py-3">Pontos</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {filtered.map((l) => (
                  <tr key={l.id} className="hover:bg-white/5">
                    <td className="px-5 py-4">
                      <div>
                        <p className="font-medium">{l.title}</p>
                        <p className="text-xs text-gray-500 font-mono">
                          {l.slug}
                        </p>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-xs text-gray-400">
                      {l.course_title}
                    </td>
                    <td className="px-5 py-4 text-xs">{l.duration_minutes} min</td>
                    <td className="px-5 py-4 text-xs text-teal-400 font-semibold">
                      +{l.points_reward}
                    </td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                          l.is_published
                            ? "bg-teal-400/10 text-teal-400"
                            : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {l.is_published ? <Eye size={10} /> : <EyeOff size={10} />}
                        {l.is_published ? "Publicada" : "Rascunho"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <LessonRowActions lesson={l} courses={courses} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && (
        <LessonForm
          courses={courses}
          defaultCourseId={defaultCourseId}
          onClose={() => setShowForm(false)}
        />
      )}
    </>
  );
}