"use client";

import { useState } from "react";
import { Eye, EyeOff, Check, X } from "lucide-react";

type Props = {
  name: string;
  placeholder?: string;
  showStrength?: boolean;
  required?: boolean;
  minLength?: number;
  autoComplete?: string;
};

function getStrength(pw: string) {
  let score = 0;
  if (pw.length >= 8) score++;
  if (/[a-z]/.test(pw)) score++;
  if (/[A-Z]/.test(pw)) score++;
  if (/[0-9]/.test(pw)) score++;
  if (/[^a-zA-Z0-9]/.test(pw)) score++;
  return score;
}

const LABELS = ["Muito fraca", "Fraca", "Razoavel", "Boa", "Forte", "Excelente"];
const COLORS = [
  "bg-red-500",
  "bg-red-500",
  "bg-yellow-500",
  "bg-yellow-500",
  "bg-teal-500",
  "bg-teal-400",
];

export default function PasswordInput({
  name,
  placeholder,
  showStrength,
  required,
  minLength,
  autoComplete,
}: Props) {
  const [show, setShow] = useState(false);
  const [value, setValue] = useState("");
  const strength = getStrength(value);

  const checks = [
    { ok: value.length >= 8, label: "Pelo menos 8 caracteres" },
    { ok: /[a-z]/.test(value), label: "Uma letra minuscula" },
    { ok: /[A-Z]/.test(value), label: "Uma letra maiuscula" },
    { ok: /[0-9]/.test(value), label: "Um numero" },
    { ok: /[^a-zA-Z0-9]/.test(value), label: "Um simbolo" },
  ];

  return (
    <div>
      <div className="relative">
        <input
          name={name}
          type={show ? "text" : "password"}
          required={required}
          minLength={minLength}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoComplete={autoComplete}
          className="w-full rounded-lg bg-[#0b1828] border border-white/10 pl-4 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400"
          placeholder={placeholder}
        />
        <button
          type="button"
          onClick={() => setShow(!show)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-teal-400"
          aria-label={show ? "Ocultar password" : "Mostrar password"}
        >
          {show ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>

      {showStrength && value.length > 0 && (
        <div className="mt-3">
          <div className="flex gap-1 mb-1">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className={`h-1 flex-1 rounded-full ${
                  i <= strength ? COLORS[strength] : "bg-gray-700"
                }`}
              />
            ))}
          </div>
          <p className="text-xs text-gray-400 mb-2">{LABELS[strength]}</p>

          <ul className="space-y-1 text-xs">
            {checks.map((c, i) => (
              <li
                key={i}
                className={`flex items-center gap-1.5 ${
                  c.ok ? "text-teal-400" : "text-gray-500"
                }`}
              >
                {c.ok ? <Check size={12} /> : <X size={12} />} {c.label}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
