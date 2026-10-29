import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/Navbar';
import { LoginPage } from './components/LoginPage';
import { StudentComicBranchingReader } from './components/StudentComicBranchingReader';
import { TeacherComicManagement } from './components/TeacherComicManagement';
import { QuizView } from './components/QuizView';
import { QuizModal } from './components/QuizModal';
import { MufradatNotebook } from './components/MufradatNotebook';
import { AiTutorView } from './components/AiTutorView';
import { ComicEpisode } from './types/comic';

const MainApp: React.FC = () => {
  const { user, loading, isTeacher } = useAuth();
  const [currentTab, setCurrentTab] = useState<'comic' | 'quiz' | 'mufradat' | 'tutor' | 'management'>('comic');
  const [activeQuizEpisode, setActiveQuizEpisode] = useState<ComicEpisode | null>(null);
  const [tutorInitialArabic, setTutorInitialArabic] = useState<string>('');
  const [tutorInitialContext, setTutorInitialContext] = useState<string>('');

  // Sync default tab when user logs in as teacher or student
  useEffect(() => {
    if (user) {
      if (isTeacher) {
        setCurrentTab('management');
      } else {
        setCurrentTab('comic');
      }
    }
  }, [user, isTeacher]);

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50/50 flex flex-col items-center justify-center p-4">
        <div className="w-16 h-16 rounded-3xl bg-amber-500 text-white flex items-center justify-center font-arabic text-3xl font-black shadow-lg shadow-amber-500/30 animate-bounce mb-4">
          ي
        </div>
        <div className="font-arabic text-2xl font-bold text-amber-950 mb-1">
          جَارٍ التَّحْمِيْلُ...
        </div>
        <p className="text-xs text-stone-500 font-medium">
          Memuat Komik Pembelajaran Bahasa Arab Yaumiyyatuna...
        </p>
      </div>
    );
  }

  // Halaman Awal (Portal Masuk / Login)
  if (!user) {
    return <LoginPage />;
  }

  const handleAskTutor = (arabicSentence: string, context: string) => {
    setTutorInitialArabic(arabicSentence);
    setTutorInitialContext(context);
    setCurrentTab('tutor');
  };

  return (
    <div className="min-h-screen bg-stone-50/60 flex flex-col">
      {/* Dynamic Header Navbar with Mode Indicators */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Mode Siswa: Komik 2D Interaktif & Latihan Bercabang */}
        {currentTab === 'comic' && (
          <StudentComicBranchingReader onAskTutor={handleAskTutor} />
        )}

        {/* Mode Guru: Pusat Pengelolaan Komik, AI Script Generator, & Kontrol Percabangan */}
        {currentTab === 'management' && isTeacher && (
          <TeacherComicManagement onPreviewAsStudent={() => setCurrentTab('comic')} />
        )}

        {/* Mufradat Notebook */}
        {currentTab === 'mufradat' && (
          <MufradatNotebook />
        )}

        {/* Quiz Bank */}
        {currentTab === 'quiz' && (
          <QuizView onStartQuiz={(ep) => setActiveQuizEpisode(ep)} />
        )}

        {/* Ustadz AI (Gemini) */}
        {currentTab === 'tutor' && (
          <AiTutorView
            initialArabic={tutorInitialArabic}
            initialContext={tutorInitialContext}
          />
        )}
      </main>

      {/* Quiz Modal Overlay */}
      {activeQuizEpisode && (
        <QuizModal
          episode={activeQuizEpisode}
          onClose={() => setActiveQuizEpisode(null)}
        />
      )}

      {/* Footer */}
      <footer className="border-t border-amber-200/60 bg-white/80 py-5 text-center text-xs text-stone-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-arabic font-bold text-stone-800 text-sm">يَوْمِيَّاتُنَا</span>
            <span>• Komik 2D Interaktif & Latihan Bercabang Bahasa Arab</span>
          </div>
          <div className="text-[11px] text-stone-400">
            Mode Guru (nisrinamaia) & Mode Siswa • Firebase Firestore & Gemini AI Server-Side
          </div>
        </div>
      </footer>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
