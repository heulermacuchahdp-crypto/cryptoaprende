"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Award, Loader2, AlertCircle, CheckCircle } from "lucide-react";
import { issueCertificateAction } from "@/app/courses/[slug]/certificate/actions";

export default function CertificateButton({
  courseId,
}: {
  courseId: string;
  courseSlug: string;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  function handleClick() {
    setError(null);
    setSuccess(false);

    start(async () => {
      const res = await issueCertificateAction(courseId);
      if (res.error) {
        setError(res.error);
        return;
      }
      setSuccess(true);
      router.refresh();
    });
  }

  if (success) {
    return (
      <div className="rounded-xl border border-teal-400/30 bg-teal-400/10 p-4 flex items-center gap-2 text-teal-300 justify-center">
        <CheckCircle size={18} /> Certificado gerado! A carregar...
      </div>
    );
  }

  return (
    <div>
      <button
        onClick={handleClick}
        disabled={pending}
        className="inline-flex items-center gap-2 rounded-xl bg-teal-400 hover:bg-teal-300 disabled:opacity-50 text-[#07111f] font-bold px-8 py-4 transition"
      >
        {pending ? (
          <>
            <Loader2 size={20} className="animate-spin" /> A gerar...
          </>
        ) : (
          <>
            <Award size={20} /> Gerar o meu certificado
          </>
        )}
      </button>

      {error && (
        <div className="mt-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-300 flex items-start gap-2 max-w-md mx-auto text-left">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
}