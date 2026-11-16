"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Eye,
  EyeOff,
  Trash2,
  Pencil,
  AlertCircle,
  Loader2,
  CheckCircle,
} from "lucide-react";
import { deleteCourseAction, togglePublishAction } from "./actions";
import CourseForm from "./CourseForm";

type Course = {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  level: string;
  icon: string | null;
  is_published: boolean;
};

export default function CourseRowActions({ course }: { course: Course }) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [editing, setEditing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleToggle() {
    setError(null);
    setSuccess(false);
    start(async () => {
      const res = await togglePublishAction(course.id);
      if (res.error) setError(res.error);
      else {
        setSuccess(true);
        router.refresh();
        setTimeout(() => setSuccess(false), 1500);
      }
    });
  }

  function handleDelete() {
    if (
      !confirm(
        `Eliminar o curso "${course.title}"?\n\nTodas as lições e quizzes associados serão apagados. Esta ação não pode ser revertida.`
      )
    )
      return;

    setError(null);
    start(async () => {
      const res = await deleteCourseAction(course.id);
      if (res.error) setError(res.error);
      else router.refresh();
    });
  }

  return (
    <>
      <div className="flex flex-col items-end gap-1">
        <div className="flex gap-1">
          <button
            onClick={() => setEditing(true)}
            disabled={pending}
            className="p-1.5 rounded text-gray-400 hover:text-teal-400 hover:bg-white/5 disabled:opacity-50"
            title="Editar"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={handleToggle}
            disabled={pending}
            className="p-1.5 rounded text-gray-400 hover:text-teal-400 hover:bg-white/5 disabled:opacity-50"
            title={course.is_published ? "Despublicar" : "Publicar"}
          >
            {pending ? (
              <Loader2 size={14} className="animate-spin" />
            ) : course.is_published ? (
              <EyeOff size={14} />
            ) : (
              <Eye size={14} />
            )}
          </button>
          <button
            onClick={handleDelete}
            disabled={pending}
            className="p-1.5 rounded text-gray-400 hover:text-red-400 hover:bg-red-500/10 disabled:opacity-50"
            title="Eliminar"
          >
            <Trash2 size={14} />
          </button>
        </div>
        {error && (
          <span className="text-xs text-red-400 flex items-center gap-1 max-w-55 text-right">
            <AlertCircle size={10} className="shrink-0" /> {error}
          </span>
        )}
        {success && (
          <span className="text-xs text-teal-400 flex items-center gap-1">
            <CheckCircle size={10} /> Feito
          </span>
        )}
      </div>

      {editing && (
        <CourseForm course={course} onClose={() => setEditing(false)} />
      )}
    </>
  );
}