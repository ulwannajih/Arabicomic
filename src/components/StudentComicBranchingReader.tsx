import React, { useState } from 'react';
import { BranchingScene, BranchingChoice, VocabWord } from '../types/comic';
import { ComicIllustration } from './ComicIllustrations';
import { playArabicSpeech, playSuccessChime } from '../utils/audio';
import { useAuth } from '../context/AuthContext';
import confetti from 'canvas-confetti';
import {
  Volume2,
  Bookmark,
  Check,
  Sparkles,
  ArrowRight,
  RotateCcw,
  Eye,
  EyeOff,
  GitBranch,
  Award,
  HelpCircle,
  History,
} from 'lucide-react';

interface StudentReaderProps {
  onAskTutor?: (arabic: string, context: string) => void;
}

export const StudentComicBranchingReader: React.FC<StudentReaderProps> = ({ onAskTutor }) => {
  const { branchingScenes, userStats, recordChoiceMade, saveWord, isWordSaved } = useAuth();

  const [currentSceneId, setCurrentSceneId] = useState<string>('scene-wake-up');
  const [sceneHistory, setSceneHistory] = useState<string[]>(['scene-wake-up']);
  const [selectedChoiceFeedback, setSelectedChoiceFeedback] = useState<BranchingChoice | null>(null);
  const [showTransliteration, setShowTransliteration] = useState(true);
  const [showIndonesian, setShowIndonesian] = useState(true);
  const [slowAudio, setSlowAudio] = useState(false);
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [activeWordPopup, setActiveWordPopup] = useState<VocabWord | null>(null);

  // Find active scene
  const currentScene: BranchingScene =
    branchingScenes.find((s) => s.id === currentSceneId) || branchingScenes[0];

  const handlePlayAudio = async (text: string) => {
    setIsPlayingAudio(true);
    await playArabicSpeech(text, slowAudio);
    setIsPlayingAudio(false);
  };

  const handleChooseActivity = (choice: BranchingChoice) => {
    setSelectedChoiceFeedback(choice);
    playSuccessChime();

    if (choice.isRecommendedAdab) {
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.7 },
      });
    }

    recordChoiceMade(currentScene.id, choice.pointsAwarded || 20);

    // After brief feedback delay, navigate to next visual scene
    setTimeout(() => {
      setSelectedChoiceFeedback(null);
      setCurrentSceneId(choice.nextSceneId);
      setSceneHistory((prev) => [...prev, choice.nextSceneId]);
      setActiveWordPopup(null);
    }, 1400);
  };

  const handleRestartStory = () => {
    setCurrentSceneId('scene-wake-up');
    setSceneHistory(['scene-wake-up']);
    setSelectedChoiceFeedback(null);
    setActiveWordPopup(null);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 sm:py-8 space-y-6 animate-fadeIn">
      {/* Top Banner Status & Mode Badge */}
      <div className="bg-white/95 rounded-2xl border border-amber-200/90 p-4 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <span className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs shadow-xs">
            📖
          </span>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-black uppercase tracking-wider text-amber-900">
                Mode Siswa: Komik Interaktif 2D Bercabang
              </span>
              <span className="text-[10px] bg-emerald-100 text-emerald-800 font-extrabold px-2 py-0.5 rounded-full border border-emerald-300">
                Alur Bebas
              </span>
            </div>
            <div className="text-xs text-stone-500 font-medium">
              Langkah {sceneHistory.length} • {currentScene.chapterTitle}
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => setSlowAudio(!slowAudio)}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              slowAudio
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-stone-50 border-stone-200 text-stone-600'
            }`}
          >
            {slowAudio ? '🐢 Lambat (0.65x)' : '🐰 Normal (1.0x)'}
          </button>

          <button
            onClick={() => setShowTransliteration(!showTransliteration)}
            className={`p-2 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              showTransliteration
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-stone-50 border-stone-200 text-stone-400'
            }`}
            title="Toggle tulisan latin"
          >
            {showTransliteration ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
          </button>

          <button
            onClick={() => setShowIndonesian(!showIndonesian)}
            className={`px-2.5 py-1.5 rounded-xl text-xs font-bold border transition-colors cursor-pointer ${
              showIndonesian
                ? 'bg-amber-100 border-amber-300 text-amber-900'
                : 'bg-stone-50 border-stone-200 text-stone-400'
            }`}
            title="Toggle terjemahan Indonesia"
          >
            <span>Arti</span>
          </button>

          <button
            onClick={handleRestartStory}
            title="Mulai ulang petualangan dari awal"
            className="p-2 rounded-xl text-xs font-bold border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-600 cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Main 2D Comic Panel Card */}
      <div className="bg-white rounded-3xl border-2 border-amber-300/80 shadow-lg overflow-hidden relative">
        {/* Panel Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-amber-50 via-orange-50 to-amber-50 border-b border-amber-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{currentScene.avatar}</span>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-arabic text-lg font-bold text-stone-900">
                  {currentScene.speakerArabic}
                </span>
                <span className="text-xs font-bold text-stone-600">
                  ({currentScene.speaker})
                </span>
                <span className="text-[10px] bg-amber-200/80 text-amber-900 px-2 py-0.5 rounded-full font-bold">
                  {currentScene.speakerRole}
                </span>
              </div>
              <div className="text-[11px] text-stone-500 font-medium">
                {currentScene.settingTime} • {currentScene.chapterTitle}
              </div>
            </div>
          </div>

          {currentScene.soundEffect && (
            <div className="bg-amber-400 text-stone-950 font-black text-xs px-3 py-1.5 rounded-xl border border-amber-500 shadow-xs transform rotate-2 animate-pulse">
              {currentScene.soundEffect}
            </div>
          )}
        </div>

        {/* 2D Visual Scene Illustration */}
        <div className="p-4 sm:p-6 bg-stone-100/60">
          <ComicIllustration
            svgKey={currentScene.illustrationKey}
            className="w-full h-56 sm:h-72 rounded-2xl shadow-inner border border-stone-200"
          />
        </div>

        {/* Arabic Speech Bubble */}
        <div className="p-5 sm:p-8 space-y-4">
          <div className="relative bg-amber-50/90 border-2 border-amber-300 rounded-3xl p-5 sm:p-7 shadow-xs">
            <div className="absolute -top-3 left-8 w-6 h-6 bg-amber-50 border-t-2 border-l-2 border-amber-300 transform rotate-45"></div>

            <div className="text-stone-400 text-[10px] uppercase font-bold tracking-wider mb-2 flex items-center justify-between">
              <span className="flex items-center gap-1 text-amber-800">
                <Sparkles className="w-3 h-3 text-amber-600" />
                <span>Ketuk setiap kata untuk melihat arti kata:</span>
              </span>
              <span className="font-arabic text-xs font-bold text-amber-900">حِوَارُ الكُوْمِيْكِ</span>
            </div>

            {/* Interactive Arabic dialogue with clickable word chips */}
            <div className="flex flex-wrap flex-row-reverse gap-x-2 gap-y-3 font-arabic text-2xl sm:text-3xl md:text-4xl font-bold leading-relaxed text-stone-900 text-right mb-4">
              {currentScene.words?.length > 0
                ? currentScene.words.map((word, wIdx) => {
                    const isSaved = isWordSaved(word.arabic);
                    const isActive = activeWordPopup?.arabic === word.arabic;
                    return (
                      <button
                        key={wIdx}
                        onClick={() => setActiveWordPopup(word)}
                        className={`px-2 py-1 rounded-xl transition-all cursor-pointer relative ${
                          isActive
                            ? 'bg-amber-400 text-stone-950 ring-2 ring-amber-600 shadow-md'
                            : 'hover:bg-amber-200/80 hover:text-amber-950'
                        } ${isSaved ? 'underline decoration-amber-500 decoration-wavy' : ''}`}
                      >
                        {word.arabic}
                      </button>
                    );
                  })
                : currentScene.arabicDialogue}
            </div>

            {/* Word popover card */}
            {activeWordPopup && (
              <div className="my-3 p-3.5 bg-white border border-amber-300 rounded-2xl shadow-md text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fadeIn">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-arabic text-xl font-bold text-amber-950">
                      {activeWordPopup.arabic}
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      ({activeWordPopup.transliteration})
                    </span>
                    <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-md">
                      {activeWordPopup.pos === 'fiil'
                        ? 'فِعْلٌ (Kata Kerja)'
                        : activeWordPopup.pos === 'isim'
                        ? 'اِسْمٌ (Kata Benda)'
                        : 'حَرْفٌ'}
                    </span>
                  </div>
                  <div className="text-xs font-bold text-stone-800 mt-0.5">
                    Artinya: <span className="text-amber-700">{activeWordPopup.meaning}</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePlayAudio(activeWordPopup.arabic)}
                    className="p-2 bg-stone-100 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                    <span>Dengar</span>
                  </button>

                  <button
                    onClick={() =>
                      saveWord({
                        arabic: activeWordPopup.arabic,
                        transliteration: activeWordPopup.transliteration,
                        indonesian: activeWordPopup.meaning,
                        category: currentScene.chapterTitle,
                        episodeId: currentScene.id,
                      })
                    }
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-500 hover:bg-amber-600 text-white flex items-center gap-1 cursor-pointer"
                  >
                    {isWordSaved(activeWordPopup.arabic) ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Tersimpan</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Simpan</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            {/* Transliteration */}
            {showTransliteration && (
              <div className="text-xs sm:text-sm font-semibold text-amber-900/80 italic border-t border-amber-200/60 pt-2.5">
                Cara baca: {currentScene.transliteration}
              </div>
            )}

            {/* Indonesian */}
            {showIndonesian && (
              <div className="text-xs sm:text-sm text-stone-700 font-medium border-t border-amber-200/60 pt-2">
                Terjemah: {currentScene.indonesianDialogue}
              </div>
            )}

            {/* Audio & Actions Bar */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-3 border-t border-amber-200">
              <button
                onClick={() => handlePlayAudio(currentScene.arabicDialogue)}
                disabled={isPlayingAudio}
                className="bg-amber-500 hover:bg-amber-600 text-white font-bold px-4 py-2 rounded-xl text-xs flex items-center gap-2 shadow-xs transition-colors cursor-pointer"
              >
                <Volume2 className={`w-4 h-4 ${isPlayingAudio ? 'animate-bounce' : ''}`} />
                <span>
                  {isPlayingAudio ? 'Mendengarkan...' : 'Dengarkan Pelafalan Kalimat'}
                </span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    saveWord({
                      arabic: currentScene.arabicDialogue,
                      transliteration: currentScene.transliteration,
                      indonesian: currentScene.indonesianDialogue,
                      category: currentScene.chapterTitle,
                      episodeId: currentScene.id,
                    })
                  }
                  className="bg-white hover:bg-amber-50 text-amber-900 border border-amber-300 px-3 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                >
                  <Bookmark className="w-3.5 h-3.5 text-amber-600" />
                  <span>Simpan Kalimat</span>
                </button>

                {onAskTutor && (
                  <button
                    onClick={() => onAskTutor(currentScene.arabicDialogue, currentScene.chapterTitle)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 shadow-xs cursor-pointer"
                  >
                    <HelpCircle className="w-3.5 h-3.5" />
                    <span>Tanya Ustadz AI</span>
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* LATIHAN PILIHAN AKTIVITAS (BERCABANG) */}
          {!currentScene.isEnding && currentScene.choices && currentScene.choices.length > 0 ? (
            <div className="bg-gradient-to-br from-stone-50 via-amber-50/50 to-orange-50 border-2 border-dashed border-amber-400/80 rounded-3xl p-5 sm:p-7 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="w-7 h-7 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-xs">
                    <GitBranch className="w-4 h-4" />
                  </span>
                  <div>
                    <h3 className="text-xs sm:text-sm font-black text-amber-950 uppercase tracking-wider">
                      Latihan Pilihan Aktivitas (Bercabang)
                    </h3>
                    <p className="text-[11px] text-stone-500 font-medium">
                      Pilihanmu akan menentukan adegan visual selanjutnya!
                    </p>
                  </div>
                </div>

                <span className="text-[10px] bg-amber-200 text-amber-900 font-extrabold px-2.5 py-0.5 rounded-full">
                  Poin Adab Santri ⭐
                </span>
              </div>

              {/* Question prompt */}
              {currentScene.questionPrompt && (
                <div className="bg-white p-4 rounded-2xl border border-amber-200 shadow-2xs space-y-1">
                  <div className="font-arabic text-xl sm:text-2xl font-bold text-amber-950 text-right">
                    {currentScene.questionPrompt.arabic}
                  </div>
                  <div className="text-xs sm:text-sm font-semibold text-stone-700">
                    {currentScene.questionPrompt.indonesian}
                  </div>
                </div>
              )}

              {/* Feedback toast overlay when choice selected */}
              {selectedChoiceFeedback && (
                <div className="p-4 bg-emerald-600 text-white rounded-2xl text-center font-bold text-xs sm:text-sm shadow-lg animate-fadeIn flex items-center justify-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-300 animate-spin" />
                  <span>{selectedChoiceFeedback.feedbackIndo || 'Pilihan bagus! Menuju adegan baru...'}</span>
                </div>
              )}

              {/* Branching choices list */}
              <div className="space-y-3">
                {currentScene.choices.map((choice, cIdx) => (
                  <button
                    key={choice.id || cIdx}
                    onClick={() => handleChooseActivity(choice)}
                    disabled={selectedChoiceFeedback !== null}
                    className="w-full bg-white hover:bg-amber-50 border-2 border-stone-200 hover:border-amber-500 p-4 rounded-2xl transition-all shadow-xs hover:shadow-md text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3 group cursor-pointer disabled:opacity-50"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="w-6 h-6 rounded-full bg-amber-100 text-amber-900 text-xs font-black flex items-center justify-center group-hover:bg-amber-500 group-hover:text-white transition-colors">
                          {cIdx + 1}
                        </span>
                        <span className="font-arabic text-lg sm:text-xl font-bold text-stone-900">
                          {choice.arabicText}
                        </span>
                      </div>
                      <div className="text-xs text-stone-600 font-semibold pl-8">
                        {choice.indonesianText}
                      </div>
                      {showTransliteration && choice.transliteration && (
                        <div className="text-[11px] text-amber-900/80 italic pl-8">
                          {choice.transliteration}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <span className="text-[11px] font-bold text-amber-700 bg-amber-100 px-2.5 py-1 rounded-xl">
                        +{choice.pointsAwarded || 20} Poin
                      </span>
                      <div className="w-8 h-8 rounded-xl bg-stone-100 group-hover:bg-amber-500 group-hover:text-white text-stone-400 flex items-center justify-center transition-colors">
                        <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* ENDING OF THE DAY SCENE */
            <div className="bg-gradient-to-r from-indigo-900 to-purple-900 text-white rounded-3xl p-6 sm:p-8 text-center space-y-4 shadow-xl">
              <div className="w-16 h-16 mx-auto rounded-3xl bg-white/10 flex items-center justify-center text-4xl animate-bounce">
                🌙
              </div>
              <h3 className="font-arabic text-2xl font-bold text-amber-200">
                مَاشَاءَ اللَّهُ! اِكْتَمَلَتْ رِحْلَةُ يَوْمِيَّاتِنَا
              </h3>
              <p className="text-xs sm:text-sm text-stone-200 max-w-md mx-auto">
                Alhamdulillah! Kamu telah menyelesaikan alur kegiatan harian santri dengan penuh adab dan berkah.
              </p>
              <div className="flex items-center justify-center gap-4 text-xs font-bold text-amber-300">
                <span>Total Poin: {userStats.totalScore}</span>
                <span>•</span>
                <span>Bintang: {userStats.stars} ⭐</span>
              </div>
              <button
                onClick={handleRestartStory}
                className="bg-amber-500 hover:bg-amber-600 text-stone-950 font-black px-6 py-3 rounded-2xl text-xs inline-flex items-center gap-2 cursor-pointer transition-colors shadow-md"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Coba Jalur Pilihan Lain dari Awal</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
