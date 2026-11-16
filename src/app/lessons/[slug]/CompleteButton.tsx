"use client";

import { useState, useTransition } from "react";
import { CheckCircle, Coins, AlertCircle } from "lucide-react";
import { completeLessonAction } from "./actions";

export default function CompleteButton({
  lessonId,
  alreadyDone,
  points,
}: {
  lessonId: string;
  alreadyDone: boolean;
  points: number;
}) {
  const [pending, start] = useTransition();
  const [done, setDone] = useState(alreadyDone);
  const [earned, setEarned] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleClick() {
    setError(null);
    start(async () => {
      const res = await completeLessonAction(lessonId);
      if (res.error) {
        setError(res.error);
        return;
      }
      setDone(true);
      setEarned(res.points);
    });
  }

  if (done) {
    return (
      <div className="rounded-xl border border-teal-400/30 bg-teal-400/10 p-5 flex items-center gap-3 text-teal-300">
        <CheckCircle size={22} />
        <div>
          <p className="font-semibold">Lição concluída</p>
          {earned !== null && earned > 0 && (
            <p className="text-sm">Ganhaste +{earned} pontos!</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div>
      {error && (
        <div className="mb-3 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-300 flex items-start gap-2">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
      <button
        onClick={handleClick}
        disabled={pending}
        className="rounded-xl bg-teal-400 hover:bg-teal-300 disabled:opacity-50 text-[#07111f] font-bold px-6 py-3 flex items-center gap-2 transition"
      >
        <Coins size={18} />
        {pending ? "A registar..." : `Concluir lição (+${points} pts)`}
      </button>
    </div>
  );
}