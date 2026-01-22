import { NextResponse } from "next/server";
import OpenAI from "openai";

type GenerateBody = {
  ingredients?: string;
  dietary?: string;
  servings?: number;
};

export async function POST(request: Request) {
  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json(
      { error: "Missing OPENAI_API_KEY on the server." },
      { status: 500 }
    );
  }

  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  let body: GenerateBody | null = null;
  try {
    body = (await request.json()) as GenerateBody;
  } catch {
    return NextResponse.json(
      { error: "Invalid request payload." },
      { status: 400 }
    );
  }

  const ingredients = body?.ingredients?.trim() ?? "";
  const dietary = body?.dietary?.trim() ?? "";
  const servings = Number(body?.servings) || 1;

  if (!ingredients) {
    return NextResponse.json(
      { error: "Please list at least one ingredient." },
      { status: 400 }
    );
  }

  try {
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      temperature: 0.6,
      messages: [
        {
          role: "system",
          content:
            "You are a concise, production-ready recipe generator. Output only the recipe with ingredients and numbered steps. Keep it brief and executable.",
        },
        {
          role: "user",
          content: [
            `Create a recipe for ${servings} serving(s).`,
            `Available ingredients: ${ingredients}.`,
            dietary ? `Dietary notes: ${dietary}.` : "",
            "Return ingredients, steps, and serving notes in plain text.",
          ]
            .filter(Boolean)
            .join(" "),
        },
      ],
    });

    const recipe = completion.choices[0]?.message?.content?.trim();
    if (!recipe) {
      throw new Error("No recipe was returned.");
    }

    return NextResponse.json({ recipe });
  } catch (error) {
    console.error("Recipe generation failed", error);
    return NextResponse.json(
      { error: "Failed to generate recipe. Please try again." },
      { status: 500 }
    );
  }
}
