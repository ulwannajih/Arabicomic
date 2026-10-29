import React from 'react';
import { useAuth } from '../context/AuthContext';
import {
  BookOpen,
  Award,
  Bookmark,
  Bot,
  Sliders,
  LogOut,
  Sparkles,
  GitBranch,
  GraduationCap,
  User,
  Eye,
} from 'lucide-react';

interface NavbarProps {
  currentTab: 'comic' | 'quiz' | 'mufradat' | 'tutor' | 'management';
  setCurrentTab: (tab: 'comic' | 'quiz' | 'mufradat' | 'tutor' | 'management') => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentTab, setCurrentTab }) => {
  const { user, isTeacher, userStats, savedMufradat, logout } = useAuth();

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-amber-200/80 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Mode indicator */}
          <div
            onClick={() => setCurrentTab(isTeacher ? 'management' : 'comic')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <div className={`w-10 h-10 rounded-2xl text-white flex items-center justify-center font-arabic text-xl font-bold shadow-md transition-transform group-hover:scale-105 ${
              isTeacher
                ? 'bg-gradient-to-tr from-indigo-700 to-purple-600 shadow-indigo-600/20'
                : 'bg-gradient-to-tr from-amber-500 to-amber-400 shadow-amber-500/20'
            }`}>
              ي
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-arabic text-xl font-bold text-stone-900">يَوْمِيَّاتُنَا</span>
                <span
                  className={`text-[10px] font-black px-2 py-0.5 rounded-full border ${
                    isTeacher
                      ? 'bg-indigo-100 text-indigo-900 border-indigo-300'
                      : 'bg-amber-100 text-amber-900 border-amber-300'
                  }`}
                >
                  {isTeacher ? 'Mode Guru' : 'Mode Siswa'}
                </span>
              </div>
              <p className="text-[11px] text-stone-500 font-medium">Komik 2D Interaktif & Latihan Bercabang</p>
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="hidden md:flex items-center gap-1.5">
            {/* Common or Role-specific Navigation */}
            {isTeacher ? (
              <>
                <button
                  onClick={() => setCurrentTab('management')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    currentTab === 'management'
                      ? 'bg-indigo-600 text-white shadow-sm shadow-indigo-600/30'
                      : 'text-stone-700 hover:bg-indigo-50 hover:text-indigo-900'
                  }`}
                >
                  <Sliders className="w-4 h-4" />
                  <span>Pusat Pengelolaan Komik</span>
                </button>

                <button
                  onClick={() => setCurrentTab('comic')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    currentTab === 'comic'
                      ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                      : 'text-stone-700 hover:bg-amber-50 hover:text-amber-900'
                  }`}
                >
                  <Eye className="w-4 h-4" />
                  <span>Pratinjau Mode Siswa</span>
                </button>
              </>
            ) : (
              <>
                <button
                  onClick={() => setCurrentTab('comic')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    currentTab === 'comic'
                      ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                      : 'text-stone-700 hover:bg-amber-50 hover:text-amber-900'
                  }`}
                >
                  <GitBranch className="w-4 h-4" />
                  <span>Komik Bercabang</span>
                </button>

                <button
                  onClick={() => setCurrentTab('mufradat')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    currentTab === 'mufradat'
                      ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                      : 'text-stone-700 hover:bg-amber-50 hover:text-amber-900'
                  }`}
                >
                  <Bookmark className="w-4 h-4" />
                  <span>Mufradatku ({savedMufradat.length})</span>
                </button>

                <button
                  onClick={() => setCurrentTab('quiz')}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                    currentTab === 'quiz'
                      ? 'bg-amber-500 text-white shadow-sm shadow-amber-500/30'
                      : 'text-stone-700 hover:bg-amber-50 hover:text-amber-900'
                  }`}
                >
                  <Award className="w-4 h-4" />
                  <span>Kuis Bab</span>
                </button>
              </>
            )}

            <button
              onClick={() => setCurrentTab('tutor')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                currentTab === 'tutor'
                  ? 'bg-emerald-600 text-white shadow-sm shadow-emerald-600/30'
                  : 'text-emerald-700 hover:bg-emerald-50'
              }`}
            >
              <Bot className="w-4 h-4" />
              <span>Ustadz AI</span>
            </button>
          </nav>

          {/* User profile & Stats & Logout */}
          <div className="flex items-center gap-2 sm:gap-3">
            {!isTeacher && (
              <div className="flex items-center gap-1.5 bg-amber-100/90 border border-amber-300 text-amber-900 px-2.5 py-1 rounded-xl text-xs font-extrabold shadow-2xs">
                <span className="text-amber-500">⭐</span>
                <span>{userStats.stars}</span>
              </div>
            )}

            {/* User chip */}
            <div className="flex items-center gap-2 pl-2 border-l border-stone-200">
              <div className={`w-8 h-8 rounded-full overflow-hidden border flex items-center justify-center text-xs font-bold ${
                isTeacher ? 'border-indigo-300 bg-indigo-100 text-indigo-900' : 'border-amber-300 bg-amber-100 text-amber-900'
              }`}>
                {user?.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" />
                ) : isTeacher ? (
                  <GraduationCap className="w-4 h-4" />
                ) : (
                  <User className="w-4 h-4" />
                )}
              </div>
              <div className="hidden lg:block text-left">
                <div className="text-xs font-bold text-stone-900 truncate max-w-[120px]">
                  {user?.displayName}
                </div>
                <div className="text-[10px] text-stone-500">
                  {isTeacher ? 'Pengajar / Guru' : 'Santri Pembelajar'}
                </div>
              </div>
            </div>

            {/* Logout button */}
            <button
              onClick={logout}
              title="Keluar / Logout"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 transition-colors cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Keluar</span>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav row */}
      <div className="md:hidden flex items-center justify-around border-t border-amber-100 py-2 bg-stone-50 px-2 text-[10px] font-bold">
        {isTeacher ? (
          <>
            <button
              onClick={() => setCurrentTab('management')}
              className={`flex flex-col items-center gap-0.5 ${currentTab === 'management' ? 'text-indigo-700' : 'text-stone-500'}`}
            >
              <Sliders className="w-4 h-4" />
              <span>Pengelolaan</span>
            </button>
            <button
              onClick={() => setCurrentTab('comic')}
              className={`flex flex-col items-center gap-0.5 ${currentTab === 'comic' ? 'text-amber-700' : 'text-stone-500'}`}
            >
              <Eye className="w-4 h-4" />
              <span>Pratinjau</span>
            </button>
          </>
        ) : (
          <>
            <button
              onClick={() => setCurrentTab('comic')}
              className={`flex flex-col items-center gap-0.5 ${currentTab === 'comic' ? 'text-amber-700' : 'text-stone-500'}`}
            >
              <GitBranch className="w-4 h-4" />
              <span>Komik</span>
            </button>
            <button
              onClick={() => setCurrentTab('mufradat')}
              className={`flex flex-col items-center gap-0.5 ${currentTab === 'mufradat' ? 'text-amber-700' : 'text-stone-500'}`}
            >
              <Bookmark className="w-4 h-4" />
              <span>Mufradat</span>
            </button>
            <button
              onClick={() => setCurrentTab('quiz')}
              className={`flex flex-col items-center gap-0.5 ${currentTab === 'quiz' ? 'text-amber-700' : 'text-stone-500'}`}
            >
              <Award className="w-4 h-4" />
              <span>Kuis</span>
            </button>
          </>
        )}
        <button
          onClick={() => setCurrentTab('tutor')}
          className={`flex flex-col items-center gap-0.5 ${currentTab === 'tutor' ? 'text-emerald-700' : 'text-stone-500'}`}
        >
          <Bot className="w-4 h-4" />
          <span>Ustadz AI</span>
        </button>
      </div>
    </header>
  );
};
