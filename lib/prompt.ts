export const buildPrompt = (subject:string, grade:string, difficulty:string, text:string) => `
Bạn là chuyên gia ra đề môn ${subject} lớp ${grade} theo CV 7991. 
Dựa vào tài liệu sau, tạo đề: 12 câu trắc nghiệm (mỗi câu 4 đáp án, 1 đúng), 2 câu tự luận, có đáp án chi tiết.
Độ khó: ${difficulty}. Trả về duy nhất JSON:
{ "mc": [{"q":"câu hỏi", "opts":["A.","B.","C.","D."], "ans":"A", "exp":"giải thích"}], "essay":[{"q":"câu hỏi","ans":"đáp án + thang điểm"}] }
Tài liệu:
${text.substring(0, 3000)}`;
