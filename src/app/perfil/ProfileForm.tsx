"use client";

import { useActionState } from "react";
import { Save, AlertCircle, CheckCircle } from "lucide-react";
import { updateProfileAction } from "./actions";

export default function ProfileForm({
  initial,
}: {
  initial: { username: string; full_name: string; bio: string };
}) {
  const [state, formAction, pending] = useActionState(updateProfileAction, {
    error: null,
    success: false,
  });

  return (
    <form action={formAction} className="space-y-5">
      {state.error && (
        <div className="rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-300 flex items-start gap-2">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{state.error}</span>
        </div>
      )}

      {state.success && (
        <div className="rounded-lg bg-teal-500/10 border border-teal-500/30 p-3 text-sm text-teal-300 flex items-start gap-2">
          <CheckCircle size={18} className="shrink-0 mt-0.5" />
          <span>Perfil atualizado com sucesso.</span>
        </div>
      )}

      <div>
        <label className="block text-sm font-medium mb-2">
          Username <span className="text-red-400">*</span>
        </label>
        <input
          name="username"
          type="text"
          required
          minLength={3}
          maxLength={20}
          defaultValue={initial.username}
          className="w-full rounded-lg bg-[#0b1828] border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400"
          placeholder="o-teu-username"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Nome completo</label>
        <input
          name="full_name"
          type="text"
          maxLength={80}
          defaultValue={initial.full_name}
          className="w-full rounded-lg bg-[#0b1828] border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400"
          placeholder="O teu nome"
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Bio</label>
        <textarea
          name="bio"
          rows={4}
          maxLength={200}
          defaultValue={initial.bio}
          className="w-full rounded-lg bg-[#0b1828] border border-white/10 px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-teal-400 resize-none"
          placeholder="Conta um pouco sobre ti (opcional)"
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-xl bg-teal-400 hover:bg-teal-300 disabled:opacity-50 text-[#07111f] font-bold px-5 py-3 transition"
      >
        <Save size={18} />
        {pending ? "A guardar..." : "Guardar alteracoes"}
      </button>
    </form>
  );
}