"use client";

import {
  useState,
  useTransition,
  useEffect,
  useRef,
  useCallback,
} from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  CheckCircle,
  XCircle,
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Clock,
  Lock,
} from "lucide-react";
import { submitQuizAction } from "./actions";

type Question = {
  id: string;
  question: string;
  options: { id: string; text: string }[];
  correct_option_id: string;
};

const SECONDS_PER_QUESTION = 30;

export default function QuizForm({
  lessonId,
  lessonSlug,
  questions,
  attemptsUsed,
  maxAttempts,
}: {
  lessonId: string;
  lessonSlug: string;
  questions: Question[];
  attemptsUsed: number;
  maxAttempts: number;
}) {
  const router = useRouter();
  const [pending, start] = useTransition();
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [current, setCurrent] = useState(0);
  const [timeLeft, setTimeLeft] = useState(SECONDS_PER_QUESTION);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<{
    score: number;
    total: number;
    bonus: number;
    attemptsLeft: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const submittingRef = useRef(false);

  const attemptsLeft = maxAttempts - attemptsUsed;
  const blocked = attemptsLeft <= 0 && !submitted;
  const q = questions[current];
  const selected = q ? answers[q.id] : undefined;
  const isLast = current === questions.length - 1;

  // doSubmit ANTES do effect (useCallback para deps estáveis)
  const doSubmit = useCallback(() => {
    if (pending || submitted || submittingRef.current) return;
    submittingRef.current = true;
    setError(null);
    start(async () => {
      try {
        const res = await submitQuizAction(lessonId, answers);
        if (res.error) {
          setError(res.error);
          return;
        }
        setSubmitted(true);
        setResult({
          score: res.score ?? 0,
          total: res.total ?? 0,
          bonus: res.bonus ?? 0,
          attemptsLeft: res.attemptsLeft ?? 0,
        });
        router.refresh();
      } finally {
        submittingRef.current = false;
      }
    });
  }, [pending, submitted, answers, lessonId, router, start]);

  // Timer effect — usa current + questions.length (não q) nos deps
  useEffect(() => {
    if (submitted || blocked || current >= questions.length) return;

    if (timeLeft <= 0) {
      const t = setTimeout(() => {
        if (isLast) {
          doSubmit();
        } else {
          setCurrent((c) => c + 1);
          setTimeLeft(SECONDS_PER_QUESTION);
        }
      }, 0);
      return () => clearTimeout(t);
    }

    const t = setTimeout(() => setTimeLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [
    timeLeft,
    submitted,
    blocked,
    isLast,
    current,
    questions.length,
    doSubmit,
  ]);

  function handleSelect(oid: string) {
    if (submitted || !q) return;
    setAnswers((prev) => ({ ...prev, [q.id]: oid }));
  }

  function handleNext() {
    if (isLast) {
      doSubmit();
    } else {
      setCurrent((c) => c + 1);
      setTimeLeft(SECONDS_PER_QUESTION);
    }
  }

  function handleReset() {
    setAnswers({});
    setCurrent(0);
    setTimeLeft(SECONDS_PER_QUESTION);
    setSubmitted(false);
    setResult(null);
    setError(null);
  }

  if (blocked) {
    return (
      <div className="rounded-2xl border border-yellow-500/30 bg-yellow-500/10 p-6 text-center">
        <Lock className="text-yellow-400 mx-auto mb-3" size={32} />
        <h3 className="text-lg font-bold mb-2">
          Limite de tentativas atingido
        </h3>
        <p className="text-sm text-yellow-300 mb-4">
          Usaste as {maxAttempts} tentativas disponiveis para este quiz.
        </p>
        <Link
          href={`/lessons/${lessonSlug}`}
          className="inline-flex items-center gap-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-[#07111f] font-bold px-5 py-2 transition"
        >
          Voltar a licao
        </Link>
      </div>
    );
  }

  if (!q) return <p className="text-gray-400">Sem perguntas.</p>;

  const timePct = (timeLeft / SECONDS_PER_QUESTION) * 100;
  const timeColor =
    timePct > 50 ? "bg-teal-400" : timePct > 20 ? "bg-yellow-500" : "bg-red-500";

  return (
    <div>
      <div className="mb-6 rounded-xl border border-white/10 bg-[#101e30] p-4">
        <div className="flex items-center justify-between mb-3 text-sm">
          <span className="text-gray-400">
            {submitted
              ? "Quiz concluido"
              : `Pergunta ${current + 1} de ${questions.length}`}
          </span>
          {!submitted && (
            <span
              className={`inline-flex items-center gap-1 font-bold ${
                timeLeft <= 10 ? "text-red-400 animate-pulse" : "text-teal-400"
              }`}
            >
              <Clock size={14} /> {timeLeft}s
            </span>
          )}
        </div>
        {!submitted && (
          <div className="h-2 rounded-full bg-gray-700 overflow-hidden mb-2">
            <div
              className={`h-full transition-all ${timeColor}`}
              style={{ width: `${timePct}%` }}
            />
          </div>
        )}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>
            Tentativas: {attemptsUsed} de {maxAttempts}
          </span>
          <span>
            {attemptsLeft} restante{attemptsLeft !== 1 ? "s" : ""}
          </span>
        </div>
      </div>

      {!submitted && (
        <div className="rounded-2xl border border-white/10 bg-[#101e30] p-6 mb-6">
          <h3 className="text-lg font-semibold mb-4">{q.question}</h3>
          <div className="space-y-2">
            {q.options.map((o) => {
              const isSelected = selected === o.id;
              return (
                <button
                  key={o.id}
                  type="button"
                  onClick={() => handleSelect(o.id)}
                  className={`w-full text-left rounded-lg border p-4 transition flex items-center gap-3 ${
                    isSelected
                      ? "border-teal-400 bg-teal-400/10"
                      : "border-white/10 hover:border-white/30"
                  }`}
                >
                  <span
                    className={`h-6 w-6 rounded-full border flex items-center justify-center text-xs font-bold shrink-0 ${
                      isSelected
                        ? "border-teal-400 bg-teal-400 text-[#07111f]"
                        : "border-gray-600 text-gray-400"
                    }`}
                  >
                    {o.id.toUpperCase()}
                  </span>
                  <span className="flex-1">{o.text}</span>
                </button>
              );
            })}
          </div>

          <div className="flex justify-end mt-6">
            <button
              type="button"
              onClick={handleNext}
              disabled={pending}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-[#07111f] font-bold px-6 py-3 disabled:opacity-50 transition"
            >
              {isLast ? "Submeter" : "Proxima"}
              <ArrowRight size={18} />
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-300 flex items-start gap-2">
          <AlertCircle size={18} className="shrink-0 mt-0.5" />
          <span>{error}</span>
        </div>
      )}

      {submitted && result && (
        <>
          <div className="mb-6 rounded-2xl border border-teal-400/30 bg-teal-400/10 p-6 text-center">
            <p className="text-sm text-teal-300 mb-2">Resultado</p>
            <p className="text-4xl font-bold text-teal-400 mb-1">
              {result.score} / {result.total}
            </p>
            <p className="text-sm text-teal-300">
              {result.score === result.total
                ? "Perfeito! Acertaste tudo."
                : result.score >= result.total / 2
                ? "Bom trabalho!"
                : "Continua a praticar."}
            </p>
            {result.bonus > 0 && (
              <p className="mt-3 text-sm font-semibold text-teal-400">
                +{result.bonus} pontos bonus!
              </p>
            )}
          </div>

          <div className="space-y-4 mb-6">
            {questions.map((qq, idx) => {
              const userAnswer = answers[qq.id];
              const isCorrect = userAnswer === qq.correct_option_id;
              return (
                <div
                  key={qq.id}
                  className="rounded-2xl border border-white/10 bg-[#101e30] p-5"
                >
                  <div className="flex items-start gap-2 mb-3">
                    {isCorrect ? (
                      <CheckCircle
                        className="text-teal-400 shrink-0 mt-0.5"
                        size={18}
                      />
                    ) : (
                      <XCircle
                        className="text-red-400 shrink-0 mt-0.5"
                        size={18}
                      />
                    )}
                    <h4 className="font-semibold">
                      {idx + 1}. {qq.question}
                    </h4>
                  </div>
                  <div className="space-y-1.5 ml-6">
                    {qq.options.map((o) => {
                      const isUser = userAnswer === o.id;
                      const isRight = o.id === qq.correct_option_id;
                      return (
                        <div
                          key={o.id}
                          className={`text-sm rounded-lg px-3 py-2 ${
                            isRight
                              ? "bg-teal-400/10 text-teal-300"
                              : isUser
                              ? "bg-red-500/10 text-red-300"
                              : "text-gray-400"
                          }`}
                        >
                          {o.text}
                          {isRight && " - correta"}
                          {isUser && !isRight && " - a tua resposta"}
                        </div>
                      );
                    })}
                    {!userAnswer && (
                      <p className="text-xs text-gray-500 italic">
                        (Sem resposta)
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="flex flex-wrap gap-3">
            <Link
              href={`/lessons/${lessonSlug}`}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-400 hover:bg-teal-300 text-[#07111f] font-bold px-6 py-3 transition"
            >
              Voltar a licao <ArrowRight size={18} />
            </Link>
            {result.attemptsLeft > 0 && (
              <button
                onClick={handleReset}
                className="inline-flex items-center gap-2 rounded-xl border border-white/20 hover:border-teal-400 px-6 py-3 font-semibold transition"
              >
                <RotateCcw size={18} /> Tentar de novo ({result.attemptsLeft}{" "}
                restantes)
              </button>
            )}
          </div>
        </>
      )}
    </div>
  );
}