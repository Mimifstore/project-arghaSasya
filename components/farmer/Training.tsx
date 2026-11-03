"use client";

import { useState } from "react";
import { Check, Lock, Play, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useTrained } from "@/components/farmer/useTrained";
import { RULES } from "@/data/agri";
import { cn } from "@/lib/utils";

const MODULES = [
  { id: "m1", title: "Dasar sortir cabai merah keriting", min: 6 },
  { id: "m2", title: "Panen pada kematangan yang tepat", min: 5 },
  { id: "m3", title: "Pengemasan dan penyimpanan", min: 7 },
  { id: "m4", title: "Memotret hasil panen untuk penilaian AI", min: 4 },
];

const QUIZ = [
  { q: "Untuk Grade A, cabai merah keriting minimal sudah berwarna merah berapa persen?", o: ["Sekitar 50%", "Sekitar 70%", "Minimal 90%"], a: 2 },
  { q: "Apa yang dilakukan pada cabai yang busuk atau berjamur?", o: ["Dicampur agar volume cukup", "Dipisahkan dari yang baik", "Dijual dalam satu karung yang sama"], a: 1 },
  { q: "Foto untuk penilaian AI sebaiknya diambil di mana?", o: ["Tempat terang, latar polos, tidak buram", "Di dalam gudang yang gelap", "Dari jauh supaya semua terlihat"], a: 0 },
  { q: "Setelah dipetik, cabai sebaiknya disimpan di tempat yang…", o: ["Panas dan tertutup rapat", "Teduh dan berventilasi", "Terkena hujan"], a: 1 },
  { q: "Berapa porsi panen yang disarankan dijual lewat aplikasi di awal?", o: ["Seluruh panen", "10 sampai 20% panen terbaik", "Hanya sisa panen terburuk"], a: 1 },
];

export function Training() {
  const { ready, trained, set } = useTrained();
  const [done, setDone] = useState<string[]>(["m1", "m2"]);
  const [quiz, setQuiz] = useState(false);
  const [ans, setAns] = useState<number[]>(QUIZ.map(() => -1));
  const [score, setScore] = useState<number | null>(null);
  if (!ready) return <div className="h-[600px]" />;

  const doneAll = trained || done.length === MODULES.length;
  const isDone = (id: string) => trained || done.includes(id);
  const submit = () => {
    const s = (ans.filter((a, i) => a === QUIZ[i].a).length / QUIZ.length) * 100;
    setScore(s);
    if (s >= RULES.passScore) set(true);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold">Belajar dulu, lalu jual</h1>
      <p className="mt-1 text-sm text-tanah-600">Video pendek berbahasa Sunda dan Indonesia. Selesaikan semua modul dan kuis untuk membuka pasokan dan pesanan.</p>

      {trained && (
        <section className="mt-4 flex items-center gap-3 rounded-xl bg-daun-50 p-4">
          <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-daun-600 text-white"><ShieldCheck className="h-6 w-6" /></span>
          <div><p className="font-semibold text-daun-900">Lencana Petani Terlatih</p><p className="text-sm text-daun-900/80">Pasokan dan pesanan sudah terbuka.</p></div>
        </section>
      )}

      <ul className="surface mt-4 divide-y divide-line">
        {MODULES.map((m) => (
          <li key={m.id} className="flex items-center gap-3 px-4 py-3.5">
            <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full", isDone(m.id) ? "bg-daun-600 text-white" : "bg-tanah-100 text-tanah-600")}>
              {isDone(m.id) ? <Check className="h-4 w-4" strokeWidth={3} /> : <Play className="h-4 w-4" />}
            </span>
            <div className="min-w-0 flex-1"><p className="text-sm font-semibold">{m.title}</p><p className="text-xs text-tanah-500">{m.min} menit, Bahasa Sunda</p></div>
            {!isDone(m.id) && <Button size="sm" variant="outline" onClick={() => setDone((d) => [...d, m.id])}>Selesai</Button>}
          </li>
        ))}
        <li className="flex items-center gap-3 px-4 py-3.5">
          <span className={cn("grid h-9 w-9 shrink-0 place-items-center rounded-full", trained ? "bg-daun-600 text-white" : "bg-tanah-100 text-tanah-600")}>
            {trained ? <Check className="h-4 w-4" strokeWidth={3} /> : doneAll ? <Play className="h-4 w-4" /> : <Lock className="h-4 w-4" />}
          </span>
          <div className="min-w-0 flex-1"><p className="text-sm font-semibold">Kuis akhir</p><p className="text-xs text-tanah-500">5 soal, nilai minimal {RULES.passScore}</p></div>
          {trained ? <Badge tone="success">Lulus</Badge> : doneAll && !quiz ? <Button size="sm" onClick={() => setQuiz(true)}>Mulai</Button> : !doneAll && <Badge>Terkunci</Badge>}
        </li>
      </ul>

      {quiz && !trained && (
        <form onSubmit={(e) => { e.preventDefault(); submit(); }} className="mt-5 space-y-5">
          {QUIZ.map((q, i) => (
            <fieldset key={q.q}>
              <legend className="text-sm font-semibold">{i + 1}. {q.q}</legend>
              <div className="mt-2 space-y-2">
                {q.o.map((o, j) => (
                  <label key={o} className={cn("flex cursor-pointer items-center gap-3 rounded-lg border px-3 py-2.5 text-sm", ans[i] === j ? "border-daun-500 bg-daun-50" : "border-tanah-200 bg-white")}>
                    <input type="radio" name={`q${i}`} className="accent-[#1B6B4A]" checked={ans[i] === j} onChange={() => setAns((a) => a.map((x, k) => (k === i ? j : x)))} />{o}
                  </label>
                ))}
              </div>
            </fieldset>
          ))}
          <Button type="submit" size="lg" className="w-full" disabled={ans.includes(-1)}>Kirim jawaban</Button>
          {score !== null && score < RULES.passScore && (
            <p role="alert" className="rounded-lg border border-cabai-100 bg-cabai-50 p-3 text-sm text-cabai-700">Nilai Anda {score}. Belum mencapai {RULES.passScore}, silakan ulangi kuis.</p>
          )}
        </form>
      )}
      {trained && score !== null && <p role="status" className="mt-4 rounded-lg bg-daun-50 p-3 text-sm text-daun-900">Nilai kuis Anda {score}. Selamat, Anda lulus.</p>}
    </div>
  );
}
