"use client";

import { useState } from "react";

type GenerateResponse = {
  recipe: string;
  error?: string;
};

export default function Home() {
  const [ingredients, setIngredients] = useState(
    "chicken thighs, garlic, olive oil, lemon, oregano"
  );
  const [dietary, setDietary] = useState("high protein, gluten-free");
  const [servings, setServings] = useState(2);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recipe, setRecipe] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError(null);
    setRecipe(null);

    try {
      const response = await fetch("/api/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ingredients,
          dietary,
          servings,
        }),
      });

      if (!response.ok) {
        const payload = (await response.json()) as GenerateResponse;
        throw new Error(payload.error ?? "Something went wrong.");
      }

      const payload = (await response.json()) as GenerateResponse;
      setRecipe(payload.recipe);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Unexpected error occurred.";
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <div className="mx-auto flex min-h-screen max-w-5xl flex-col gap-8 px-4 py-12 sm:px-8">
        <header className="flex flex-col gap-3">
          <p className="text-xs uppercase tracking-[0.4em] text-slate-400">
            Recipe Studio
          </p>
          <div className="flex flex-wrap items-end justify-between gap-3">
            <h1 className="text-3xl font-semibold sm:text-4xl">
              Generate a tailored recipe in seconds
            </h1>
            <span className="rounded-full bg-slate-800/60 px-3 py-1 text-xs text-emerald-300">
              Powered by OpenAI
            </span>
          </div>
          <p className="max-w-3xl text-sm text-slate-300">
            Describe what you have on hand and any dietary goals. We will draft
            a concise, cookable recipe with ingredients and steps tuned to your
            serving size.
          </p>
        </header>

        <main className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-2xl border border-white/5 bg-slate-900/80 shadow-2xl shadow-black/30">
            <form
              onSubmit={handleSubmit}
              className="flex flex-col gap-4 p-6 sm:p-8"
            >
              <div className="flex flex-col gap-2">
                <label
                  htmlFor="ingredients"
                  className="text-sm font-semibold text-slate-200"
                >
                  Ingredients on hand
                </label>
                <textarea
                  id="ingredients"
                  name="ingredients"
                  required
                  rows={3}
                  value={ingredients}
                  onChange={(event) => setIngredients(event.target.value)}
                  className="min-h-[96px] rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 shadow-inner shadow-black/30 outline-none ring-0 transition focus:border-emerald-400/60 focus:shadow-emerald-400/10"
                  placeholder="List ingredients you want to use..."
                />
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="dietary"
                    className="text-sm font-semibold text-slate-200"
                  >
                    Dietary notes
                  </label>
                  <input
                    id="dietary"
                    name="dietary"
                    type="text"
                    value={dietary}
                    onChange={(event) => setDietary(event.target.value)}
                    className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 shadow-inner shadow-black/30 outline-none ring-0 transition focus:border-emerald-400/60 focus:shadow-emerald-400/10"
                    placeholder="e.g., vegan, low sodium"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label
                    htmlFor="servings"
                    className="text-sm font-semibold text-slate-200"
                  >
                    Servings
                  </label>
                  <input
                    id="servings"
                    name="servings"
                    type="number"
                    min={1}
                    max={10}
                    value={servings}
                    onChange={(event) =>
                      setServings(Number(event.target.value) || 1)
                    }
                    className="rounded-xl border border-white/10 bg-slate-950/60 px-4 py-3 text-sm text-slate-100 shadow-inner shadow-black/30 outline-none ring-0 transition focus:border-emerald-400/60 focus:shadow-emerald-400/10"
                  />
                </div>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <p className="text-xs text-slate-400">
                  Requests are generated live via the API route; nothing is
                  stored.
                </p>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 rounded-full bg-emerald-400 px-5 py-2 text-sm font-semibold text-emerald-950 shadow-lg shadow-emerald-400/30 transition hover:-translate-y-0.5 hover:shadow-xl hover:shadow-emerald-400/40 disabled:translate-y-0 disabled:opacity-60"
                >
                  {loading ? "Generating..." : "Generate recipe"}
                </button>
              </div>

              {error ? (
                <div className="rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-100">
                  {error}
                </div>
              ) : null}
            </form>
          </section>

          <section className="flex flex-col gap-3 rounded-2xl border border-white/5 bg-slate-950/60 p-6 sm:p-8 shadow-2xl shadow-black/30">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-slate-100">
                Recipe draft
              </h2>
              <span className="text-xs text-slate-400">
                Adjust inputs and re-run anytime
              </span>
            </div>
            <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <div className="min-h-[280px] whitespace-pre-line rounded-xl border border-white/5 bg-slate-900/80 px-4 py-3 text-sm text-slate-100 shadow-inner shadow-black/40">
              {recipe
                ? recipe
                : "Your recipe will appear here with ingredients, steps, and serving notes."}
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}
