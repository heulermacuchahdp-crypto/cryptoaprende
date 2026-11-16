"use client";

import { useRef } from "react";
import { Printer, ArrowLeft, Award } from "lucide-react";
import Link from "next/link";

type Certificate = {
  code: string;
  issued_at: string;
  user_name: string;
  course_title: string;
  course_slug: string;
  total_lessons: number;
  total_points: number;
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleDateString("pt-PT", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function CertificateView({
  certificate,
}: {
  certificate: Certificate;
}) {
  const certRef = useRef<HTMLDivElement>(null);

  function handlePrint() {
    window.print();
  }

  return (
    <>
      {/* BOTÕES — não aparecem na impressão */}
      <div className="print:hidden mb-6 flex flex-wrap justify-center gap-3">
        <Link
          href={`/courses/${certificate.course_slug}`}
          className="inline-flex items-center gap-2 rounded-xl border border-white/20 hover:border-teal-400 px-5 py-3 font-semibold transition"
        >
          <ArrowLeft size={18} /> Voltar ao curso
        </Link>
        <button
          onClick={handlePrint}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-[#07111f] font-bold px-5 py-3 transition"
        >
          <Printer size={18} /> Descarregar PDF
        </button>
      </div>

      {/* CERTIFICADO — este é o conteúdo impresso */}
      <div
        ref={certRef}
        className="certificate-print mx-auto bg-white text-[#07111f] rounded-2xl shadow-2xl overflow-hidden"
        style={{ maxWidth: "900px", aspectRatio: "1.414 / 1" }}
      >
        <div className="relative h-full p-10 sm:p-16 flex flex-col justify-between border-double border-teal-400 border-12">
          {/* Cantos decorativos */}
          <div className="absolute top-4 left-4 w-16 h-16 border-t-4 border-l-4 border-teal-500" />
          <div className="absolute top-4 right-4 w-16 h-16 border-t-4 border-r-4 border-teal-500" />
          <div className="absolute bottom-4 left-4 w-16 h-16 border-b-4 border-l-4 border-teal-500" />
          <div className="absolute bottom-4 right-4 w-16 h-16 border-b-4 border-r-4 border-teal-500" />

          {/* Cabeçalho */}
          <div className="text-center">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-14 h-14 rounded-xl bg-teal-400 flex items-center justify-center text-white text-2xl font-bold">
                B
              </div>
              <span className="text-2xl font-bold">
                Crypto<span className="text-teal-500">Aprende</span>
              </span>
            </div>
            <p className="text-xs uppercase tracking-[0.3em] text-gray-500 font-semibold">
              Certificado de Conclusão
            </p>
          </div>

          {/* Corpo */}
          <div className="text-center px-4">
            <p className="text-sm text-gray-500 mb-3">
              Certificamos que
            </p>
            <h1 className="text-3xl sm:text-4xl font-bold text-[#07111f] mb-4 font-serif">
              {certificate.user_name}
            </h1>
            <p className="text-sm text-gray-500 mb-2">
              concluiu com sucesso o curso
            </p>
            <h2 className="text-xl sm:text-2xl font-bold text-teal-600 mb-4">
              {certificate.course_title}
            </h2>
            <p className="text-xs sm:text-sm text-gray-600 max-w-lg mx-auto leading-relaxed">
              Completou as {certificate.total_lessons} lições do curso,
              acumulando {certificate.total_points} pontos de aprendizagem.
            </p>
          </div>

          {/* Rodapé */}
          <div className="flex justify-between items-end gap-4 flex-wrap">
            <div className="text-left">
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Data de emissão
              </p>
              <p className="text-sm font-semibold">
                {formatDate(certificate.issued_at)}
              </p>
            </div>

            {/* Selo central */}
            <div className="flex flex-col items-center">
              <div className="relative">
                <div className="w-20 h-20 rounded-full bg-teal-400 flex items-center justify-center shadow-lg">
                  <div className="w-16 h-16 rounded-full border-2 border-dashed border-white flex items-center justify-center">
                    <Award className="text-white" size={32} />
                  </div>
                </div>
              </div>
              <p className="text-[10px] text-gray-500 mt-1 uppercase tracking-widest">
                Verificado
              </p>
            </div>

            <div className="text-right">
              <p className="text-xs text-gray-500 uppercase tracking-wider">
                Código de verificação
              </p>
              <p className="text-sm font-mono font-semibold">
                {certificate.code}
              </p>
            </div>
          </div>

          {/* Rodapé final */}
          <div className="text-center text-[10px] text-gray-400 mt-4">
            Verifica este certificado em cryptoaprende.vercel.app/verify/{certificate.code}
          </div>
        </div>
      </div>

      {/* Info extra abaixo do certificado */}
      <div className="print:hidden mt-6 text-center text-sm text-gray-400">
        <p>
          💡 Dica: usa a opção «Guardar como PDF» na janela de impressão para
          partilhares nas redes sociais.
        </p>
      </div>

      {/* CSS de impressão */}
      <style jsx global>{`
        @media print {
          body * {
            visibility: hidden;
          }
          .certificate-print,
          .certificate-print * {
            visibility: visible;
          }
          .certificate-print {
            position: absolute;
            left: 0;
            top: 0;
            width: 100%;
            max-width: 100% !important;
            aspect-ratio: auto !important;
            box-shadow: none !important;
            border-radius: 0 !important;
          }
          @page {
            size: A4 landscape;
            margin: 0;
          }
        }
      `}</style>
    </>
  );
}