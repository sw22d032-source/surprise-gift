"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

type Choice = {
  id: number;
  choice: string;
  created_at: string;
};

const gifts: Record<
  string,
  {
    emoji: string;
    title: string;
    description: string;
  }
> = {
  sweet_pass: {
    emoji: "🍰",
    title: "Sweet Pass",
    description: "Дуртай амттанаа сонгожээ 😌",
  },

  food_pass: {
    emoji: "🍜",
    title: "Food Pass",
    description: "Хаана, юу идэхээ өөрөө шийдэхээр боллоо 😎",
  },

  mystery_gift: {
    emoji: "🎁",
    title: "Mystery Gift",
    description: "Одоо ямар бэлэг өгөхөө чи шийдэх хэрэгтэй боллоо 👀",
  },

  surprise_pass: {
    emoji: "✨",
    title: "Surprise Pass",
    description: "Бүх төлөвлөгөө чиний гарт орлоо 😏",
  },
};

export default function SurpriseResult() {
  const [pin, setPin] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<Choice | null>(null);
  const [error, setError] = useState("");

  const OWNER_PIN = "1955";

  const unlock = async () => {
    if (pin !== OWNER_PIN) {
      setError("PIN буруу байна 👀");
      return;
    }

    setError("");
    setLoading(true);

    const { data, error } = await supabase
      .from("surprise_choices")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(error);
      setError("Result авахад алдаа гарлаа.");
      setLoading(false);
      return;
    }

    setResult(data);
    setUnlocked(true);
    setLoading(false);
  };

  const formatDate = (date: string) => {
    return new Intl.DateTimeFormat("mn-MN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    }).format(new Date(date));
  };

  const gift = result ? gifts[result.choice] : null;

  if (!unlocked) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-zinc-950 via-zinc-900 to-black px-6">
        <section className="w-full max-w-sm text-center">
          <div className="text-6xl">🔐</div>

          <p className="mt-7 text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
            Owner access
          </p>

          <h1 className="mt-3 text-3xl font-bold text-white">
            Нууц хэсэг
          </h1>

          <p className="mt-3 text-sm leading-6 text-zinc-400">
            Энэ хэсэг зөвхөн бэлгийн эзэнд зориулагдсан.
          </p>

          <div className="mt-8 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur">
            <label className="text-xs uppercase tracking-[0.2em] text-zinc-500">
              Enter PIN
            </label>

            <input
              type="password"
              inputMode="numeric"
              maxLength={4}
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                setError("");
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  unlock();
                }
              }}
              placeholder="••••"
              className="mt-4 w-full rounded-2xl border border-white/10 bg-black/30 px-5 py-4 text-center text-2xl tracking-[0.5em] text-white outline-none transition focus:border-rose-400"
            />

            {error && (
              <p className="mt-3 text-sm text-rose-400">
                {error}
              </p>
            )}

            <button
              onClick={unlock}
              disabled={loading || pin.length !== 4}
              className="mt-5 w-full rounded-2xl bg-white px-5 py-4 font-bold text-zinc-900 transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-40"
            >
              {loading ? "Уншиж байна..." : "Нэвтрэх →"}
            </button>
          </div>

          <p className="mt-6 text-xs text-zinc-600">
            Secret Gift Control Center
          </p>
        </section>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-rose-50 via-pink-50 to-white px-6 py-16">
      <section className="mx-auto max-w-md text-center">
        <div className="text-6xl">💌</div>

        <p className="mt-6 text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
          Surprise result
        </p>

        <h1 className="mt-3 text-3xl font-bold text-zinc-900">
          Сонголт ирсэн байна!
        </h1>

        {!result || !gift ? (
          <div className="mt-10 rounded-3xl bg-white p-8 shadow-xl shadow-rose-100">
            <div className="text-5xl">👀</div>

            <h2 className="mt-5 text-xl font-bold text-zinc-900">
              Одоохондоо сонголт алга
            </h2>

            <p className="mt-3 text-sm leading-6 text-zinc-500">
              Сонголтоо хийхийг нь хүлээж байна...
            </p>
          </div>
        ) : (
          <div className="mt-10 overflow-hidden rounded-3xl bg-white shadow-xl shadow-rose-100">
            <div className="p-8">
              <p className="text-xs uppercase tracking-[0.3em] text-zinc-400">
                She chose
              </p>

              <div className="mt-6 text-8xl">
                {gift.emoji}
              </div>

              <h2 className="mt-6 text-3xl font-bold text-zinc-900">
                {gift.title}
              </h2>

              <p className="mt-4 leading-7 text-zinc-500">
                {gift.description}
              </p>
            </div>

            <div className="border-t border-dashed border-rose-200 bg-rose-50/70 px-6 py-5">
              <p className="text-xs uppercase tracking-widest text-zinc-400">
                Сонгосон хугацаа
              </p>

              <p className="mt-2 font-semibold text-zinc-700">
                {formatDate(result.created_at)}
              </p>
            </div>
          </div>
        )}

        <button
          onClick={() => window.location.reload()}
          className="mt-8 rounded-xl px-5 py-3 text-sm font-medium text-zinc-500 transition hover:bg-white"
        >
          ↻ Шинэчлэх
        </button>
      </section>
    </main>
  );
}