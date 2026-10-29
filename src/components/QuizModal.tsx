import React, { useState } from 'react';
import { ComicEpisode } from '../types/comic';
import { useAuth } from '../context/AuthContext';
import { playSuccessChime } from '../utils/audio';
import confetti from 'canvas-confetti';
import { X, Award, CheckCircle2, AlertCircle, ArrowRight, RotateCcw, Sparkles } from 'lucide-react';

interface QuizModalProps {
  episode: ComicEpisode;
  onClose: () => void;
}

export const QuizModal: React.FC<QuizModalProps> = ({ episode, onClose }) => {
  const { completeEpisode } = useAuth();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);

  const questions = episode.quiz;
  const currentQ = questions[currentQuestionIndex];

  const handleSelectOption = (idx: number) => {
    if (isAnswered) return;
    setSelectedOption(idx);
    setIsAnswered(true);

    if (idx === currentQ.correctAnswerIndex) {
      setCorrectCount((prev) => prev + 1);
      playSuccessChime();
    }
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      setSelectedOption(null);
      setIsAnswered(false);
    } else {
      // Finished quiz!
      const finalCorrect = selectedOption === currentQ.correctAnswerIndex ? correctCount : correctCount;
      const score = Math.round((finalCorrect / questions.length) * 100);
      const starsEarned = score === 100 ? 3 : score >= 60 ? 2 : 1;

      if (score >= 60) {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      }

      completeEpisode(episode.id, starsEarned, score);
      setIsFinished(true);
    }
  };

  const handleRestart = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setIsAnswered(false);
    setCorrectCount(0);
    setIsFinished(false);
  };

  const finalScore = Math.round((correctCount / questions.length) * 100);

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-amber-200 overflow-hidden animate-scaleUp">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 p-4 sm:p-5 text-white flex items-center justify-between">
          <div>
            <span className="text-[10px] bg-white/20 font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">
              Kuis Interaktif Bab {episode.number}
            </span>
            <h3 className="font-arabic text-xl font-bold mt-1">{episode.titleArabic}</h3>
            <p className="text-xs text-amber-100 font-medium">{episode.titleIndonesian}</p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-white/20 text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        {!isFinished ? (
          <div className="p-5 sm:p-7 space-y-5">
            {/* Progress indicator */}
            <div className="flex items-center justify-between text-xs text-stone-500 font-bold">
              <span>
                Pertanyaan {currentQuestionIndex + 1} dari {questions.length}
              </span>
              <div className="flex gap-1.5">
                {questions.map((_, i) => (
                  <div
                    key={i}
                    className={`h-2 rounded-full transition-all ${
                      i === currentQuestionIndex
                        ? 'w-6 bg-amber-500'
                        : i < currentQuestionIndex
                        ? 'w-2 bg-emerald-500'
                        : 'w-2 bg-stone-200'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Arabic snippet if present */}
            {currentQ.arabicSnippet && (
              <div className="bg-amber-50/90 border border-amber-300/80 rounded-2xl p-4 text-center">
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider block mb-1">
                  Kutipan Kalimat:
                </span>
                <span className="font-arabic text-2xl font-bold text-stone-900 leading-relaxed">
                  {currentQ.arabicSnippet}
                </span>
              </div>
            )}

            {/* Question title */}
            <h4 className="text-sm sm:text-base font-bold text-stone-900">
              {currentQ.question}
            </h4>

            {/* Options list */}
            <div className="space-y-2.5">
              {currentQ.options.map((option, idx) => {
                const isSelected = selectedOption === idx;
                const isCorrect = idx === currentQ.correctAnswerIndex;

                let btnStyle = 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200';
                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle = 'bg-emerald-50 border-emerald-500 text-emerald-950 font-bold ring-2 ring-emerald-400';
                  } else if (isSelected && !isCorrect) {
                    btnStyle = 'bg-rose-50 border-rose-400 text-rose-900 line-through';
                  } else {
                    btnStyle = 'opacity-40 bg-stone-50 border-stone-200';
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => handleSelectOption(idx)}
                    disabled={isAnswered}
                    className={`w-full p-3.5 rounded-2xl border text-left text-xs sm:text-sm font-semibold transition-all flex items-center justify-between cursor-pointer ${btnStyle}`}
                  >
                    <span>{option}</span>
                    {isAnswered && isCorrect && (
                      <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Explanation box after answer */}
            {isAnswered && (
              <div
                className={`p-4 rounded-2xl text-xs space-y-1 animate-fadeIn border ${
                  selectedOption === currentQ.correctAnswerIndex
                    ? 'bg-emerald-50/80 border-emerald-300 text-emerald-900'
                    : 'bg-amber-50 border-amber-300 text-amber-900'
                }`}
              >
                <div className="font-black flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>
                    {selectedOption === currentQ.correctAnswerIndex
                      ? 'Mumtaz! Jawaban Benar'
                      : 'Jawaban Belum Tepat'}
                  </span>
                </div>
                <p className="leading-relaxed font-medium">{currentQ.explanation}</p>
              </div>
            )}

            {/* Next button */}
            {isAnswered && (
              <button
                onClick={handleNext}
                className="w-full bg-amber-500 hover:bg-amber-600 text-white font-bold py-3.5 px-4 rounded-2xl shadow-md shadow-amber-500/20 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors"
              >
                <span>
                  {currentQuestionIndex < questions.length - 1 ? 'Lanjut Soal Berikutnya' : 'Lihat Hasil Nilai'}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            )}
          </div>
        ) : (
          /* RESULT SCREEN */
          <div className="p-6 sm:p-8 text-center space-y-5">
            <div className="w-20 h-20 mx-auto rounded-3xl bg-amber-100 border-2 border-amber-300 flex items-center justify-center text-4xl shadow-inner animate-bounce">
              {finalScore === 100 ? '🏆' : finalScore >= 60 ? '⭐' : '💪'}
            </div>

            <div>
              <span className="text-xs font-black uppercase tracking-wider text-amber-800">
                Nilai Akhir Kuis
              </span>
              <div className="text-4xl sm:text-5xl font-black text-stone-900 my-1">
                {finalScore} <span className="text-lg font-bold text-stone-400">/ 100</span>
              </div>
              <p className="text-xs font-semibold text-stone-600">
                {finalScore === 100
                  ? 'Mumtaz! Penguasaan kosakata dan tata bahasa sempurna!'
                  : finalScore >= 60
                  ? 'Jayyid Jiddan! Pemahamanmu sangat baik, terus tingkatkan!'
                  : 'Tetap semangat! Ulangi membaca dialog komik dan coba lagi.'}
              </p>
            </div>

            {/* Stars display */}
            <div className="flex items-center justify-center gap-2 text-3xl">
              <span className={finalScore >= 33 ? 'text-amber-400' : 'text-stone-300'}>★</span>
              <span className={finalScore >= 66 ? 'text-amber-400' : 'text-stone-300'}>★</span>
              <span className={finalScore === 100 ? 'text-amber-400' : 'text-stone-300'}>★</span>
            </div>

            <div className="bg-stone-50 border border-stone-200 rounded-2xl p-3.5 text-xs text-stone-600">
              Data nilai dan bintang telah tersimpan otomatis ke akun Firestore milikmu!
            </div>

            <div className="flex gap-2">
              <button
                onClick={handleRestart}
                className="flex-1 py-3 px-4 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 font-bold text-xs flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ulangi Kuis</span>
              </button>

              <button
                onClick={onClose}
                className="flex-1 py-3 px-4 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs shadow-xs cursor-pointer"
              >
                Selesai
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
