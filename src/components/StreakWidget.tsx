"use client";

import { useEffect, useState } from "react";
import { Flame, Gift, CheckCircle, Lock } from "lucide-react";
import { createClient } from "@/lib/supabase/client";

type Milestone = {
  milestone: number;
  points: number;
  claimed: boolean;
};

export default function StreakWidget({
  currentStreak,
}: {
  currentStreak: number;
}) {
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const supabase = createClient();

  useEffect(() => {
    supabase
      .rpc("get_streak_milestones")
      .then(({ data }) => {
        setMilestones((data as Milestone[]) ?? []);
        setLoading(false);
      });
  }, [supabase]);

  const nextMilestone = milestones.find(
    (m) => !m.claimed && m.milestone > currentStreak
  );
  const progressPct = nextMilestone
    ? Math.min(100, Math.round((currentStreak / nextMilestone.milestone) * 100))
    : 100;

  return (
    <div className="rounded-2xl border border-white/10 bg-[#101e30] p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Flame className="text-orange-400" size={20} />
          <h2 className="text-lg font-bold">Streak</h2>
        </div>
        <span className="text-3xl font-bold text-orange-400">
          {currentStreak}
          <span className="text-base text-gray-500">d</span>
        </span>
      </div>

      {nextMilestone ? (
        <div className="mb-4">
          <div className="flex justify-between text-xs mb-1">
            <span className="text-gray-400">
              Próximo: {nextMilestone.milestone} dias
            </span>
            <span className="text-teal-400 font-semibold">
              +{nextMilestone.points} pts
            </span>
          </div>
          <div className="h-2 rounded-full bg-gray-700 overflow-hidden">
            <div
              className="h-full bg-linear-to-r from-orange-500 to-teal-400 transition-all"
              style={{ width: `${progressPct}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {nextMilestone.milestone - currentStreak}{" "}
            {nextMilestone.milestone - currentStreak === 1 ? "dia" : "dias"}{" "}
            para o próximo bónus
          </p>
        </div>
      ) : (
        <div className="mb-4 rounded-lg bg-teal-400/10 border border-teal-400/30 p-2 text-center">
          <p className="text-xs text-teal-300">
            Todos os bónus desbloqueados! 🔥
          </p>
        </div>
      )}

      {loading ? (
        <p className="text-xs text-gray-500 text-center py-2">
          A carregar...
        </p>
      ) : (
        <div className="grid grid-cols-3 gap-2">
          {milestones.map((m) => {
            const reached = currentStreak >= m.milestone;
            return (
              <div
                key={m.milestone}
                className={`rounded-lg p-2 text-center text-xs border ${
                  m.claimed
                    ? "bg-teal-400/10 border-teal-400/30"
                    : reached
                    ? "bg-orange-400/10 border-orange-400/30"
                    : "bg-white/5 border-white/10 opacity-60"
                }`}
              >
                <div className="flex justify-center mb-1">
                  {m.claimed ? (
                    <CheckCircle className="text-teal-400" size={14} />
                  ) : reached ? (
                    <Gift className="text-orange-400 animate-pulse" size={14} />
                  ) : (
                    <Lock className="text-gray-500" size={14} />
                  )}
                </div>
                <p className="font-semibold text-white">{m.milestone}d</p>
                <p className="text-[10px] text-gray-500">+{m.points} pts</p>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}