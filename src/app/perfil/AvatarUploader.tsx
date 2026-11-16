"use client";

import { useRef, useState, useTransition } from "react";
import { Camera, Trash2, AlertCircle } from "lucide-react";
import { uploadAvatarAction, removeAvatarAction } from "./actions";

function initials(name: string | null | undefined) {
  const s = (name || "?").trim();
  return s.slice(0, 2).toUpperCase();
}

export default function AvatarUploader({
  currentUrl,
  displayName,
}: {
  currentUrl: string | null;
  displayName: string;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);

  function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setPreview(URL.createObjectURL(file));
  }

  function handleUpload() {
    if (!inputRef.current?.files?.[0]) return;
    const formData = new FormData();
    formData.append("avatar", inputRef.current.files[0]);

    start(async () => {
      const res = await uploadAvatarAction(formData);
      if (res.error) setError(res.error);
      else {
        setPreview(null);
        if (inputRef.current) inputRef.current.value = "";
      }
    });
  }

  function handleRemove() {
    if (!confirm("Remover o avatar atual?")) return;
    start(async () => {
      const res = await removeAvatarAction();
      if (res.error) setError(res.error);
      else setPreview(null);
    });
  }

  const shown = preview || currentUrl;

  return (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="h-28 w-28 rounded-full overflow-hidden bg-teal-400 text-[#07111f] flex items-center justify-center text-3xl font-bold border-4 border-[#101e30]">
          {shown ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={shown} alt="Avatar" className="h-full w-full object-cover" />
          ) : (
            initials(displayName)
          )}
        </div>
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="absolute bottom-0 right-0 h-9 w-9 rounded-full bg-teal-400 text-[#07111f] flex items-center justify-center shadow-lg hover:bg-teal-300"
          aria-label="Escolher imagem"
        >
          <Camera size={16} />
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        onChange={handleFile}
        className="hidden"
      />

      {preview && (
        <div className="flex gap-2 mt-3">
          <button
            type="button"
            onClick={handleUpload}
            disabled={pending}
            className="text-xs rounded-lg bg-teal-400 text-[#07111f] px-3 py-1.5 font-semibold disabled:opacity-50"
          >
            {pending ? "A guardar..." : "Guardar"}
          </button>
          <button
            type="button"
            onClick={() => {
              setPreview(null);
              if (inputRef.current) inputRef.current.value = "";
            }}
            className="text-xs rounded-lg border border-white/20 px-3 py-1.5"
          >
            Cancelar
          </button>
        </div>
      )}

      {currentUrl && !preview && (
        <button
          type="button"
          onClick={handleRemove}
          disabled={pending}
          className="mt-3 flex items-center gap-1 text-xs text-red-400 hover:text-red-300 disabled:opacity-50"
        >
          <Trash2 size={12} /> Remover avatar
        </button>
      )}

      {error && (
        <div className="mt-3 rounded-lg bg-red-500/10 border border-red-500/30 p-2 text-xs text-red-300 flex items-start gap-1 max-w-xs">
          <AlertCircle size={14} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}