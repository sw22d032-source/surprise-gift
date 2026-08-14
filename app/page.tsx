"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";


type Step = "welcome" | "verify" | "scanning" | "gift" | "message";

export default function Home() {
  const [step, setStep] = useState<Step>("welcome");
  const [progress, setProgress] = useState(0);
  const [giftOpened, setGiftOpened] = useState(false);
  const [showSecret, setShowSecret] = useState(false);
  const [typedText, setTypedText] = useState("");
  const [showCoupon, setShowCoupon] = useState(false);

  const [selectedChoice, setSelectedChoice] = useState<string | null>(null);
  const [confirmChoice, setConfirmChoice] = useState<string | null>(null);
  const [savingChoice, setSavingChoice] = useState(false);
  const [choiceSaved, setChoiceSaved] = useState(false);
  const [surpriseFinished, setSurpriseFinished] = useState(false);
  const [checkingSurprise, setCheckingSurprise] = useState(true);

  const startVerification = () => {
    setStep("scanning");
    setProgress(0);

    let value = 0;

    const interval = setInterval(() => {
      value += 2;
      setProgress(value);

      if (value >= 100) {
        clearInterval(interval);

        setTimeout(() => {
          setStep("gift");
        }, 1000);
      }
    }, 35);
  };

  const openGift = () => {
    if (giftOpened) return;

    setGiftOpened(true);

    setTimeout(() => {
      setShowSecret(true);
    }, 2200);
  };


  const startMessage = () => {
    setStep("message");
    setTypedText("");
    setShowCoupon(false);

    const fullText =
      "Онцгой өдөр биш...\nТэмдэглэлт өдөр ч биш...\nЗүгээр л өнөөдөр чамайг жаахан баярлуулмаар санагдлаа. 🤍";

    let index = 0;

    const typing = setInterval(() => {
      index += 1;
      setTypedText(fullText.slice(0, index));

      if (index >= fullText.length) {
        clearInterval(typing);

        setTimeout(() => {
          setShowCoupon(true);
        }, 1200);
      }
    }, 45);
  };


  const saveChoice = async () => {
  if (!confirmChoice || savingChoice) return;

  setSavingChoice(true);

  const { error } = await supabase
    .from("surprise_choices")
    .insert({
      choice: confirmChoice,
    });

  if (error) {
    console.error("Choice save error:", error);
    alert("Сонголт хадгалахад алдаа гарлаа.");
    setSavingChoice(false);
    return;
  }

  setSelectedChoice(confirmChoice);
  setChoiceSaved(true);
  setConfirmChoice(null);
  setSavingChoice(false);
};

useEffect(() => {
  const checkSurprise = async () => {
    const { data, error } = await supabase
      .from("surprise_choices")
      .select("id")
      .limit(1);

    if (error) {
      console.error("Surprise check error:", error);

      // Алдаа гарсан ч сайтыг хаахгүй.
      setCheckingSurprise(false);
      return;
    }

    if (data && data.length > 0) {
      setSurpriseFinished(true);
    }

    setCheckingSurprise(false);
  };

  checkSurprise();
}, []);


if (checkingSurprise) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-rose-50 via-pink-50 to-white">
      <div className="text-center">
        <div className="animate-pulse text-5xl">💌</div>

        <p className="mt-5 text-sm text-zinc-400">
          Түр хүлээнэ үү...
        </p>
      </div>
    </main>
  );
}


if (surpriseFinished) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-gradient-to-b from-rose-50 via-pink-50 to-white px-6">
      <section className="w-full max-w-md text-center">
        <div className="text-7xl">💌</div>

        <p className="mt-8 text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
          Delivery complete
        </p>

        <h1 className="mt-4 text-4xl font-bold text-zinc-900">
          Surprise дууслаа
        </h1>

        <p className="mt-5 text-lg leading-8 text-zinc-500">
          Бэлэг эзэндээ
          <br />
          амжилттай хүрлээ 🤍
        </p>

        <div className="mx-auto mt-10 w-fit rounded-full border border-rose-200 bg-white px-5 py-3 text-sm text-zinc-500 shadow-sm">
          ✓ Delivered
        </div>

        <p className="mt-12 text-xs text-zinc-400">
          Made just for you 🤍
        </p>
      </section>
    </main>
  );
}
  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-b from-rose-50 via-pink-50 to-white px-6 py-10">
      {/* Background decorations */}
      <div className="pointer-events-none absolute left-[10%] top-[15%] text-xl opacity-20">
        ♡
      </div>

      <div className="pointer-events-none absolute right-[12%] top-[25%] text-2xl opacity-20">
        ♡
      </div>

      <div className="pointer-events-none absolute bottom-[20%] left-[15%] text-lg opacity-20">
        ✦
      </div>

      <div className="mx-auto flex min-h-[90vh] max-w-md items-center justify-center">
        {/* STEP 1 */}
        {step === "welcome" && (
          <section className="w-full text-center">
            <div className="mb-8 animate-bounce text-7xl">💌</div>

            <p className="mb-3 text-sm font-medium uppercase tracking-[0.25em] text-rose-400">
              Secret delivery
            </p>

            <h1 className="text-4xl font-bold leading-tight text-zinc-900">
              Танд нууц илгээмж ирлээ.
            </h1>

            <p className="mx-auto mt-5 max-w-sm text-base leading-7 text-zinc-500">
              Хэнээс ирсэн нь одоогоор нууц...
              <br />
              Нээж үзэх үү? 👀
            </p>

            <button
              onClick={() => setStep("verify")}
              className="mt-10 w-full rounded-2xl bg-zinc-900 px-6 py-4 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-rose-500 active:scale-95"
            >
              Илгээмжийг нээх 💌
            </button>

            <p className="mt-5 text-xs text-zinc-400">
              Зөвхөн зориулсан хүн нь нээж болно 🤍
            </p>
          </section>
        )}

        {/* STEP 2 */}
        {step === "verify" && (
          <section className="w-full rounded-3xl bg-white p-7 text-center shadow-xl shadow-rose-100">
            <div className="mb-5 text-5xl">🔐</div>

            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-rose-400">
              Verification
            </p>

            <h2 className="mt-3 text-3xl font-bold text-zinc-900">
              Эзнийг баталгаажуулъя
            </h2>

            <p className="mt-4 leading-7 text-zinc-500">
              Энэ илгээмж зөв хүндээ очсон эсэхийг шалгах хэрэгтэй байна.
            </p>

            <div className="mt-8 rounded-2xl bg-rose-50 p-5">
              <p className="text-lg font-semibold text-zinc-800">
                Өнөөдөр хөөрхөн байгаа юу? 😌
              </p>

              <div className="mt-5 grid grid-cols-2 gap-3">
                <button
                  onClick={startVerification}
                  className="rounded-xl bg-white px-4 py-3 font-medium text-zinc-800 shadow-sm transition hover:-translate-y-1 hover:shadow-md active:scale-95"
                >
                  Тийм 😌
                </button>

                <button
                  onClick={startVerification}
                  className="rounded-xl bg-rose-500 px-4 py-3 font-medium text-white shadow-sm transition hover:-translate-y-1 hover:bg-rose-600 active:scale-95"
                >
                  Мэдээж 😎
                </button>
              </div>
            </div>
          </section>
        )}

        {/* STEP 3 */}
        {step === "scanning" && (
          <section className="w-full text-center">
            {progress < 100 ? (
              <>
                <div className="mx-auto mb-8 flex h-20 w-20 items-center justify-center rounded-full bg-white text-4xl shadow-lg shadow-rose-100">
                  🔎
                </div>

                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
                  Verification in progress
                </p>

                <h2 className="mt-4 text-3xl font-bold text-zinc-900">
                  Шалгаж байна...
                </h2>

                <p className="mt-3 text-sm text-zinc-500">
                  Түр хүлээнэ үү 👀
                </p>

                <div className="mt-10 overflow-hidden rounded-full bg-rose-100">
                  <div
                    className="h-3 rounded-full bg-rose-500 transition-all duration-100"
                    style={{ width: `${progress}%` }}
                  />
                </div>

                <p className="mt-3 font-mono text-sm font-semibold text-rose-500">
                  {progress}%
                </p>
              </>
            ) : (
              <>
                <div className="mb-6 text-6xl">✓</div>

                <p className="text-xs font-semibold uppercase tracking-[0.3em] text-green-600">
                  Identity verified
                </p>

                <h2 className="mt-4 text-3xl font-bold text-zinc-900">
                  Зөв хүн мөн байна 🤍
                </h2>

                <div className="mt-7 rounded-2xl border border-rose-100 bg-white p-5 shadow-lg shadow-rose-100/50">
                  <p className="text-xs uppercase tracking-widest text-zinc-400">
                    Recipient
                  </p>

                  <p className="mt-2 text-xl font-bold text-zinc-900">
                    Миний хамгийн онцгой хүн
                  </p>
                </div>

                <p className="mt-6 animate-pulse text-sm text-zinc-400">
                  Нууц илгээмжийг нээж байна...
                </p>
              </>
            )}
          </section>
        )}
        {/* STEP 4 */}
{step === "gift" && (
  <section className="w-full text-center">
    {!giftOpened ? (
      <>
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
          Package unlocked
        </p>

        <h2 className="mt-4 text-3xl font-bold text-zinc-900">
          Танд нэг бэлэг байна
        </h2>

        <p className="mt-3 text-zinc-500">
          Хайрцгийг дарж нээгээрэй 👀
        </p>

        <button
          onClick={openGift}
          className="group mt-12 text-8xl transition duration-300 hover:scale-110 active:scale-90"
          aria-label="Бэлгийн хайрцгийг нээх"
        >
          <span className="inline-block animate-bounce transition group-hover:-rotate-6">
            🎁
          </span>
        </button>

        <p className="mt-8 animate-pulse text-sm text-zinc-400">
          ↑ Энд дараарай
        </p>
      </>
    ) : !showSecret ? (
      <>
        {/* Hearts */}
        <div className="relative mx-auto h-48 w-full">
          <span className="absolute left-[20%] top-10 animate-bounce text-3xl">
            🤍
          </span>

          <span className="absolute left-[40%] top-0 animate-bounce text-2xl">
            💗
          </span>

          <span className="absolute right-[25%] top-8 animate-bounce text-4xl">
            🤍
          </span>

          <span className="absolute right-[10%] top-20 animate-bounce text-xl">
            ✨
          </span>

          <div className="absolute inset-0 flex items-center justify-center text-8xl">
            🎁
          </div>
        </div>

        <h2 className="mt-3 text-3xl font-bold text-zinc-900">
          Хмм...
        </h2>

        <p className="mt-3 text-lg text-zinc-500">
          Хайрцаг хоосон юм шиг байна 👀
        </p>

        <p className="mt-5 animate-pulse text-sm text-zinc-400">
          Түр хүлээгээрэй...
        </p>
      </>
    ) : (
      <>
        <div className="mb-7 text-6xl">🤍</div>

        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
          Wait...
        </p>

        <h2 className="mt-4 text-3xl font-bold leading-tight text-zinc-900">
          Аан, оллоо.
        </h2>

        <div className="mt-8 rounded-3xl bg-white p-7 shadow-xl shadow-rose-100">
          <p className="text-lg leading-8 text-zinc-600">
            Бэлэг нь хайрцган дотор
            <br />
            байгаагүй юм байна.
          </p>

          <div className="mx-auto my-6 h-px w-16 bg-rose-200" />

          <p className="text-xl font-semibold leading-8 text-zinc-900">
            Энэ жижигхэн сайт өөрөө
            <br />
            чамд зориулсан бэлэг. 🤍
          </p>
        </div>

       <button
  onClick={startMessage}
  className="mt-8 w-full rounded-2xl bg-zinc-900 px-6 py-4 font-semibold text-white shadow-lg transition duration-300 hover:-translate-y-1 hover:bg-rose-500 active:scale-95"
>
  Цааш үзэх →
</button>
      </>
    )}
  </section>
)}
        {/* STEP 5 */}
{step === "message" && (
  <section className="w-full text-center">
    {!showCoupon ? (
      <>
        <div className="mb-8 text-6xl">💌</div>

        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
          A little message
        </p>

        <div className="mt-8 min-h-[220px] rounded-3xl bg-white p-7 shadow-xl shadow-rose-100">
          <p className="whitespace-pre-line text-xl font-medium leading-9 text-zinc-800">
            {typedText}
            <span className="ml-1 animate-pulse text-rose-400">|</span>
          </p>
        </div>

        <p className="mt-6 animate-pulse text-sm text-zinc-400">
          Уншаад байгаарай...
        </p>
      </>
    ) : !choiceSaved ? (
      <>
        <div className="mb-5 text-6xl">🎟️</div>

        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-rose-400">
          Secret reward
        </p>

        <h2 className="mt-4 text-3xl font-bold text-zinc-900">
          SECRET COUPON UNLOCKED
        </h2>

        <p className="mt-3 text-zinc-500">
          Нэгийг нь л сонгоорой 👀
        </p>

        <div className="mt-8 space-y-4">
          {[
            {
              id: "sweet_pass",
              emoji: "🍰",
              title: "Sweet Pass",
              desc: "Дуртай амттанаа сонго — би авч өгнө.",
            },
            {
              id: "food_pass",
              emoji: "🍜",
              title: "Food Pass",
              desc: "Хаана, юу идэхээ чи 100% шийднэ.",
            },
            {
              id: "mystery_gift",
              emoji: "🎁",
              title: "Mystery Gift",
              desc: "Юу гэдгийг мэдэхгүй. Сонгосны дараа би шийднэ 👀",
            },
            {
              id: "surprise_pass",
              emoji: "✨",
              title: "Surprise Pass",
              desc: "Хаашаа, юу хийхээ мэдэхгүй — бүгд surprise.",
            },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setConfirmChoice(item.id)}
              className="w-full rounded-3xl border border-rose-100 bg-white p-5 text-left shadow-md transition duration-300 hover:-translate-y-1 hover:shadow-xl active:scale-[0.98]"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{item.emoji}</div>

                <div>
                  <h3 className="text-lg font-bold text-zinc-900">
                    {item.title}
                  </h3>

                  <p className="mt-1 text-sm leading-6 text-zinc-500">
                    {item.desc}
                  </p>
                </div>
              </div>
            </button>
          ))}
        </div>

        {/* CONFIRM MODAL */}
        {confirmChoice && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-5">
            <div className="w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl">
              <div className="text-5xl">
                {confirmChoice === "sweet_pass" && "🍰"}
                {confirmChoice === "food_pass" && "🍜"}
                {confirmChoice === "mystery_gift" && "🎁"}
                {confirmChoice === "surprise_pass" && "✨"}
              </div>

              <h3 className="mt-4 text-2xl font-bold text-zinc-900">
                Үүнийг сонгох уу? 👀
              </h3>

              <p className="mt-3 text-sm text-zinc-500">
                Баталсны дараа сонголт хадгалагдана.
              </p>

              <div className="mt-6 grid grid-cols-2 gap-3">
                <button
                  onClick={() => setConfirmChoice(null)}
                  disabled={savingChoice}
                  className="rounded-2xl border border-zinc-200 px-4 py-3 font-semibold text-zinc-700"
                >
                  Буцах
                </button>

                <button
                  onClick={saveChoice}
                  disabled={savingChoice}
                  className="rounded-2xl bg-rose-500 px-4 py-3 font-semibold text-white disabled:opacity-50"
                >
                  {savingChoice ? "Хадгалж байна..." : "Тийм, авъя 🤍"}
                </button>
              </div>
            </div>
          </div>
        )}
      </>
    ) : (
      <>
        <div className="mb-6 text-6xl">✅</div>

        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-green-600">
          Choice locked
        </p>

        <h2 className="mt-4 text-3xl font-bold text-zinc-900">
          Сонголт баталгаажлаа
        </h2>

        <div className="mt-8 rounded-3xl bg-white p-7 shadow-xl shadow-rose-100">
          <div className="text-6xl">
            {selectedChoice === "sweet_pass" && "🍰"}
            {selectedChoice === "food_pass" && "🍜"}
            {selectedChoice === "mystery_gift" && "🎁"}
            {selectedChoice === "surprise_pass" && "✨"}
          </div>

          <h3 className="mt-4 text-xl font-bold text-zinc-900">
            {selectedChoice === "sweet_pass" && "Sweet Pass"}
            {selectedChoice === "food_pass" && "Food Pass"}
            {selectedChoice === "mystery_gift" && "Mystery Gift"}
            {selectedChoice === "surprise_pass" && "Surprise Pass"}
          </h3>

          <p className="mt-4 text-zinc-500">
            Одоо эзэн нь амласнаа биелүүлэх л үлдлээ 😌
          </p>
        </div>

        <p className="mt-8 text-sm text-zinc-400">
          Made just for you 🤍
        </p>
      </>
    )}
  </section>
)}



      </div>
    </main>
  );
}