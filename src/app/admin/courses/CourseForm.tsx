"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  X,
  Save,
  AlertCircle,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { createCourseAction, updateCourseAction } from "./actions";

type Course = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  level: string;
  icon: string | null;
  is_published: boolean;
};

export default function CourseForm({
  course,
  onClose,
}: {
  course?: Course;
  onClose: () => void;
}) {
  const router = useRouter();
  const isEdit = !!course;
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
          ? await updateCourseAction(formData)
          : await createCourseAction(formData);

        if (res.error) {
          setError(res.error);
          return;
        }
        setSuccess(true);
        router.refresh();
        setTimeout(() => onClose(), 800);
      } catch (e) {
        setError(
          e instanceof Error ? e.message : "Erro inesperado."
        );
      }
    });
  }

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#101e30] p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold">
            {isEdit ? "Editar curso" : "Novo curso"}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white"
            type="button"
          >
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
          {isEdit && <input type="hidden" name="id" value={course.id} />}

          {!isEdit && (
            <div>
              <label className="block text-sm font-medium mb-1">Slug</label>
              <input
                name="slug"
                type="text"
                required
                pattern="[a-z0-9-]+"
                defaultValue=""
                placeholder="ex: introducao-cripto"
                className="w-full rounded-lg bg-[#0b1828] border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-teal-400"
              />
              <p className="text-xs text-gray-500 mt-1">
                Só a-z, 0-9 e hífen. Não pode ser alterado depois.
              </p>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium mb-1">Título</label>
            <input
              name="title"
              type="text"
              required
              minLength={3}
              defaultValue={course?.title || ""}
              className="w-full rounded-lg bg-[#0b1828] border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-teal-400"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Descrição</label>
            <textarea
              name="description"
              rows={3}
              defaultValue={course?.description || ""}
              className="w-full rounded-lg bg-[#0b1828] border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-teal-400 resize-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-sm font-medium mb-1">Nível</label>
              <select
                name="level"
                defaultValue={course?.level || "beginner"}
                className="w-full rounded-lg bg-[#0b1828] border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-teal-400"
              >
                <option value="beginner">Iniciante</option>
                <option value="intermediate">Intermédio</option>
                <option value="advanced">Avançado</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Ícone</label>
              <select
                name="icon"
                defaultValue={course?.icon || "BookOpen"}
                className="w-full rounded-lg bg-[#0b1828] border border-white/10 px-3 py-2 text-sm focus:outline-none focus:border-teal-400"
              >
                <option value="BookOpen">Livro</option>
                <option value="Bitcoin">Bitcoin</option>
                <option value="ShieldCheck">Escudo</option>
                <option value="Coins">Moedas</option>
                <option value="GraduationCap">Capelo</option>
              </select>
            </div>
          </div>

          {!isEdit && (
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                name="is_published"
                defaultChecked
                className="accent-teal-400"
              />
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