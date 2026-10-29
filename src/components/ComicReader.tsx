import React, { useState } from 'react';
import { ComicEpisode, ComicPanel, VocabWord } from '../types/comic';
import { COMIC_EPISODES } from '../data/comicEpisodes';
import { ComicIllustration } from './ComicIllustrations';
import { playArabicSpeech } from '../utils/audio';
import { useAuth } from '../context/AuthContext';
import {
  Volume2,
  Bookmark,
  Check,
  ChevronLeft,
  ChevronRight,
  Sparkles,
  HelpCircle,
  Eye,
  EyeOff,
  Columns,
  Layers,
  Award,
  BookOpen,
} from 'lucide-react';

interface ComicReaderProps {
  onOpenQuiz: (episode: ComicEpisode) => void;
  onAskTutor: (arabicSentence: string, context: string) => void;
}

export const ComicReader: React.FC<ComicReaderProps> = ({ onOpenQuiz, onAskTutor }) => {
  const { saveWord, isWordSaved, userStats } = useAuth();

  const [selectedEpisodeIndex, setSelectedEpisodeIndex] = useState<number>(0);
  const [currentPanelIndex, setCurrentPanelIndex] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'panel' | 'strip'>('panel');
  const [showTransliteration, setShowTransliteration] = useState<boolean>(true);
  const [showIndonesian, setShowIndonesian] = useState<boolean>(true);
  const [slowAudio, setSlowAudio] = useState<boolean>(false);
  const [activeWordPopup, setActiveWordPopup] = useState<{ word: VocabWord; panelId: string } | null>(null);
  const [isPlayingAudio, setIsPlayingAudio] = useState<string | null>(null);

  const episode = COMIC_EPISODES[selectedEpisodeIndex] || COMIC_EPISODES[0];
  const panels = episode.panels;
  const currentPanel = panels[currentPanelIndex] || panels[0];

  const handlePlaySpeech = async (text: string, id: string) => {
    setIsPlayingAudio(id);
    await playArabicSpeech(text, slowAudio);
    setIsPlayingAudio(null);
  };

  const isEpisodeCompleted = (id: string) => {
    return userStats.completedEpisodes.includes(id);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Top Episode Carousel / Selector */}
      <div className="bg-white/95 backdrop-blur-md rounded-2xl border border-amber-200/90 p-4 shadow-sm">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-amber-600" />
            <h2 className="text-sm font-black text-amber-950 uppercase tracking-wider">
              Daftar Episode Yaumiyyatuna (يَوْمِيَّاتُنَا)
            </h2>
          </div>
          <span className="text-xs text-stone-500 font-semibold">
            Episode {selectedEpisodeIndex + 1} dari {COMIC_EPISODES.length}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {COMIC_EPISODES.map((ep, idx) => {
            const isCurrent = idx === selectedEpisodeIndex;
            const completed = isEpisodeCompleted(ep.id);
            return (
              <button
                key={ep.id}
                onClick={() => {
                  setSelectedEpisodeIndex(idx);
                  setCurrentPanelIndex(0);
                  setActiveWordPopup(null);
                }}
                className={`p-2.5 rounded-xl text-left border transition-all cursor-pointer relative ${
                  isCurrent
                    ? 'bg-amber-500 text-white border-amber-600 shadow-md shadow-amber-500/20 scale-[1.02]'
                    : 'bg-stone-50 hover:bg-amber-50/70 border-stone-200 text-stone-700'
                }`}
              >
                {completed && (
                  <span className="absolute top-1.5 right-1.5 bg-emerald-500 text-white rounded-full p-0.5 text-[10px]">
                    <Check className="w-3 h-3" />
                  </span>
                )}
                <div className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${isCurrent ? 'text-amber-100' : 'text-stone-400'}`}>
                  Bab {ep.number}
                </div>
                <div className="font-arabic text-sm font-bold truncate">{ep.titleArabic}</div>
                <div className={`text-[10px] truncate font-medium mt-0.5 ${isCurrent ? 'text-amber-100' : 'text-stone-500'}`}>
                  {ep.titleIndonesian.split(':')[0]}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Reader Control Header */}
      <div className="bg-white/95 rounded-2xl border border-amber-200/90 p-4 sm:p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="bg-amber-100 text-amber-800 text-[11px] font-extrabold px-2.5 py-0.5 rounded-full border border-amber-300">
              Bab {episode.number} • {episode.badge}
            </span>
            <span className="text-xs text-stone-500 font-medium">{episode.timeOfDay}</span>
          </div>
          <h1 className="font-arabic text-2xl sm:text-3xl font-black text-stone-900">
            {episode.titleArabic}
          </h1>
          <p className="text-xs sm:text-sm text-stone-600 font-medium mt-0.5">
            {episode.titleIndonesian}
          </p>
        </div>

        {/* Reader Toggles */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Slow audio toggle */}
          <button
            onClick={() => setSlowAudio(!slowAudio)}
            title="Kecepatan pelafalan audio Arab"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors cursor-pointer ${
              slowAudio
                ? 'bg-amber-100 border-amber-400 text-amber-900'
                : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
            }`}
          >
            <span>{slowAudio ? '🐢 Lambat (0.65x)' : '🐰 Normal (1.0x)'}</span>
          </button>

          {/* Transliteration toggle */}
          <button
            onClick={() => setShowTransliteration(!showTransliteration)}
            title="Tampilkan / sembunyikan cara baca latin"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors cursor-pointer ${
              showTransliteration
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-stone-50 border-stone-200 text-stone-400'
            }`}
          >
            {showTransliteration ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Latin</span>
          </button>

          {/* Translation toggle */}
          <button
            onClick={() => setShowIndonesian(!showIndonesian)}
            title="Tampilkan / sembunyikan terjemahan bahasa Indonesia"
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 border transition-colors cursor-pointer ${
              showIndonesian
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-stone-50 border-stone-200 text-stone-400'
            }`}
          >
            {showIndonesian ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
            <span>Arti</span>
          </button>

          {/* View mode toggle */}
          <div className="flex items-center bg-stone-100 p-0.5 rounded-xl border border-stone-200">
            <button
              onClick={() => setViewMode('panel')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'panel'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Mode Panel per Panel"
            >
              <Columns className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('strip')}
              className={`p-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                viewMode === 'strip'
                  ? 'bg-white text-stone-900 shadow-xs'
                  : 'text-stone-500 hover:text-stone-800'
              }`}
              title="Mode Webtoon / Strip Bergulir"
            >
              <Layers className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Comic Display */}
      {viewMode === 'panel' ? (
        /* SINGLE PANEL MODE */
        <div className="bg-white rounded-3xl border border-amber-200 shadow-md overflow-hidden">
          {/* Panel Header */}
          <div className="p-4 sm:p-5 bg-gradient-to-r from-stone-50 via-amber-50/50 to-stone-50 border-b border-stone-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="text-3xl">{currentPanel.avatar}</span>
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-arabic text-lg font-bold text-stone-900">
                    {currentPanel.speakerArabic}
                  </span>
                  <span className="text-xs font-extrabold text-stone-600">
                    ({currentPanel.speaker})
                  </span>
                  <span className="text-[10px] bg-stone-200/80 text-stone-700 px-2 py-0.5 rounded-full font-semibold">
                    {currentPanel.speakerRole}
                  </span>
                </div>
                <div className="text-[11px] text-stone-500 font-medium">
                  {currentPanel.settingTime} • {currentPanel.settingDesc}
                </div>
              </div>
            </div>

            {/* Sound effect sticker if present */}
            {currentPanel.soundEffect && (
              <div className="bg-amber-400 text-stone-950 font-black text-xs px-3 py-1.5 rounded-xl border border-amber-500 shadow-sm transform rotate-2 animate-pulse">
                {currentPanel.soundEffect}
              </div>
            )}
          </div>

          {/* Panel Illustration */}
          <div className="p-4 sm:p-6 bg-stone-50/50">
            <ComicIllustration svgKey={currentPanel.illustrationSvgKey} className="w-full h-56 sm:h-72 shadow-inner" />
          </div>

          {/* Speech Bubble Card */}
          <div className="p-5 sm:p-8 space-y-4">
            <div className="relative bg-amber-50/80 border-2 border-amber-300 rounded-3xl p-5 sm:p-7 shadow-xs">
              {/* Little speech tail */}
              <div className="absolute -top-3 left-8 w-6 h-6 bg-amber-50 border-t-2 border-l-2 border-amber-300 transform rotate-45"></div>

              {/* Arabic text with clickable interactive words */}
              <div className="text-right mb-4">
                <div className="text-stone-400 text-[10px] uppercase font-bold tracking-wider mb-1 flex items-center justify-end gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" />
                  <span>Klik setiap kata untuk melihat arti & tata bahasa:</span>
                </div>
                <div className="flex flex-wrap flex-row-reverse gap-x-2 gap-y-3 font-arabic text-2xl sm:text-3xl md:text-4xl font-bold leading-relaxed text-stone-900">
                  {currentPanel.words.map((word, wIdx) => {
                    const isSaved = isWordSaved(word.arabic);
                    const isActive = activeWordPopup?.word.arabic === word.arabic;
                    return (
                      <button
                        key={wIdx}
                        onClick={() => setActiveWordPopup({ word, panelId: currentPanel.id })}
                        className={`px-2 py-1 rounded-xl transition-all cursor-pointer relative ${
                          isActive
                            ? 'bg-amber-400 text-stone-950 ring-2 ring-amber-600 shadow-md'
                            : 'hover:bg-amber-200/70 hover:text-amber-950'
                        } ${isSaved ? 'underline decoration-amber-500 decoration-wavy' : ''}`}
                      >
                        {word.arabic}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Active word popover details */}
              {activeWordPopup && activeWordPopup.panelId === currentPanel.id && (
                <div className="my-3 p-3.5 bg-white border border-amber-300 rounded-2xl shadow-md text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-2">
                      <span className="font-arabic text-xl font-bold text-amber-950">
                        {activeWordPopup.word.arabic}
                      </span>
                      <span className="text-xs text-stone-500 font-medium">
                        ({activeWordPopup.word.transliteration})
                      </span>
                      <span
                        className={`text-[10px] font-black px-2 py-0.5 rounded-md ${
                          activeWordPopup.word.pos === 'fiil'
                            ? 'bg-purple-100 text-purple-800'
                            : activeWordPopup.word.pos === 'isim'
                            ? 'bg-sky-100 text-sky-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {activeWordPopup.word.pos === 'fiil'
                          ? 'فِعْلٌ (Kata Kerja)'
                          : activeWordPopup.word.pos === 'isim'
                          ? 'اِسْمٌ (Kata Benda)'
                          : 'حَرْفٌ (Kata Sambung)'}
                      </span>
                    </div>
                    <div className="text-xs font-bold text-stone-800">
                      Artinya: <span className="text-amber-700">{activeWordPopup.word.meaning}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handlePlaySpeech(activeWordPopup.word.arabic, `word_${activeWordPopup.word.arabic}`)}
                      className="p-2 bg-stone-100 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                      title="Dengarkan pelafalan kata"
                    >
                      <Volume2 className="w-3.5 h-3.5" />
                      <span>Dengar</span>
                    </button>

                    <button
                      onClick={() =>
                        saveWord({
                          arabic: activeWordPopup.word.arabic,
                          transliteration: activeWordPopup.word.transliteration,
                          indonesian: activeWordPopup.word.meaning,
                          category: episode.titleArabic,
                          episodeId: episode.id,
                        })
                      }
                      className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer transition-colors ${
                        isWordSaved(activeWordPopup.word.arabic)
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-amber-500 hover:bg-amber-600 text-white'
                      }`}
                    >
                      {isWordSaved(activeWordPopup.word.arabic) ? (
                        <>
                          <Check className="w-3.5 h-3.5" />
                          <span>Tersimpan</span>
                        </>
                      ) : (
                        <>
                          <Bookmark className="w-3.5 h-3.5" />
                          <span>Simpan ke Mufradatku</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

              {/* Transliteration */}
              {showTransliteration && (
                <div className="text-xs sm:text-sm font-semibold text-amber-900/80 italic border-t border-amber-200/60 pt-2.5">
                  Cara baca: {currentPanel.transliteration}
                </div>
              )}

              {/* Indonesian translation */}
              {showIndonesian && (
                <div className="text-xs sm:text-sm text-stone-700 font-medium border-t border-amber-200/60 pt-2">
                  Terjemah: {currentPanel.indonesian}
                </div>
              )}

              {/* Speech actions */}
              <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-amber-200">
                <button
                  onClick={() => handlePlaySpeech(currentPanel.arabic, currentPanel.id)}
                  disabled={isPlayingAudio === currentPanel.id}
                  className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
                >
                  <Volume2 className={`w-4 h-4 ${isPlayingAudio === currentPanel.id ? 'animate-bounce' : ''}`} />
                  <span>
                    {isPlayingAudio === currentPanel.id ? 'Memutar Suara...' : 'Dengarkan Kalimat'}
                  </span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() =>
                      saveWord({
                        arabic: currentPanel.arabic,
                        transliteration: currentPanel.transliteration,
                        indonesian: currentPanel.indonesian,
                        category: episode.titleArabic,
                        episodeId: episode.id,
                      })
                    }
                    className="bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                    <span>Simpan Kalimat</span>
                  </button>

                  <button
                    onClick={() => onAskTutor(currentPanel.arabic, episode.titleIndonesian)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Tanya Ustadz AI</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Navigation Buttons: Previous / Next Panel */}
            <div className="flex items-center justify-between pt-2">
              <button
                onClick={() => {
                  setCurrentPanelIndex((prev) => Math.max(0, prev - 1));
                  setActiveWordPopup(null);
                }}
                disabled={currentPanelIndex === 0}
                className="px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold text-xs flex items-center gap-1.5 hover:bg-stone-50 disabled:opacity-30 disabled:pointer-events-none cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Panel Sebelumnya</span>
              </button>

              <div className="text-xs font-bold text-stone-500">
                Panel {currentPanelIndex + 1} dari {panels.length}
              </div>

              {currentPanelIndex < panels.length - 1 ? (
                <button
                  onClick={() => {
                    setCurrentPanelIndex((prev) => Math.min(panels.length - 1, prev + 1));
                    setActiveWordPopup(null);
                  }}
                  className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm shadow-amber-500/20 cursor-pointer"
                >
                  <span>Panel Berikutnya</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  onClick={() => onOpenQuiz(episode)}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/30 cursor-pointer animate-pulse"
                >
                  <Award className="w-4 h-4" />
                  <span>Selesai & Buka Kuis!</span>
                </button>
              )}
            </div>
          </div>
        </div>
      ) : (
        /* STRIP / WEBTOON MODE (ALL PANELS SCROLLED) */
        <div className="space-y-6">
          {panels.map((panel, pIdx) => (
            <div key={panel.id} className="bg-white rounded-3xl border border-amber-200 shadow-md overflow-hidden">
              <div className="p-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-amber-500 text-white flex items-center justify-center text-xs font-black">
                    {pIdx + 1}
                  </span>
                  <span className="text-xl">{panel.avatar}</span>
                  <span className="font-arabic font-bold text-stone-900">{panel.speakerArabic}</span>
                  <span className="text-xs text-stone-500">({panel.speaker})</span>
                </div>
                {panel.soundEffect && (
                  <span className="bg-amber-400 text-stone-900 text-xs font-bold px-2.5 py-1 rounded-lg">
                    {panel.soundEffect}
                  </span>
                )}
              </div>

              <div className="p-4 bg-stone-50">
                <ComicIllustration svgKey={panel.illustrationSvgKey} className="w-full h-44 sm:h-56" />
              </div>

              <div className="p-5 space-y-3">
                <div className="text-right font-arabic text-2xl sm:text-3xl font-bold text-stone-900 leading-relaxed">
                  {panel.arabic}
                </div>
                {showTransliteration && (
                  <div className="text-xs font-semibold text-amber-900/80 italic">
                    {panel.transliteration}
                  </div>
                )}
                {showIndonesian && (
                  <div className="text-xs text-stone-700 font-medium">
                    {panel.indonesian}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-stone-100">
                  <button
                    onClick={() => handlePlaySpeech(panel.arabic, panel.id)}
                    className="bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1.5 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Dengar</span>
                  </button>

                  <button
                    onClick={() => onAskTutor(panel.arabic, episode.titleIndonesian)}
                    className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-200 hover:bg-emerald-100 flex items-center gap-1 cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Tanya Ustadz AI</span>
                  </button>
                </div>
              </div>
            </div>
          ))}

          {/* Bottom Call to Action for Quiz */}
          <div className="text-center pt-4">
            <button
              onClick={() => onOpenQuiz(episode)}
              className="bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold px-8 py-3.5 rounded-2xl shadow-lg shadow-emerald-600/30 text-sm flex items-center gap-2 mx-auto cursor-pointer"
            >
              <Award className="w-5 h-5" />
              <span>Selesai Membaca! Uji Pemahaman Lewat Kuis (Dapat Bintang ⭐)</span>
            </button>
          </div>
        </div>
      )}

      {/* Featured Vocabulary Section */}
      <div className="bg-amber-50/70 rounded-3xl border border-amber-200 p-5 sm:p-6 shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bookmark className="w-4 h-4 text-amber-700" />
            <h3 className="text-xs font-black uppercase tracking-wider text-amber-950">
              Kosakata Kunci Bab Ini (المُفْرَدَاتُ الرَّئِيْسِيَّةُ)
            </h3>
          </div>
          <span className="text-[11px] text-amber-800 font-medium">
            Simpan kata untuk latihan flashcard
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
          {episode.featuredVocab.map((voc, idx) => {
            const saved = isWordSaved(voc.arabic);
            return (
              <div
                key={idx}
                className="bg-white p-3.5 rounded-2xl border border-amber-200/90 shadow-2xs flex items-center justify-between"
              >
                <div>
                  <div className="font-arabic text-lg font-bold text-amber-950">{voc.arabic}</div>
                  <div className="text-xs text-stone-500 font-medium">{voc.transliteration}</div>
                  <div className="text-xs font-bold text-stone-800 mt-0.5">{voc.meaning}</div>
                </div>

                <div className="flex flex-col gap-1 items-end">
                  <button
                    onClick={() => handlePlaySpeech(voc.arabic, `voc_${voc.arabic}`)}
                    className="p-1.5 rounded-lg bg-stone-100 hover:bg-amber-100 text-amber-800 cursor-pointer"
                    title="Dengarkan pengucapan"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>

                  <button
                    onClick={() =>
                      saveWord({
                        arabic: voc.arabic,
                        transliteration: voc.transliteration,
                        indonesian: voc.meaning,
                        category: episode.titleArabic,
                        episodeId: episode.id,
                      })
                    }
                    className={`p-1.5 rounded-lg text-xs font-bold cursor-pointer transition-colors ${
                      saved
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-500 hover:bg-amber-600 text-white'
                    }`}
                    title={saved ? 'Tersimpan' : 'Simpan ke Mufradat'}
                  >
                    {saved ? <Check className="w-3.5 h-3.5" /> : <Bookmark className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
