import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });

const buildPrompt = (subject: string, grade: string, difficulty: string, text: string) => `
Bạn là chuyên gia ra đề môn ${subject} lớp ${grade} theo CV 7991. 
Dựa vào tài liệu sau, tạo đề: 12 câu trắc nghiệm (mỗi câu 4 đáp án, 1 đúng), 2 câu tự luận, có đáp án chi tiết.
Độ khó: ${difficulty}. Trả về duy nhất JSON:
{ "mc": [{"q":"câu hỏi", "opts":["A.","B.","C.","D."], "ans":"A", "exp":"giải thích"}], "essay":[{"q":"câu hỏi","ans":"đáp án + thang điểm"}] }
Tài liệu:
${text.substring(0, 3000)}`;
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
