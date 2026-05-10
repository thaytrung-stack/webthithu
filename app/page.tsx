'use client';
import { useState } from 'react';
import { MathJax, MathJaxContext } from 'better-react-mathjax';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export default function Home() {
  const [text, setText] = useState('');
  const [subject, setSubject] = useState('Toán');
  const [grade, setGrade] = useState('9');
  const [difficulty, setDifficulty] = useState('Trung bình');
  const [exam, setExam] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleFile = async (e: any) => {
    const file = e.target.files[0];
    const fd = new FormData(); fd.append('file', file);
    setLoading(true);
    const res = await fetch('/api/extract-text', { method: 'POST', body: fd });
    const data = await res.json();
    if (data.text) setText(data.text);
    setLoading(false);
  };

  const genExam = async () => {
    setLoading(true);
    const res = await fetch('/api/generate-exam', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ subject, grade, difficulty, sourceText: text })
    });
    const data = await res.json();
    if (data.exam) setExam(data.exam);
    setLoading(false);
  };

  const exportPDF = () => {
    const doc = new jsPDF();
    doc.text(`ĐỀ ${subject.toUpperCase()} LỚP ${grade}`, 10, 10);
    let y = 20;
    exam?.mc?.forEach((q: any, i: number) => {
      doc.text(`${i + 1}. ${q.q}`, 10, y); y += 7;
      q.opts.forEach((o: string) => { doc.text(o, 15, y); y += 7; });
      y += 5;
    });
    exam?.essay?.forEach((q: any, i: number) => {
      doc.text(`TL ${i + 1}. ${q.q}`, 10, y); y += 10;
    });
    doc.save('de-thi.pdf');
  };

  return (
    <MathJaxContext>
      <main style={{ maxWidth: 800, margin: '0 auto', padding: 20 }}>
        <h1>📝 Tạo đề thi AI</h1>
        <input type="file" accept=".pdf,image/*" onChange={handleFile} />
        <textarea rows={4} style={{ width: '100%' }} placeholder="Hoặc dán nội dung đề gốc..."
          value={text} onChange={e => setText(e.target.value)} />
        <div style={{ display: 'flex', gap: 10, margin: '10px 0' }}>
          <select value={subject} onChange={e => setSubject(e.target.value)}>
            <option>Toán</option><option>Vật Lý</option><option>Hóa Học</option><option>Sinh Học</option>
          </select>
          <select value={grade} onChange={e => setGrade(e.target.value)}>
            {Array.from({ length: 7 }, (_, i) => <option key={i + 6}>{i + 6}</option>)}
          </select>
          <select value={difficulty} onChange={e => setDifficulty(e.target.value)}>
            <option>Dễ</option><option>Trung bình</option><option>Khó</option>
          </select>
        </div>
        <button onClick={genExam} disabled={!text || loading}
          style={{ background: '#2563eb', color: 'white', padding: '10px 20px', border: 'none', borderRadius: 5 }}>
          {loading ? 'Đang sinh...' : '🚀 Tạo đề'}
        </button>

        {exam && (
          <div style={{ marginTop: 30, border: '1px solid #ccc', padding: 20, borderRadius: 8 }}>
            <h2>📋 Đề thi</h2>
            <h3>I. Trắc nghiệm</h3>
            {exam.mc?.map((q: any, i: number) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <p><MathJax>{`${i + 1}. ${q.q}`}</MathJax></p>
                {q.opts.map((o: string, j: number) => <p key={j} style={{ marginLeft: 20 }}><MathJax>{o}</MathJax></p>)}
                <p style={{ color: 'green' }}>Đáp án: <MathJax>{q.ans}</MathJax></p>
              </div>
            ))}
            <h3>II. Tự luận</h3>
            {exam.essay?.map((q: any, i: number) => (
              <div key={i} style={{ marginBottom: 10 }}>
                <p><MathJax>{`${i + 1}. ${q.q}`}</MathJax></p>
                <p style={{ color: 'green' }}>Đáp án: <MathJax>{q.ans}</MathJax></p>
              </div>
            ))}
            <button onClick={exportPDF} style={{ background: '#dc2626', color: 'white', padding: '10px 20px', border: 'none', borderRadius: 5 }}>
              📄 Xuất PDF
            </button>
          </div>
        )}
      </main>
    </MathJaxContext>
  );
}
