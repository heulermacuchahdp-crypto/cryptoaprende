"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { X, Save, AlertCircle, Loader2, CheckCircle } from "lucide-react";
import { createLessonAction, updateLessonAction } from "./actions";

type CourseOption = {
  id: string;
  title: string;
  slug: string;
};

type Lesson = {
  id: string;
  course_id: string;
  slug: string;
  title: string;
  content: string | null;
  duration_minutes: number;
  points_reward: number;
  order_index: number;
  is_published: boolean;
};

export default function LessonForm({
  courses,
  lesson,
  defaultCourseId,
  onClose,
}: {
  courses: CourseOption[];
  lesson?: Lesson;
  defaultCourseId?: string;
  onClose: () => void;
}) {
  const router = useRouter();
  const isEdit = !!lesson;
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setSuccess(false);

    const formData = new FormData(e.currentTarget);

    start(async () => {
      try {
        const res = isEdit
          ? await updateLessonAction(formData)
          : await createLessonAction(formData);

        if (res.error) {
          setError(res.error);
          return;
        }
        setSuccess(true);
        router.refresh();
        setTimeout(() => onClose(), 800);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Erro inesperado.");
      }
    });
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="w-full max-w-2xl rounded-2xl border border-white/10 bg-[#101e30] p-6 my-8">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">
            {isEdit ? "Editar lição" : "Nova lição"}
          </h2>
          <button onClick={onClose} type="button" className="text-gray-400 hover:text-white">
            <X size={20} />
          </button>
        </div>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-300 flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="mb-4 rounded-lg bg-teal-500/10 border border-teal-500/30 p-3 text-sm text-teal-300 flex items-start gap-2">
            <CheckCircle size={16} className="shrink-0 mt-0.5" />
            <span>Guardado com sucesso.</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isEdit && <input type="hidden" name="id" value={lesson.id} />}

          {!isEdit && (
            <>
              <div>
                <label className="block text-sm font-medium mb-1">Curso *</label>
                <select
                  name="course_id"
                  required
                  defaultValue={defaultCourseId || ""}
                  className="w-full rounded-lg bg-[#0b1828] border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-teal-400"
                >
                  <option value="" disabled>
                    Escolhe um curso
                  </option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.title}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Slug *</label>
                <input
                  name="slug"
                  type="text"
                  required
                  pattern="[a-z0-9-]+"
                  placeholder="ex: o-que-e-bitcoin"
                  className="w-full rounded-lg bg-[#0b1828] border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-teal-400"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Só a-z, 0-9 e hífen. Único dentro do curso.
                </p>
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Título *</label>
            <input
              name="title"
              type="text"
              required
              minLength={3}
              defaultValue={lesson?.title || ""}
              className="w-full rounded-lg bg-[#0b1828] border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-teal-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Conteúdo</label>
            <textarea
              name="content"
              rows={8}
              defaultValue={lesson?.content || ""}
              className="w-full rounded-lg bg-[#0b1828] border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-teal-400 resize-none font-mono"
              placeholder="Texto da lição (suporta quebras de linha)"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Duração (min)</label>
              <input
                name="duration_minutes"
                type="number"
                min={1}
                max={120}
                defaultValue={lesson?.duration_minutes || 5}
                className="w-full rounded-lg bg-[#0b1828] border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-teal-400"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Pontos</label>
              <input
                name="points_reward"
                type="number"
                min={0}
                max={1000}
                defaultValue={lesson?.points_reward || 10}
                className="w-full rounded-lg bg-[#0b1828] border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-teal-400"
              />
            </div>
          </div>

          {isEdit && (
            <div>
              <label className="block text-sm font-medium mb-1">Ordem</label>
              <input
                name="order_index"
                type="number"
                min={0}
                defaultValue={lesson?.order_index || 0}
                className="w-full rounded-lg bg-[#0b1828] border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-teal-400"
              />
              <p className="text-xs text-gray-500 mt-1">
                Lições com ordem menor aparecem primeiro.
              </p>
            </div>
          )}

          {!isEdit && (
            <label className="flex items-center gap-2 text-sm">
              <input type="checkbox" name="is_published" defaultChecked className="accent-teal-400" />
              Publicar imediatamente
            </label>
          )}

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/20 px-4 py-2 text-sm hover:bg-white/5"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-lg bg-teal-400 text-[#07111f] px-4 py-2 text-sm font-bold hover:bg-teal-300 disabled:opacity-60"
            >
              {pending ? (
                <>
                  <Loader2 size={14} className="animate-spin" /> A guardar...
                </>
              ) : (
                <>
                  <Save size={14} /> {isEdit ? "Guardar" : "Criar"}
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}