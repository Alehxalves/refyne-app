import { openRouter } from "@/lib/open-router/openrouter";
import { NextRequest, NextResponse } from "next/server";

const MODEL_FALLBACKS = [
  "google/gemma-3-27b-it:free",
  "amazon/nova-2-lite-v1",
  "openai/gpt-oss-20b:free",
];

export async function POST(req: NextRequest) {
  try {
    const { story } = await req.json();

    if (!story || typeof story !== "string") {
      return NextResponse.json(
        { error: "O campo 'story' é obrigatório e deve ser uma string." },
        { status: 400 }
      );
    }

    const prompt = `
Você receberá uma história de usuário escrita de forma livre.

Tarefa:
1. Reescreva a história NO FORMATO exato:
"Como <tipo de usuário>, eu quero <ação> para <benefício>."
2. Use mentalmente os princípios INVEST (Independente, Negociável, Valiosa, Estimável, Pequena, Testável) para deixar a frase mais clara e objetiva.
3. NÃO EXPLIQUE o INVEST, NÃO faça análise, NÃO adicione títulos, seções, listas, markdown ou qualquer outro texto.

Importante:
- Responda APENAS com a história reescrita em UMA ÚNICA LINHA.
- NÃO use negrito, markdown, bullet points, nem texto antes ou depois.
- Não traduza, mantenha o idioma da história original (português, se vier em português).

História original:
"""
${story}
"""
`;

    const completion = await openRouter.chat.send({
      models: MODEL_FALLBACKS,
      messages: [
        {
          role: "system",
          content:
            "Você é um assistente especializado em histórias de usuário. Sempre responda apenas com uma única frase no formato 'Como ..., eu quero ..., para ...', sem qualquer explicação adicional.",
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const content = completion.choices?.[0]?.message?.content ?? "";

    return NextResponse.json({
      refined: content,
    });
  } catch (err) {
    console.error("[refineStory] Erro:", err);
    return NextResponse.json(
      { error: "Erro ao refinar a história." },
      { status: 500 }
    );
  }
}
