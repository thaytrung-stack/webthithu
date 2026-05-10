import { NextRequest, NextResponse } from 'next/server';
import { model } from '../../../../lib/gemini';
import { buildPrompt } from '../../../../lib/prompt';

export async function POST(req: NextRequest) {
  const { subject, grade, difficulty, sourceText } = await req.json();
  if (!sourceText) return NextResponse.json({ error: 'Missing text' }, { status: 400 });
  try {
    const result = await model.generateContent(buildPrompt(subject, grade, difficulty, sourceText));
    const text = result.response.text().replace(/```json|```/g, '').trim();
    return NextResponse.json({ exam: JSON.parse(text) });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}
