import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  ShieldCheck,
  Sparkles,
  PlusCircle,
  Users,
  Database,
  BookOpen,
  Award,
  Loader2,
  CheckCircle,
  FileText,
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { user, userStats } = useAuth();

  // AI Comic Scene Generator state
  const [topicPrompt, setTopicPrompt] = useState('Kegiatan Sholat Berjamaah & Bersedekah di Hari Jumat');
  const [characterPrompt, setCharacterPrompt] = useState('Ahmad, Fatimah, dan Ustadz Salman');
  const [isGeneratingScene, setIsGeneratingScene] = useState(false);
  const [generatedPanels, setGeneratedPanels] = useState<any[]>([]);

  // AI Quiz Generator state
  const [quizEpisode, setQuizEpisode] = useState('Kegiatan di Perpustakaan Madrasah');
  const [difficulty, setDifficulty] = useState('menengah');
  const [isGeneratingQuiz, setIsGeneratingQuiz] = useState(false);
  const [generatedQuestions, setGeneratedQuestions] = useState<any[]>([]);

  const handleGenerateDialogue = async () => {
    setIsGeneratingScene(true);
    try {
      const res = await fetch('/api/gemini/generate-dialogue', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          activityTitle: topicPrompt,
          characters: characterPrompt,
        }),
      });
      const data = await res.json();
      if (data.success && data.panels) {
        setGeneratedPanels(data.panels);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingScene(false);
    }
  };

  const handleGenerateQuiz = async () => {
    setIsGeneratingQuiz(true);
    try {
      const res = await fetch('/api/gemini/generate-quiz', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          episodeTitle: quizEpisode,
          difficulty,
        }),
      });
      const data = await res.json();
      if (data.success && data.questions) {
        setGeneratedQuestions(data.questions);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsGeneratingQuiz(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Admin Header Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-lg relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-3xl shadow-inner">
              🧕
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-stone-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Panel Pengajar
                </span>
                <span className="text-xs text-indigo-200 font-mono">nisrinamaia</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black mt-1">
                Dashboard Admin: {user?.displayName || 'Ustadzah Nisrina Maia'}
              </h1>
              <p className="text-xs text-indigo-200 mt-0.5 font-medium">
                Pusat manajemen konten komik Yaumiyyatuna, pembuatan soal kuis otomatis dengan Gemini AI, dan monitoring santri.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-700 flex items-center justify-center text-2xl">
            📚
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900">6 Bab</div>
            <div className="text-xs text-stone-500 font-medium">Episode Komik Aktif</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center text-2xl">
            ⭐
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900">{userStats.stars} Bintang</div>
            <div className="text-xs text-stone-500 font-medium">Poin Terakumulasi</div>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-indigo-100 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center text-2xl">
            🔥
          </div>
          <div>
            <div className="text-2xl font-black text-stone-900">{userStats.completedEpisodes.length} Bab</div>
            <div className="text-xs text-stone-500 font-medium">Progres Pembelajaran</div>
          </div>
        </div>
      </div>

      {/* Feature 1: AI Comic Scene Generator */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600" />
            <h2 className="text-base font-extrabold text-stone-900">
              Generator Adegan Komik Baru (Gemini AI)
            </h2>
          </div>
          <span className="text-[11px] bg-indigo-50 text-indigo-700 font-bold px-2.5 py-1 rounded-full border border-indigo-200">
            Kreator Dialog Yaumiyyatuna
          </span>
        </div>

        <p className="text-xs text-stone-600">
          Buat alur cerita komik baru lengkap dengan teks bahasa Arab berharakat, cara baca latin, terjemahan, dan deskripsi visual.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Topik Kegiatan Harian</label>
            <input
              type="text"
              value={topicPrompt}
              onChange={(e) => setTopicPrompt(e.target.value)}
              placeholder="Contoh: Belajar di Perpustakaan Madrasah"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Karakter yang Terlibat</label>
            <input
              type="text"
              value={characterPrompt}
              onChange={(e) => setCharacterPrompt(e.target.value)}
              placeholder="Ahmad, Fatimah, Ustadz Salman"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-hidden"
            />
          </div>
        </div>

        <button
          onClick={handleGenerateDialogue}
          disabled={isGeneratingScene}
          className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
        >
          {isGeneratingScene ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Membuat Panel Komik...</span>
            </>
          ) : (
            <>
              <PlusCircle className="w-4 h-4" />
              <span>Generate Naskah Komik dengan AI</span>
            </>
          )}
        </button>

        {/* Generated Panels Preview */}
        {generatedPanels.length > 0 && (
          <div className="mt-5 space-y-3 pt-4 border-t border-stone-100 animate-fadeIn">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Hasil Naskah Panel Komik:
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {generatedPanels.map((panel, idx) => (
                <div key={idx} className="bg-stone-50 border border-stone-200 p-4 rounded-2xl space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-indigo-700">Panel {idx + 1}: {panel.speaker}</span>
                    {panel.soundEffect && (
                      <span className="text-[10px] bg-amber-300 px-2 py-0.5 rounded font-black">{panel.soundEffect}</span>
                    )}
                  </div>
                  <div className="font-arabic text-xl font-bold text-stone-900 text-right leading-relaxed">
                    {panel.arabic}
                  </div>
                  <div className="text-[11px] text-amber-900 italic font-medium">
                    {panel.transliteration}
                  </div>
                  <div className="text-xs text-stone-700 font-semibold">
                    {panel.indonesian}
                  </div>
                  <div className="text-[10px] text-stone-500 bg-white p-2 rounded-lg border border-stone-200">
                    🖼️ Visual: {panel.visualDescription}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Feature 2: AI Quiz Generator */}
      <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-7 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-emerald-600" />
            <h2 className="text-base font-extrabold text-stone-900">
              Generator Soal Kuis Otomatis (Gemini AI)
            </h2>
          </div>
          <span className="text-[11px] bg-emerald-50 text-emerald-700 font-bold px-2.5 py-1 rounded-full border border-emerald-200">
            Bank Soal & Penilaian
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Materi / Bab Kuis</label>
            <input
              type="text"
              value={quizEpisode}
              onChange={(e) => setQuizEpisode(e.target.value)}
              placeholder="Contoh: Mufradat Sholat & Kebersihan"
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-stone-700 mb-1">Tingkat Kesulitan</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 outline-hidden"
            >
              <option value="pemula">Pemula (Kosakata Dasar)</option>
              <option value="menengah">Menengah (Fi'il & Dhomir)</option>
              <option value="mahir">Mahir (Struktur Kalimat & I'rab)</option>
            </select>
          </div>
        </div>

        <button
          onClick={handleGenerateQuiz}
          disabled={isGeneratingQuiz}
          className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 shadow-xs cursor-pointer disabled:opacity-50"
        >
          {isGeneratingQuiz ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Menyusun Butir Soal...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4" />
              <span>Generate 3 Soal Kuis Baru</span>
            </>
          )}
        </button>

        {/* Generated Questions List */}
        {generatedQuestions.length > 0 && (
          <div className="mt-5 space-y-3 pt-4 border-t border-stone-100 animate-fadeIn">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-700">
              Hasil Soal Kuis:
            </h3>
            <div className="space-y-3">
              {generatedQuestions.map((q, idx) => (
                <div key={idx} className="bg-emerald-50/50 border border-emerald-200 p-4 rounded-2xl space-y-2">
                  <div className="font-bold text-xs text-emerald-900">Soal {idx + 1}: {q.question}</div>
                  {q.arabicSnippet && (
                    <div className="font-arabic text-xl font-bold text-stone-900 text-right">
                      {q.arabicSnippet}
                    </div>
                  )}
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    {q.options?.map((opt: string, oIdx: number) => (
                      <div
                        key={oIdx}
                        className={`p-2 rounded-lg border ${
                          oIdx === q.correctAnswerIndex
                            ? 'bg-emerald-100 border-emerald-400 font-bold text-emerald-900'
                            : 'bg-white border-stone-200 text-stone-700'
                        }`}
                      >
                        {String.fromCharCode(65 + oIdx)}. {opt}
                      </div>
                    ))}
                  </div>
                  <div className="text-[11px] text-stone-600 bg-white p-2 rounded-lg border border-stone-200">
                    💡 <strong>Kunci Jawaban & Penjelasan:</strong> {q.explanation}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
