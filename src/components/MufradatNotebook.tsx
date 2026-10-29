import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { playArabicSpeech } from '../utils/audio';
import { Bookmark, Search, Trash2, Volume2, Sparkles, Layers, RotateCw, ArrowLeft, ArrowRight, Check } from 'lucide-react';

export const MufradatNotebook: React.FC = () => {
  const { savedMufradat, removeWord } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [isFlashcardMode, setIsFlashcardMode] = useState(false);
  const [flashcardIndex, setFlashcardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  // Extract categories
  const categories = ['all', ...Array.from(new Set(savedMufradat.map((m) => m.category || 'Umum')))];

  const filteredWords = savedMufradat.filter((w) => {
    const matchesSearch =
      w.arabic.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.transliteration.toLowerCase().includes(searchTerm.toLowerCase()) ||
      w.indonesian.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory = filterCategory === 'all' || w.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handlePlay = (arabic: string) => {
    playArabicSpeech(arabic, false);
  };

  const handleNextCard = () => {
    setIsFlipped(false);
    setFlashcardIndex((prev) => (prev + 1) % filteredWords.length);
  };

  const handlePrevCard = () => {
    setIsFlipped(false);
    setFlashcardIndex((prev) => (prev - 1 + filteredWords.length) % filteredWords.length);
  };

  const activeFlashcard = filteredWords[flashcardIndex];

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-3xl border border-amber-200 p-6 sm:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-8 h-8 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold text-sm">
              📒
            </span>
            <span className="text-xs font-black uppercase tracking-wider text-amber-900">
              Buku Catatan Digital (مُفْرَدَاتِي)
            </span>
          </div>
          <h1 className="font-arabic text-3xl font-black text-stone-900">
            دَفْتَرُ المُفْرَدَاتِ
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 mt-1 font-medium">
            Kumpulan kosakata Yaumiyyatuna yang telah kamu simpan dari komik, tersinkronisasi di Firestore.
          </p>
        </div>

        {savedMufradat.length > 0 && (
          <button
            onClick={() => {
              setIsFlashcardMode(!isFlashcardMode);
              setIsFlipped(false);
              setFlashcardIndex(0);
            }}
            className={`px-5 py-3 rounded-2xl font-bold text-xs flex items-center gap-2 shadow-sm transition-all cursor-pointer ${
              isFlashcardMode
                ? 'bg-amber-600 text-white shadow-amber-600/30'
                : 'bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>{isFlashcardMode ? 'Tutup Kartu Kilas' : 'Latihan Kartu Kilas (Flashcards)'}</span>
          </button>
        )}
      </div>

      {/* FLASHCARD MODE */}
      {isFlashcardMode && filteredWords.length > 0 ? (
        <div className="bg-gradient-to-b from-amber-50 to-orange-50/50 rounded-3xl border-2 border-amber-300 p-6 sm:p-10 shadow-lg text-center space-y-6 animate-fadeIn">
          <div className="flex items-center justify-between max-w-md mx-auto text-xs text-stone-500 font-bold">
            <span>Kartu {flashcardIndex + 1} dari {filteredWords.length}</span>
            <span className="bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full text-[10px]">
              {activeFlashcard.category}
            </span>
          </div>

          {/* Flip Card Container */}
          <div
            onClick={() => setIsFlipped(!isFlipped)}
            className="max-w-md mx-auto min-h-[220px] bg-white rounded-3xl border-2 border-amber-200 p-8 shadow-md flex flex-col items-center justify-center cursor-pointer hover:border-amber-400 transition-all group"
          >
            {!isFlipped ? (
              <div className="space-y-3">
                <span className="text-[10px] font-bold text-stone-400 uppercase tracking-widest block">
                  Sisi Arab (Klik untuk Balik)
                </span>
                <div className="font-arabic text-4xl sm:text-5xl font-black text-stone-900 group-hover:scale-105 transition-transform">
                  {activeFlashcard.arabic}
                </div>
                <div className="text-xs font-semibold text-amber-800 italic">
                  {activeFlashcard.transliteration}
                </div>
              </div>
            ) : (
              <div className="space-y-3 animate-fadeIn">
                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest block">
                  Arti Bahasa Indonesia
                </span>
                <div className="text-2xl sm:text-3xl font-black text-stone-900">
                  {activeFlashcard.indonesian}
                </div>
                <div className="text-xs text-stone-500 font-arabic text-lg font-bold">
                  {activeFlashcard.arabic}
                </div>
              </div>
            )}
          </div>

          <div className="text-[11px] text-stone-500 flex items-center justify-center gap-1">
            <RotateCw className="w-3.5 h-3.5" />
            <span>Ketuk kartu untuk melihat jawaban</span>
          </div>

          {/* Flashcard Controls */}
          <div className="flex items-center justify-center gap-3 max-w-md mx-auto">
            <button
              onClick={handlePrevCard}
              className="p-3 bg-white hover:bg-stone-50 text-stone-700 rounded-2xl border border-stone-200 shadow-xs cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>

            <button
              onClick={() => handlePlay(activeFlashcard.arabic)}
              className="px-4 py-3 bg-amber-500 hover:bg-amber-600 text-white rounded-2xl font-bold text-xs flex items-center gap-2 shadow-xs cursor-pointer"
            >
              <Volume2 className="w-4 h-4" />
              <span>Dengar Suara</span>
            </button>

            <button
              onClick={handleNextCard}
              className="p-3 bg-white hover:bg-stone-50 text-stone-700 rounded-2xl border border-stone-200 shadow-xs cursor-pointer"
            >
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      ) : null}

      {/* Search & Filter Toolbar */}
      <div className="bg-white rounded-2xl border border-stone-200 p-4 shadow-2xs flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Cari kata Arab, tulisan latin, atau terjemahan..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-200 text-xs sm:text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
          {categories.map((cat, i) => (
            <button
              key={i}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-colors cursor-pointer ${
                filterCategory === cat
                  ? 'bg-amber-500 text-white shadow-2xs'
                  : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
              }`}
            >
              {cat === 'all' ? 'Semua Kategori' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Words Grid */}
      {filteredWords.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredWords.map((word) => (
            <div
              key={word.id}
              className="bg-white rounded-2xl border border-amber-200/90 p-4 shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between space-y-3"
            >
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md">
                    {word.category}
                  </span>
                  <div className="font-arabic text-2xl font-bold text-stone-900 mt-1">
                    {word.arabic}
                  </div>
                  <div className="text-xs text-amber-900/80 font-medium italic mt-0.5">
                    {word.transliteration}
                  </div>
                </div>

                <button
                  onClick={() => removeWord(word.id)}
                  title="Hapus dari catatan"
                  className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <div className="text-xs font-bold text-stone-800">{word.indonesian}</div>
                <button
                  onClick={() => handlePlay(word.arabic)}
                  className="p-1.5 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl cursor-pointer"
                  title="Dengarkan suara"
                >
                  <Volume2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-dashed border-stone-300 p-12 text-center space-y-3">
          <div className="w-14 h-14 mx-auto rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center text-2xl">
            📖
          </div>
          <h3 className="text-base font-bold text-stone-800">Belum Ada Kosakata Tersimpan</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Buka komik episode Yaumiyyatuna, klik kata pada balon percakapan, lalu tekan tombol <strong>"Simpan ke Mufradatku"</strong> untuk mulai menghafal!
          </p>
        </div>
      )}
    </div>
  );
};
