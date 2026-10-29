import React, { useState } from 'react';
import { Bot, Send, Sparkles, BookOpen, Lightbulb, User, Loader2 } from 'lucide-react';

interface AiTutorViewProps {
  initialArabic?: string;
  initialContext?: string;
}

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const AiTutorView: React.FC<AiTutorViewProps> = ({ initialArabic = '', initialContext = '' }) => {
  const [question, setQuestion] = useState(
    initialArabic ? `Bisa tolong jelaskan makna kata dan tata bahasa (Nahwu/Sharaf) dari kalimat: "${initialArabic}"?` : ''
  );
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `السَّلَامُ عَلَيْكُمْ وَرَحْمَةُ اللَّهِ وَبَرَكَاتُهُ! 🌸
Ahlan wa sahlan! Saya adalah **Ustadz Salman AI**, asisten pembelajaran bahasa Arab untuk komik **Yaumiyyatuna (يَوْمِيَّاتُنَا - Keseharian Kita)**.

Ada kaidah Nahwu, Sharaf, atau kosakata dalam komik yang ingin kamu tanyakan hari ini?`,
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);

  const quickQuestions = [
    'Jelaskan kaidah Fi\'il Mudhari\' pada kata أَسْتَيْقِظُ dan أَتَوَضَّأُ',
    'Apa perbedaan waktu makan: الفُطُوْرُ (sarapan), الغَدَاءُ (siang), dan العَشَاءُ (malam)?',
    'Bagaimana cara membedakan Fi\'il (kata kerja), Isim (kata benda), dan Harf?',
    'Jelaskan mengapa kata "المَدْرَسَةِ" dibaca kasrah dalam "إِلَى المَدْرَسَةِ"',
  ];

  const handleSend = async (questionText: string) => {
    const q = questionText.trim();
    if (!q || isLoading) return;

    const newMessages: Message[] = [...messages, { role: 'user', content: q }];
    setMessages(newMessages);
    setQuestion('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/gemini/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          question: q,
          arabicSentence: initialArabic,
          contextTopic: initialContext || 'Kegiatan Sehari-hari (Yaumiyyatuna)',
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Gagal menerima penjelasan.');
      }

      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: data.answer || 'Maaf, Ustadz belum dapat merumuskan jawaban saat ini.',
        },
      ]);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Terjadi gangguan koneksi.';
      setMessages([
        ...newMessages,
        {
          role: 'assistant',
          content: `Mohon maaf ananda, ${msg}. Pastikan GEMINI_API_KEY telah dikonfigurasi di server.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6 sm:py-8 space-y-5">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-800 via-emerald-700 to-teal-800 rounded-3xl p-6 sm:p-8 text-white shadow-md relative overflow-hidden">
        <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-3xl shadow-inner">
              👳‍♂️
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl sm:text-2xl font-black">Ustadz Salman AI</h1>
                <span className="bg-emerald-500/80 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-300">
                  Gemini API Server-Side
                </span>
              </div>
              <p className="text-xs text-emerald-100 font-medium mt-1">
                Konsultasi tata bahasa Arab (Nahwu & Sharaf), harakat, dan makna kosa kata Yaumiyyatuna.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick suggestions */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs">
        <div className="text-xs font-bold text-stone-700 mb-2 flex items-center gap-1.5">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>Contoh Pertanyaan Populer Santri:</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {quickQuestions.map((q, idx) => (
            <button
              key={idx}
              onClick={() => handleSend(q)}
              disabled={isLoading}
              className="text-xs text-left bg-stone-50 hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 border border-stone-200 hover:border-emerald-300 px-3 py-1.5 rounded-xl transition-colors cursor-pointer disabled:opacity-50"
            >
              "{q}"
            </button>
          ))}
        </div>
      </div>

      {/* Chat Messages Box */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm p-4 sm:p-6 min-h-[380px] max-h-[550px] overflow-y-auto space-y-4">
        {messages.map((msg, idx) => (
          <div
            key={idx}
            className={`flex gap-3 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            {msg.role === 'assistant' && (
              <div className="w-8 h-8 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center text-base shrink-0 border border-emerald-300">
                👳‍♂️
              </div>
            )}

            <div
              className={`p-4 rounded-2xl max-w-xl text-xs sm:text-sm leading-relaxed whitespace-pre-wrap ${
                msg.role === 'user'
                  ? 'bg-amber-500 text-white font-medium rounded-br-xs'
                  : 'bg-stone-50 border border-stone-200 text-stone-800 rounded-bl-xs'
              }`}
            >
              {msg.content}
            </div>

            {msg.role === 'user' && (
              <div className="w-8 h-8 rounded-full bg-amber-100 text-amber-800 flex items-center justify-center text-xs font-bold shrink-0 border border-amber-300">
                <User className="w-4 h-4" />
              </div>
            )}
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-stone-400 text-xs font-semibold py-2">
            <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
            <span>Ustadz Salman sedang merumuskan penjelasan dengan harakat...</span>
          </div>
        )}
      </div>

      {/* Input box */}
      <div className="bg-white rounded-2xl border border-stone-200 p-2 sm:p-3 shadow-md flex items-center gap-2">
        <textarea
          rows={1}
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend(question);
            }
          }}
          placeholder="Tanyakan apa saja tentang kalimat bahasa Arab atau kaidah Nahwu..."
          className="flex-1 resize-none bg-transparent px-3 py-2 text-xs sm:text-sm text-stone-800 placeholder-stone-400 outline-hidden"
        />

        <button
          onClick={() => handleSend(question)}
          disabled={!question.trim() || isLoading}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold p-3 rounded-xl transition-colors cursor-pointer disabled:opacity-40"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
