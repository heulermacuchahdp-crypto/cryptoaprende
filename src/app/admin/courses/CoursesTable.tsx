"use client";

import { useState } from "react";
import { Plus, Eye, EyeOff, GraduationCap } from "lucide-react";
import CourseForm from "./CourseForm";
import CourseRowActions from "./CourseRowActions";

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

export default function CoursesTable({
  initialCourses,
}: {
  initialCourses: Course[];
}) {
  const [showForm, setShowForm] = useState(false);

  return (
    <>
      <div className="flex justify-end mb-4">
        <button
          onClick={() => setShowForm(true)}
          className="inline-flex items-center gap-2 rounded-lg bg-teal-400 text-[#07111f] px-4 py-2 text-sm font-bold hover:bg-teal-300 transition"
        >
          <Plus size={16} /> Novo curso
        </button>
      </div>

      {initialCourses.length > 0 && (
        <div className="rounded-2xl border border-white/10 bg-[#101e30] overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-[#0b1828] text-left text-xs uppercase tracking-widest text-gray-500">
                <tr>
                  <th className="px-5 py-3">Curso</th>
                  <th className="px-5 py-3">Slug</th>
                  <th className="px-5 py-3">Nível</th>
                  <th className="px-5 py-3">Lições</th>
                  <th className="px-5 py-3">Estado</th>
                  <th className="px-5 py-3 text-right">Ações</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {initialCourses.map((c) => (
                  <tr key={c.id} className="hover:bg-white/5">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-2">
                        <div className="rounded-lg bg-teal-400/10 p-1.5 text-teal-400">
                          <GraduationCap size={14} />
                        </div>
                        <span className="font-medium">{c.title}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-400 text-xs font-mono">
                      {c.slug}
                    </td>
                    <td className="px-5 py-4 text-xs capitalize">
                      {c.level}
                    </td>
                    <td className="px-5 py-4 text-xs">{c.lesson_count}</td>
                    <td className="px-5 py-4">
                      <span
                        className={`inline-flex items-center gap-1 text-xs px-2 py-0.5 rounded-full ${
                          c.is_published
                            ? "bg-teal-400/10 text-teal-400"
                            : "bg-yellow-500/10 text-yellow-400"
                        }`}
                      >
                        {c.is_published ? (
                          <Eye size={10} />
                        ) : (
                          <EyeOff size={10} />
                        )}
                        {c.is_published ? "Publicado" : "Rascunho"}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      <CourseRowActions course={c} />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showForm && <CourseForm onClose={() => setShowForm(false)} />}
    </>
  );
}