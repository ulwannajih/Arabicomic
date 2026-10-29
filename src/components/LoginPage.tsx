import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  GraduationCap,
  BookOpen,
  LogIn,
  Key,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
  UserCheck,
} from 'lucide-react';

export const LoginPage: React.FC = () => {
  const { loginWithGoogle, loginAsStudentGuest, loginAsTeacher } = useAuth();
  const [selectedRole, setSelectedRole] = useState<'student' | 'teacher'>('student');

  // Student guest form
  const [studentName, setStudentName] = useState('');

  // Teacher credentials form
  const [teacherUsername, setTeacherUsername] = useState('');
  const [teacherPassword, setTeacherPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Quick fill helper for admin/teacher credentials: nisrinamaia / nisrinamaia1107
  const fillTeacherCredentials = () => {
    setTeacherUsername('nisrinamaia');
    setTeacherPassword('nisrinamaia1107');
    setErrorMessage(null);
  };

  const handleStudentGuestSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!studentName.trim()) {
      setErrorMessage('Silakan tulis nama santri/siswa terlebih dahulu.');
      return;
    }
    loginAsStudentGuest(studentName.trim());
  };

  const handleTeacherSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setIsSubmitting(true);

    try {
      const res = await loginAsTeacher(teacherUsername.trim(), teacherPassword.trim());
      if (!res.success) {
        setErrorMessage(res.message || 'Username atau password guru salah!');
      }
    } catch {
      setErrorMessage('Terjadi kendala saat login. Periksa koneksi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleGoogleLogin = async (asTeacher: boolean) => {
    setIsSubmitting(true);
    setErrorMessage(null);
    try {
      await loginWithGoogle(asTeacher);
    } catch {
      setErrorMessage('Gagal masuk dengan Google. Silakan coba kembali.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 via-orange-50/50 to-teal-50 flex flex-col justify-center items-center p-4 sm:p-6">
      {/* Decorative Arabic Calligraphy background accents */}
      <div className="absolute top-6 left-8 text-amber-200/40 font-arabic text-8xl pointer-events-none select-none hidden lg:block">
        يَوْمِيَّاتُنَا
      </div>
      <div className="absolute bottom-6 right-8 text-teal-200/40 font-arabic text-8xl pointer-events-none select-none hidden lg:block">
        العَرَبِيَّة
      </div>

      <div className="w-full max-w-2xl bg-white/95 backdrop-blur-md rounded-3xl shadow-2xl border border-amber-200/90 overflow-hidden relative z-10">
        {/* Banner Header */}
        <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-teal-700 p-6 sm:p-8 text-white text-center relative overflow-hidden">
          <div className="w-16 h-16 mx-auto mb-3 rounded-2xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30 shadow-inner">
            <span className="font-arabic text-3xl font-black text-amber-100">ي</span>
          </div>

          <h1 className="font-arabic text-3xl sm:text-4xl font-extrabold tracking-wide mb-1 drop-shadow-xs">
            يَوْمِيَّاتُنَا (Yaumiyyatuna)
          </h1>
          <h2 className="text-sm sm:text-base font-bold text-amber-100 tracking-wide">
            Komik 2D Interaktif & Pembelajaran Bahasa Arab Bercabang
          </h2>
          <p className="text-xs text-white/90 mt-2 max-w-md mx-auto font-medium">
            Pilihlah portal masuk untuk membaca petualangan kegiatan harian santri atau mengelola naskah komik sebagai guru.
          </p>
        </div>

        {/* Portal Selection Tabs: Siswa vs Guru */}
        <div className="grid grid-cols-2 p-3 gap-2 bg-stone-100/80 border-b border-stone-200">
          <button
            onClick={() => {
              setSelectedRole('student');
              setErrorMessage(null);
            }}
            className={`py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
              selectedRole === 'student'
                ? 'bg-amber-500 text-white shadow-md shadow-amber-500/20 scale-[1.01]'
                : 'bg-white text-stone-600 hover:text-amber-900 border border-stone-200'
            }`}
          >
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Masuk sebagai Siswa</span>
          </button>

          <button
            onClick={() => {
              setSelectedRole('teacher');
              setErrorMessage(null);
            }}
            className={`py-3.5 px-4 rounded-2xl text-xs sm:text-sm font-extrabold transition-all flex items-center justify-center gap-2.5 cursor-pointer ${
              selectedRole === 'teacher'
                ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20 scale-[1.01]'
                : 'bg-white text-stone-600 hover:text-indigo-900 border border-stone-200'
            }`}
          >
            <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
            <span>Masuk sebagai Guru</span>
          </button>
        </div>

        {/* Form Body */}
        <div className="p-6 sm:p-8">
          {errorMessage && (
            <div className="mb-5 bg-rose-50 border border-rose-200 text-rose-800 p-3.5 rounded-2xl flex items-start gap-2.5 text-xs">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* MODE SISWA LOGIN */}
          {selectedRole === 'student' ? (
            <div className="space-y-6">
              <div className="bg-amber-50 border border-amber-200/90 rounded-2xl p-4 text-left space-y-2">
                <div className="text-xs font-black text-amber-950 flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-amber-600" />
                  <span>Pengalaman Mode Siswa:</span>
                </div>
                <ul className="text-xs text-stone-700 space-y-1.5 list-disc list-inside">
                  <li><strong>Membaca Komik 2D:</strong> Teks Arab berharakat & audio pelafalan fasih.</li>
                  <li><strong>Latihan Pilihan Aktivitas Bercabang:</strong> Tentukan alur cerita aksimu sendiri (bangun tidur: wudhu, rapikan kasur, atau belajar) dengan adegan visual yang berubah!</li>
                  <li>Kumpulkan poin adab islami dan bintang santri teladan.</li>
                </ul>
              </div>

              {/* Fast name entry */}
              <form onSubmit={handleStudentGuestSubmit} className="space-y-3">
                <label className="block text-xs font-bold text-stone-800">
                  Nama Santri / Siswa Pembelajar:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={studentName}
                    onChange={(e) => setStudentName(e.target.value)}
                    placeholder="Contoh: Muhammad Farhan atau Aisyah"
                    className="flex-1 px-4 py-3 rounded-xl border border-stone-300 text-xs sm:text-sm focus:border-amber-500 focus:ring-2 focus:ring-amber-200 outline-hidden font-medium"
                  />
                  <button
                    type="submit"
                    className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold px-5 py-3 rounded-xl text-xs sm:text-sm flex items-center gap-1.5 shadow-md shadow-amber-500/20 cursor-pointer transition-colors"
                  >
                    <span>Mulai</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </form>

              <div className="relative flex py-2 items-center">
                <div className="grow border-t border-stone-200"></div>
                <span className="shrink mx-4 text-[11px] text-stone-400 font-semibold uppercase">atau</span>
                <div className="grow border-t border-stone-200"></div>
              </div>

              {/* Google Sign-in */}
              <button
                onClick={() => handleGoogleLogin(false)}
                disabled={isSubmitting}
                className="w-full bg-white hover:bg-stone-50 text-stone-800 font-bold py-3 px-4 rounded-xl border border-stone-300 shadow-2xs hover:shadow transition-all flex items-center justify-center gap-3 cursor-pointer text-xs sm:text-sm disabled:opacity-50"
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="#4285F4"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="#34A853"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="#FBBC05"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                  />
                  <path
                    fill="#EA4335"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                  />
                </svg>
                <span>Masuk dengan Google (Simpan di Firestore)</span>
              </button>
            </div>
          ) : (
            /* MODE GURU LOGIN */
            <form onSubmit={handleTeacherSubmit} className="space-y-4">
              <div className="bg-indigo-50 border border-indigo-200/90 rounded-2xl p-4 text-left space-y-2">
                <div className="text-xs font-black text-indigo-950 flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <Key className="w-4 h-4 text-indigo-600" />
                    <span>Akses Pusat Pengelolaan Guru:</span>
                  </div>
                  <button
                    type="button"
                    onClick={fillTeacherCredentials}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white text-[10px] font-bold px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                  >
                    Isi Akun Otomatis
                  </button>
                </div>
                <p className="text-[11px] text-indigo-900/80">
                  Guru memiliki wewenang menginput cerita komik baru, mengatur pilihan percabangan alur siswa, dan menyusun naskah dengan bantuan <strong>AI Script Generator (Gemini)</strong>.
                </p>
                <div className="text-[11px] text-indigo-800 font-mono bg-indigo-100/70 p-2 rounded-lg">
                  Username: <strong>nisrinamaia</strong> • Password: <strong>nisrinamaia1107</strong>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Username Guru</label>
                <input
                  type="text"
                  value={teacherUsername}
                  onChange={(e) => setTeacherUsername(e.target.value)}
                  placeholder="Masukkan username guru (nisrinamaia)"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Password</label>
                <input
                  type="password"
                  value={teacherPassword}
                  onChange={(e) => setTeacherPassword(e.target.value)}
                  placeholder="Masukkan password guru"
                  required
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-hidden"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold py-3.5 px-4 rounded-xl shadow-md shadow-indigo-600/20 text-xs sm:text-sm flex items-center justify-center gap-2 cursor-pointer transition-colors disabled:opacity-50"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>{isSubmitting ? 'Memverifikasi...' : 'Masuk sebagai Guru (Mode Guru)'}</span>
              </button>

              <div className="text-center pt-1">
                <button
                  type="button"
                  onClick={() => handleGoogleLogin(true)}
                  className="text-xs text-indigo-700 hover:underline font-semibold"
                >
                  Atau masuk dengan Akun Google Guru
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
