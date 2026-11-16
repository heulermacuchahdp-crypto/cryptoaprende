"use client";

import { useEffect, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";
import { createClient } from "@/lib/supabase/client";

type Point = { day: string; pontos: number };

const LABELS = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"];

export default function PointsChart({ userId }: { userId: string }) {
  const [data, setData] = useState<Point[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();

    const start = new Date();
    start.setHours(0, 0, 0, 0);
    start.setDate(start.getDate() - 6);

    supabase
      .from("points_transactions")
      .select("amount, created_at")
      .eq("user_id", userId)
      .gte("created_at", start.toISOString())
      .order("created_at")
      .then(({ data: rows, error }) => {
        if (error) {
          setLoading(false);
          return;
        }

        const buckets: Record<string, number> = {};
        for (let i = 0; i < 7; i++) {
          const d = new Date(start);
          d.setDate(start.getDate() + i);
          buckets[d.toISOString().slice(0, 10)] = 0;
        }

        (rows ?? []).forEach((r) => {
          const key = new Date(r.created_at).toISOString().slice(0, 10);
          if (key in buckets) buckets[key] += r.amount;
        });

        const points = Object.entries(buckets).map(([iso, total]) => ({
          day: LABELS[new Date(iso).getDay()],
          pontos: total,
        }));

        setData(points);
        setLoading(false);
      });
  }, [userId]);

  if (loading) {
    return (
      <div className="h-64 flex items-center justify-center text-sm text-gray-500">
        A carregar grafico...
      </div>
    );
  }

  const hasAny = data.some((d) => d.pontos !== 0);

  if (!hasAny) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center">
        <p className="text-sm text-gray-500">
          Ainda sem pontos nos ultimos 7 dias.
        </p>
        <p className="text-xs text-gray-600 mt-1">
          Conclui uma licao para começar a ver o grafico.
        </p>
      </div>
    );
  }

  return (
    <div className="h-64 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#1f3047" />
          <XAxis dataKey="day" stroke="#6b7280" fontSize={12} />
          <YAxis stroke="#6b7280" fontSize={12} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#0b1828",
              border: "1px solid #1f3047",
              borderRadius: 8,
              color: "#fff",
            }}
            labelStyle={{ color: "#9ca3af" }}
          />
          <Bar dataKey="pontos" fill="#2dd4bf" radius={[6, 6, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
