import React, { useState } from 'react';
import { COMIC_EPISODES } from '../data/comicEpisodes';
import { ComicEpisode } from '../types/comic';
import { useAuth } from '../context/AuthContext';
import { Award, CheckCircle2, Play, Sparkles } from 'lucide-react';

interface QuizViewProps {
  onStartQuiz: (episode: ComicEpisode) => void;
}

export const QuizView: React.FC<QuizViewProps> = ({ onStartQuiz }) => {
  const { userStats } = useAuth();

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      <div className="bg-white rounded-3xl border border-amber-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-sm font-bold">
              🏆
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-amber-900">
              Evaluasi & Kuis Pemahaman
            </span>
          </div>
          <h1 className="font-arabic text-3xl font-black text-stone-900">
            اِخْتِبَارَاتُ يَوْمِيَّاتِنَا
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
            Uji hafalan kosakata dan kaidah tata bahasa Arab dari setiap bab komik. Dapatkan bintang ⭐ dan sertifikat pencapaian!
          </p>
        </div>

        <div className="flex items-center gap-4 bg-amber-50 border border-amber-200 px-5 py-3 rounded-2xl">
          <div>
            <div className="text-xs text-stone-500 font-bold uppercase">Bintang Terkumpul</div>
            <div className="text-2xl font-black text-amber-600 flex items-center gap-1">
              <span>{userStats.stars}</span>
              <span className="text-lg">⭐</span>
            </div>
          </div>
          <div className="h-8 w-px bg-amber-200"></div>
          <div>
            <div className="text-xs text-stone-500 font-bold uppercase">Bab Tuntas</div>
            <div className="text-2xl font-black text-emerald-600">
              {userStats.completedEpisodes.length} / {COMIC_EPISODES.length}
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {COMIC_EPISODES.map((ep) => {
          const isDone = userStats.completedEpisodes.includes(ep.id);
          return (
            <div
              key={ep.id}
              className={`bg-white rounded-2xl border p-5 shadow-sm transition-all flex flex-col justify-between space-y-4 ${
                isDone ? 'border-emerald-300 ring-1 ring-emerald-200' : 'border-amber-200 hover:border-amber-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-extrabold px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-800">
                    Bab {ep.number}
                  </span>
                  {isDone ? (
                    <span className="flex items-center gap-1 text-[11px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                    </span>
                  ) : (
                    <span className="text-[11px] text-stone-400 font-medium">Belum Diuji</span>
                  )}
                </div>

                <h3 className="font-arabic text-xl font-bold text-stone-900">{ep.titleArabic}</h3>
                <h4 className="text-xs font-bold text-stone-700 mt-0.5">{ep.titleIndonesian}</h4>
                <p className="text-[11px] text-stone-500 line-clamp-2 mt-2">{ep.summary}</p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-xs text-stone-500 font-semibold">
                  {ep.quiz.length} Soal Pilihan
                </span>

                <button
                  onClick={() => onStartQuiz(ep)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer transition-all ${
                    isDone
                      ? 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                      : 'bg-amber-500 hover:bg-amber-600 text-white shadow-xs'
                  }`}
                >
                  <Play className="w-3.5 h-3.5 fill-current" />
                  <span>{isDone ? 'Ulangi Kuis' : 'Mulai Kuis'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
