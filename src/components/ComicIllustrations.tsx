import React from 'react';

interface IllustrationProps {
  svgKey: string;
  className?: string;
}

export const ComicIllustration: React.FC<IllustrationProps> = ({ svgKey, className = 'w-full h-48 md:h-64' }) => {
  switch (svgKey) {
    case 'bedroom-alarm':
      return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-indigo-950 via-slate-900 to-indigo-900 flex items-center justify-center ${className}`}>
          {/* Stars & Crescent */}
          <div className="absolute top-3 left-4 text-amber-200 text-lg">🌙</div>
          <div className="absolute top-4 right-8 w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
          <div className="absolute top-8 right-24 w-1 h-1 bg-amber-100 rounded-full"></div>
          <div className="absolute top-12 left-20 w-1 h-1 bg-white rounded-full"></div>
          
          {/* Distant Mosque silhouette */}
          <div className="absolute bottom-16 right-4 opacity-40">
            <svg width="70" height="60" viewBox="0 0 100 80" fill="none">
              <path d="M50 0 C40 20 40 40 50 50 L10 50 L10 80 L90 80 L90 50 L50 50 Z" fill="#fcd34d" />
              <rect x="75" y="10" width="8" height="70" fill="#fcd34d" />
              <circle cx="79" cy="10" r="6" fill="#fcd34d" />
            </svg>
          </div>

          {/* Bedroom scene */}
          <div className="relative z-10 flex flex-col items-center">
            {/* Alarm clock vibration */}
            <div className="flex items-center gap-3 bg-amber-500/20 backdrop-blur-xs border border-amber-400/40 px-4 py-2 rounded-2xl mb-2 animate-bounce">
              <span className="text-2xl">⏰</span>
              <div className="text-left">
                <div className="text-amber-300 font-bold text-xs tracking-wider">ADZAN SUBUH</div>
                <div className="text-white font-black text-sm">04:30 AM</div>
              </div>
            </div>

            {/* Boy waking up */}
            <div className="relative w-28 h-24 bg-indigo-800/80 rounded-t-3xl border-t-2 border-indigo-500 flex flex-col items-center justify-center p-2 shadow-2xl">
              <span className="text-4xl">🥱👦</span>
              <div className="text-amber-200 text-xs font-semibold mt-1">Ahmad Bangun</div>
            </div>
            {/* Blanket */}
            <div className="w-36 h-8 bg-sky-600 rounded-t-xl border-t border-sky-400 shadow-inner"></div>
          </div>
        </div>
      );

    case 'bathroom-wudhu':
      return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-cyan-900 via-sky-800 to-teal-900 flex items-center justify-center ${className}`}>
          {/* Water drops & bubbles */}
          <div className="absolute top-4 left-6 text-cyan-200 text-sm animate-pulse">💧</div>
          <div className="absolute top-10 right-8 text-cyan-200 text-lg">🫧</div>
          <div className="absolute bottom-8 left-12 text-cyan-300 text-xs">💧</div>

          {/* Washbasin & Wudhu mirror */}
          <div className="relative z-10 flex flex-col items-center">
            <div className="w-20 h-24 bg-white/20 backdrop-blur-xs border-2 border-white/40 rounded-t-full flex items-center justify-center mb-2 shadow-lg">
              <span className="text-4xl">🪞👦</span>
            </div>
            {/* Water tap flowing */}
            <div className="flex items-center gap-2 bg-white/90 text-sky-900 px-4 py-2 rounded-2xl shadow-md">
              <span className="text-2xl">🚰</span>
              <span className="text-xs font-bold tracking-wide">Wudhu Suci Mensucikan</span>
            </div>
          </div>
        </div>
      );

    case 'walk-to-mosque':
      return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-indigo-900 via-purple-900 to-amber-950 flex items-center justify-center ${className}`}>
          {/* Glowing Mosque Dome in center */}
          <div className="absolute top-4 flex flex-col items-center opacity-90">
            <div className="text-3xl text-amber-300 drop-shadow-[0_0_15px_rgba(251,191,36,0.8)]">🕌</div>
            <div className="text-[10px] text-amber-200 tracking-widest font-semibold uppercase">Masjid Jami'</div>
          </div>

          {/* Father and Son walking */}
          <div className="relative z-10 mt-12 flex items-center gap-4 bg-black/30 backdrop-blur-xs px-5 py-3 rounded-2xl border border-amber-500/30">
            <div className="flex items-center gap-2">
              <span className="text-3xl">🧔</span>
              <span className="text-white text-xs font-bold">Abi</span>
            </div>
            <span className="text-amber-400 font-bold">🤝</span>
            <div className="flex items-center gap-2">
              <span className="text-3xl">👦</span>
              <span className="text-white text-xs font-bold">Ahmad</span>
            </div>
            <div className="ml-2 text-xs text-amber-200 bg-amber-600/40 px-2 py-1 rounded-md">Sholat Jama'ah</div>
          </div>
        </div>
      );

    case 'tidy-bedroom':
      return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-amber-100 via-orange-50 to-amber-200 flex items-center justify-center ${className}`}>
          {/* Sunshine through window */}
          <div className="absolute top-3 right-6 text-4xl animate-spin text-amber-500" style={{ animationDuration: '25s' }}>☀️</div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex items-center gap-3 bg-white/95 px-4 py-3 rounded-2xl shadow-md border border-amber-200">
              <span className="text-3xl">🛏️</span>
              <div className="text-left">
                <div className="text-stone-800 font-bold text-sm">Merapikan Kasur</div>
                <div className="text-emerald-600 text-xs font-semibold">نَظِيْفٌ وَمُرَتَّبٌ (Bersih & Rapi)</div>
              </div>
              <span className="text-2xl ml-2">🪟</span>
            </div>
          </div>
        </div>
      );

    case 'family-breakfast':
      return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-amber-50 via-amber-100 to-orange-100 flex items-center justify-center ${className}`}>
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-3xl">🧕</span>
              <span className="text-amber-700 font-bold text-xs bg-amber-200 px-3 py-1 rounded-full">Ummi Khadijah</span>
              <span className="text-3xl">👦</span>
            </div>
            <div className="bg-white/95 border border-amber-300 px-5 py-3 rounded-2xl shadow-lg flex items-center gap-4">
              <span className="text-3xl">🍳 🍞 🥛</span>
              <div className="text-left">
                <div className="text-stone-900 font-extrabold text-sm">الفُطُوْرُ اللَّذِيْذُ</div>
                <div className="text-stone-600 text-xs">Sarapan Penuh Energi</div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'wear-uniform':
      return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-sky-100 via-blue-50 to-indigo-100 flex items-center justify-center ${className}`}>
          <div className="relative z-10 flex items-center gap-4 bg-white/95 border border-blue-200 p-4 rounded-2xl shadow-md">
            <div className="text-4xl">👔</div>
            <div className="text-left">
              <div className="text-blue-900 font-extrabold text-sm">الزِّيُّ المَدْرَسِيُّ</div>
              <div className="text-stone-600 text-xs">Seragam Bersih & Rapi</div>
              <div className="text-emerald-700 font-bold text-xs mt-1">🎒 Tas & Buku Siap</div>
            </div>
            <div className="text-3xl">👦</div>
          </div>
        </div>
      );

    case 'parents-salim':
      return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-rose-50 via-amber-50 to-orange-100 flex items-center justify-center ${className}`}>
          <div className="relative z-10 flex flex-col items-center">
            <div className="flex items-center gap-4 bg-white/90 border border-amber-300 p-4 rounded-2xl shadow-md">
              <span className="text-3xl">🧕🧔</span>
              <div className="text-center">
                <span className="text-rose-600 font-bold text-xs">مَعَ السَّلَامَةِ!</span>
                <div className="text-stone-800 font-bold text-sm">Salim & Pamit Orang Tua</div>
                <span className="text-emerald-700 text-xs font-semibold">فِي أَمَانِ اللَّهِ</span>
              </div>
              <span className="text-3xl">👫</span>
            </div>
          </div>
        </div>
      );

    case 'walk-street':
      return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-emerald-100 via-teal-50 to-emerald-200 flex items-center justify-center ${className}`}>
          <div className="absolute top-2 left-6 text-2xl">🌳</div>
          <div className="absolute top-2 right-8 text-2xl">🌲</div>
          <div className="relative z-10 flex items-center gap-3 bg-white/90 px-5 py-3 rounded-2xl shadow-md border border-emerald-300">
            <span className="text-3xl">👫</span>
            <div className="text-left">
              <div className="text-emerald-900 font-extrabold text-sm">سَيْرًا عَلَى الأَقْدَامِ</div>
              <div className="text-stone-600 text-xs">Jalan Kaki Rindang Menuju Madrasah</div>
            </div>
            <span className="text-2xl">🏫</span>
          </div>
        </div>
      );

    case 'school-gate':
      return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-teal-800 via-emerald-900 to-teal-950 flex items-center justify-center ${className}`}>
          <div className="relative z-10 flex flex-col items-center">
            <div className="text-amber-300 font-arabic text-xl font-bold mb-1">مَدْرَسَتُنَا الإِسْلَامِيَّةُ</div>
            <div className="flex items-center gap-3 bg-white/95 px-5 py-3 rounded-2xl shadow-xl">
              <span className="text-3xl">👳‍♂️</span>
              <div className="text-left">
                <div className="text-emerald-900 font-bold text-sm">Ustadz Salman</div>
                <div className="text-stone-600 text-xs">صَبَاحُ الخَيْرِ يَا أَبْنَائِي!</div>
              </div>
              <span className="text-2xl">✨</span>
            </div>
          </div>
        </div>
      );

    case 'classroom-seats':
      return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-amber-50 via-stone-100 to-amber-100 flex items-center justify-center ${className}`}>
          <div className="relative z-10 flex flex-col items-center">
            <div className="bg-emerald-900 text-amber-200 border-2 border-amber-600/40 px-6 py-2 rounded-xl mb-3 shadow-md font-arabic text-lg font-bold">
              يَوْمِيَّاتُنَا فِي الحَيَاةِ
            </div>
            <div className="flex items-center gap-4 bg-white/90 px-4 py-2 rounded-xl shadow-xs border border-stone-200">
              <span className="text-2xl">🪑</span>
              <span className="text-xs font-bold text-stone-700">Duduk Rapi di Meja Belajar</span>
              <span className="text-2xl">📝</span>
            </div>
          </div>
        </div>
      );

    case 'teacher-whiteboard':
      return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-stone-800 via-stone-900 to-emerald-950 flex items-center justify-center ${className}`}>
          <div className="relative z-10 flex flex-col items-center text-center p-3">
            <div className="bg-white text-stone-900 px-6 py-3 rounded-xl shadow-lg border-2 border-emerald-600 mb-2">
              <div className="font-arabic text-xl font-black text-emerald-800">يَشْرَحُ الأُسْتَاذُ الدَّرْسَ</div>
              <div className="text-xs text-stone-600 font-medium">Ustadz Menjelaskan Kosakata</div>
            </div>
            <div className="flex items-center gap-2 text-amber-300 text-xs font-bold">
              <span>👳‍♂️ Ustadz Salman</span>
              <span>•</span>
              <span>Penjelasan Jelas & Mudah</span>
            </div>
          </div>
        </div>
      );

    case 'student-answer':
      return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-pink-50 via-rose-100 to-purple-100 flex items-center justify-center ${className}`}>
          <div className="relative z-10 flex items-center gap-3 bg-white/95 px-5 py-3 rounded-2xl shadow-md border border-rose-300">
            <span className="text-4xl">🙋‍♀️👧</span>
            <div className="text-left">
              <div className="text-rose-900 font-extrabold text-sm">Fatimah Menjawab</div>
              <div className="text-emerald-700 text-xs font-bold font-arabic">أَنَا أُجِيْبُ يَا أُسْتَاذُ!</div>
            </div>
            <span className="text-2xl">⭐</span>
          </div>
        </div>
      );

    case 'teacher-thumbsup':
      return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-amber-400 via-yellow-400 to-amber-500 flex items-center justify-center ${className}`}>
          <div className="relative z-10 flex items-center gap-4 bg-stone-900/90 text-white px-6 py-3 rounded-2xl shadow-2xl border border-amber-300">
            <span className="text-4xl">👍👳‍♂️</span>
            <div className="text-left">
              <div className="text-amber-400 font-extrabold text-sm font-arabic text-lg">أَحْسَنْتِ يَا فَاطِمَةُ!</div>
              <div className="text-stone-300 text-xs">Jawaban Benar & Sempurna (100)</div>
            </div>
            <span className="text-3xl animate-bounce">🌟</span>
          </div>
        </div>
      );

    case 'school-bell':
      return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-yellow-100 via-amber-200 to-orange-200 flex items-center justify-center ${className}`}>
          <div className="relative z-10 flex items-center gap-4 bg-white/95 px-5 py-3 rounded-2xl shadow-lg border border-amber-400">
            <span className="text-4xl animate-wiggle">🔔</span>
            <div className="text-left">
              <div className="text-amber-900 font-black text-sm">يَرِنُّ الجَرَسُ!</div>
              <div className="text-stone-700 text-xs font-semibold">Ting-Tong! Waktu Istirahat & Sholat</div>
            </div>
            <span className="text-2xl">🕛</span>
          </div>
        </div>
      );

    case 'mosque-prayer':
      return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-emerald-950 via-teal-900 to-stone-900 flex items-center justify-center ${className}`}>
          <div className="relative z-10 flex flex-col items-center">
            <div className="text-amber-300 text-sm font-arabic mb-1">صَلَاةُ الظُّهْرِ جَمَاعَةً</div>
            <div className="flex items-center gap-2 bg-emerald-800/80 text-white px-5 py-2.5 rounded-xl border border-emerald-500 shadow-md">
              <span className="text-2xl">🕌</span>
              <div className="text-left">
                <div className="text-xs font-bold text-amber-200">Shaf Rapat & Khusyuk</div>
                <div className="text-[11px] text-emerald-100">Empat Rakaat di Belakang Imam</div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'canteen-lunch':
      return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-orange-100 via-amber-100 to-yellow-100 flex items-center justify-center ${className}`}>
          <div className="relative z-10 flex items-center gap-4 bg-white/95 px-5 py-3 rounded-2xl shadow-md border border-orange-300">
            <span className="text-3xl">🍗 🍚 🍊</span>
            <div className="text-left">
              <div className="text-orange-900 font-extrabold text-sm">المَقْصَفُ المَدْرَسِيُّ</div>
              <div className="text-stone-600 text-xs">Makan Siang Halal, Sehat & Segar</div>
            </div>
            <span className="text-2xl">🥤</span>
          </div>
        </div>
      );

    case 'canteen-dua':
      return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-teal-50 via-emerald-100 to-green-100 flex items-center justify-center ${className}`}>
          <div className="relative z-10 flex items-center gap-3 bg-white/90 p-4 rounded-2xl shadow-md border border-emerald-300">
            <span className="text-3xl">🤲🧒</span>
            <div className="text-left">
              <div className="text-emerald-900 font-bold text-xs font-arabic">اَلْحَمْدُ لِلَّهِ الَّذِي أَطْعَمَنَا</div>
              <div className="text-stone-700 text-xs font-medium">Doa Selesai Makan & Syukur Nikmat</div>
            </div>
          </div>
        </div>
      );

    case 'return-home':
      return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-amber-100 via-orange-100 to-rose-100 flex items-center justify-center ${className}`}>
          <div className="relative z-10 flex items-center gap-3 bg-white/95 px-5 py-3 rounded-2xl shadow-md border border-orange-300">
            <span className="text-3xl">🏡</span>
            <div className="text-left">
              <div className="text-stone-900 font-extrabold text-sm">الرُّجُوعُ إِلَى البَيْتِ</div>
              <div className="text-rose-700 text-xs font-semibold">Kembali ke Rumah dengan Riang</div>
            </div>
            <span className="text-3xl">👫</span>
          </div>
        </div>
      );

    case 'rest-afternoon':
      return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-sky-100 via-indigo-50 to-purple-100 flex items-center justify-center ${className}`}>
          <div className="relative z-10 flex items-center gap-3 bg-white/95 px-5 py-3 rounded-2xl shadow-md border border-indigo-200">
            <span className="text-3xl">🛋️👦</span>
            <div className="text-left">
              <div className="text-indigo-950 font-bold text-sm">قَيْلُوْلَةٌ (Istirahat Siang)</div>
              <div className="text-stone-600 text-xs">Menyegarkan Badan Setelah Sekolah</div>
            </div>
            <span className="text-2xl">🕒</span>
          </div>
        </div>
      );

    case 'football-field':
      return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-emerald-600 via-green-700 to-emerald-900 flex items-center justify-center ${className}`}>
          <div className="absolute top-2 right-4 text-3xl animate-bounce">⚽</div>
          <div className="relative z-10 flex items-center gap-3 bg-white/95 px-5 py-3 rounded-2xl shadow-2xl border border-emerald-400">
            <span className="text-3xl">🏃‍♂️👦</span>
            <div className="text-left">
              <div className="text-emerald-950 font-black text-sm">كُرَةُ القَدَمِ فِي المَلْعَبِ</div>
              <div className="text-emerald-700 text-xs font-bold">Olahraga Sore Menjaga Kebugaran</div>
            </div>
            <span className="text-2xl">🥅</span>
          </div>
        </div>
      );

    case 'kitchen-help':
      return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-rose-100 via-orange-100 to-amber-100 flex items-center justify-center ${className}`}>
          <div className="relative z-10 flex items-center gap-4 bg-white/95 px-5 py-3 rounded-2xl shadow-md border border-rose-300">
            <span className="text-3xl">🍲 🥕 🧄</span>
            <div className="text-left">
              <div className="text-stone-900 font-extrabold text-sm">تُسَاعِدُ أُمَّهَا فِي المَطْبَخِ</div>
              <div className="text-rose-700 text-xs font-semibold">Membantu Ummi Menyiapkan Makan Malam</div>
            </div>
            <span className="text-3xl">👧</span>
          </div>
        </div>
      );

    case 'quran-reading':
      return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-indigo-950 via-slate-900 to-emerald-950 flex items-center justify-center ${className}`}>
          <div className="relative z-10 flex flex-col items-center">
            <div className="text-amber-300 text-2xl font-arabic font-bold mb-1 drop-shadow-md">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs border border-amber-400/40 px-5 py-2.5 rounded-2xl text-white">
              <span className="text-3xl">📖</span>
              <div className="text-left">
                <div className="text-amber-200 font-bold text-xs">قِرَاءَةُ القُرْآنِ بِالتَّرْتِيْلِ</div>
                <div className="text-stone-300 text-[11px]">Tadarus Keluarga Ba'da Maghrib</div>
              </div>
            </div>
          </div>
        </div>
      );

    case 'family-dinner':
      return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-amber-100 via-orange-100 to-amber-200 flex items-center justify-center ${className}`}>
          <div className="relative z-10 flex items-center gap-3 bg-white/95 px-5 py-3 rounded-2xl shadow-lg border border-amber-300">
            <span className="text-3xl">👨‍👩‍👧‍👦</span>
            <div className="text-left">
              <div className="text-stone-900 font-black text-sm">وَجْبَةُ العَشَاءِ مَعَ الأُسْرَةِ</div>
              <div className="text-amber-800 text-xs font-semibold">Makan Malam Hangat Penuh Keakraban</div>
            </div>
            <span className="text-2xl">🍲</span>
          </div>
        </div>
      );

    case 'study-desk':
      return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-slate-900 via-indigo-950 to-slate-900 flex items-center justify-center ${className}`}>
          <div className="relative z-10 flex items-center gap-3 bg-white/15 backdrop-blur-xs border border-amber-400/30 px-5 py-3 rounded-2xl text-white">
            <span className="text-3xl">💡 📚</span>
            <div className="text-left">
              <div className="text-amber-300 font-bold text-sm">مُذَاكَرَةُ الدُّرُوْسِ</div>
              <div className="text-stone-300 text-xs">Belajar & Mengerjakan Tugas PR</div>
            </div>
            <span className="text-2xl">👦✍️</span>
          </div>
        </div>
      );

    case 'sleep-dua':
      return (
        <div className={`relative overflow-hidden rounded-xl bg-gradient-to-b from-indigo-950 via-slate-950 to-blue-950 flex items-center justify-center ${className}`}>
          <div className="absolute top-3 left-4 text-amber-200 text-lg">🌙 ✨</div>
          <div className="relative z-10 flex flex-col items-center">
            <div className="text-amber-200 font-arabic text-sm font-semibold mb-1">
              بِاسْمِكَ اللَّهُمَّ أَحْيَا وَأَمُوْتُ
            </div>
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-xs border border-indigo-400/40 px-5 py-2 rounded-2xl text-white">
              <span className="text-3xl">😴🛏️</span>
              <div className="text-left">
                <div className="text-xs font-bold text-sky-200">Adab Tidur Miring ke Kanan</div>
                <div className="text-[11px] text-stone-300">Menjaga Wudhu & Menghadap Kiblat</div>
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return (
        <div className={`rounded-xl bg-amber-100 flex items-center justify-center text-amber-800 font-bold ${className}`}>
          <span>🎨 Komik Yaumiyyatuna</span>
        </div>
      );
  }
};
