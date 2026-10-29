import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { BranchingScene, BranchingChoice, VocabWord } from '../types/comic';
import { ComicIllustration } from './ComicIllustrations';
import {
  Sparkles,
  PlusCircle,
  Edit3,
  Trash2,
  GitBranch,
  Save,
  RotateCcw,
  BookOpen,
  CheckCircle2,
  Loader2,
  ArrowRight,
  Eye,
  Sliders,
} from 'lucide-react';

interface TeacherManagementProps {
  onPreviewAsStudent: () => void;
}

export const TeacherComicManagement: React.FC<TeacherManagementProps> = ({ onPreviewAsStudent }) => {
  const { branchingScenes, saveCustomScene, deleteCustomScene, resetScenes } = useAuth();

  // Active view: list vs editor vs ai-generator
  const [activeTab, setActiveTab] = useState<'list' | 'editor' | 'ai'>('list');
  const [editingSceneId, setEditingSceneId] = useState<string | null>(null);

  // AI Script Generator state
  const [aiTopic, setAiTopic] = useState('Kegiatan Membaca Buku di Perpustakaan Madrasah');
  const [aiTargetVocab, setAiTargetVocab] = useState('المَكْتَبَةُ، أَقْرَأُ، الكِتَابُ، المَجَلَّةُ');
  const [aiCharacters, setAiCharacters] = useState('Ahmad dan Ustadz Salman');
  const [isGeneratingAi, setIsGeneratingAi] = useState(false);
  const [aiGeneratedScene, setAiGeneratedScene] = useState<BranchingScene | null>(null);

  // Scene Editor Form state
  const [formChapterTitle, setFormChapterTitle] = useState('');
  const [formSettingTime, setFormSettingTime] = useState('06:00 Pagi');
  const [formIllustrationKey, setFormIllustrationKey] = useState('classroom-seats');
  const [formSpeaker, setFormSpeaker] = useState('Ahmad');
  const [formSpeakerArabic, setFormSpeakerArabic] = useState('أَحْمَد');
  const [formSpeakerRole, setFormSpeakerRole] = useState('Santri');
  const [formAvatar, setFormAvatar] = useState('👦');
  const [formArabicDialogue, setFormArabicDialogue] = useState('');
  const [formTransliteration, setFormTransliteration] = useState('');
  const [formIndonesianDialogue, setFormIndonesianDialogue] = useState('');
  const [formSoundEffect, setFormSoundEffect] = useState('');
  const [formQuestionArabic, setFormQuestionArabic] = useState('');
  const [formQuestionIndo, setFormQuestionIndo] = useState('');
  const [formChoices, setFormChoices] = useState<BranchingChoice[]>([]);

  const illustrationOptions = [
    { key: 'bedroom-alarm', label: 'Kamar Tidur (Bangun Pagi & Jam Weker)' },
    { key: 'bathroom-wudhu', label: 'Kamar Mandi (Wudhu & Sikat Gigi)' },
    { key: 'tidy-bedroom', label: 'Kamar Tidur Rapi (Jendela Terbuka)' },
    { key: 'walk-to-mosque', label: 'Berangkat ke Masjid Bersama Abi' },
    { key: 'family-breakfast', label: 'Meja Makan & Sarapan Bersama Ummi' },
    { key: 'wear-uniform', label: 'Mengenakan Seragam & Menyiapkan Tas' },
    { key: 'parents-salim', label: 'Salim & Pamit kepada Kedua Orang Tua' },
    { key: 'walk-street', label: 'Jalan Kaki Rindang Menuju Madrasah' },
    { key: 'school-gate', label: 'Gerbang Madrasah & Sapaan Guru' },
    { key: 'classroom-seats', label: 'Ruang Kelas & Meja Belajar' },
    { key: 'teacher-whiteboard', label: 'Papan Tulis & Penjelasan Guru' },
    { key: 'student-answer', label: 'Siswa Menjawab Pertanyaan' },
    { key: 'school-bell', label: 'Lonceng Bel Istirahat Sekolah' },
    { key: 'mosque-prayer', label: 'Sholat Berjamaah di Musholla' },
    { key: 'canteen-lunch', label: 'Kantin Sekolah & Makan Siang' },
    { key: 'football-field', label: 'Lapangan Olahraga & Sepak Bola' },
    { key: 'kitchen-help', label: 'Dapur & Membantu Ibu Memasak' },
    { key: 'study-desk', label: 'Meja Belajar Malam Hari' },
    { key: 'sleep-dua', label: 'Kamar Malam & Doa Tidur' },
  ];

  const handleEditScene = (scene: BranchingScene) => {
    setEditingSceneId(scene.id);
    setFormChapterTitle(scene.chapterTitle);
    setFormSettingTime(scene.settingTime);
    setFormIllustrationKey(scene.illustrationKey);
    setFormSpeaker(scene.speaker);
    setFormSpeakerArabic(scene.speakerArabic);
    setFormSpeakerRole(scene.speakerRole || 'Santri');
    setFormAvatar(scene.avatar);
    setFormArabicDialogue(scene.arabicDialogue);
    setFormTransliteration(scene.transliteration);
    setFormIndonesianDialogue(scene.indonesianDialogue);
    setFormSoundEffect(scene.soundEffect || '');
    setFormQuestionArabic(scene.questionPrompt?.arabic || '');
    setFormQuestionIndo(scene.questionPrompt?.indonesian || '');
    setFormChoices(scene.choices || []);
    setActiveTab('editor');
  };

  const handleCreateNewScene = () => {
    const newId = `scene-custom-${Date.now()}`;
    setEditingSceneId(newId);
    setFormChapterTitle('Bab Baru: Kegiatan Santri');
    setFormSettingTime('10:00 Pagi');
    setFormIllustrationKey('classroom-seats');
    setFormSpeaker('Ahmad');
    setFormSpeakerArabic('أَحْمَد');
    setFormSpeakerRole('Santri');
    setFormAvatar('👦');
    setFormArabicDialogue('أَدْخُلُ المَكْتَبَةَ وَأَقْرَأُ الكِتَابَ النَّافِعَ.');
    setFormTransliteration('Adkhulul-maktabata wa aqra\'ul-kitaban-nafi\'.');
    setFormIndonesianDialogue('Saya masuk perpustakaan dan membaca buku yang bermanfaat.');
    setFormSoundEffect('');
    setFormQuestionArabic('مَاذَا تَفْعَلُ بَعْدَ ذَلِكَ؟');
    setFormQuestionIndo('Apa yang kamu lakukan setelahnya?');
    setFormChoices([
      {
        id: `c_${Date.now()}_1`,
        arabicText: 'أَسْتَعِيْرُ الكِتَابَ مِنَ المُعَلِّمِ',
        transliteration: "Asta'irul-kitaba minal-mu'allim",
        indonesianText: 'Meminjam buku kepada guru perpustakaan',
        nextSceneId: 'scene-classroom',
        feedbackIndo: 'Pilihan gemar membaca!',
        isRecommendedAdab: true,
        pointsAwarded: 25,
      },
    ]);
    setActiveTab('editor');
  };

  const handleSaveEditor = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSceneId) return;

    // Build words array from dialogue
    const wordsList: VocabWord[] = formArabicDialogue
      .split(' ')
      .filter((w) => w.trim().length > 1)
      .slice(0, 8)
      .map((w) => ({
        arabic: w.trim(),
        transliteration: '',
        meaning: 'Kata kosa kata',
        pos: 'isim',
      }));

    const updatedScene: BranchingScene = {
      id: editingSceneId,
      chapterTitle: formChapterTitle,
      settingTime: formSettingTime,
      illustrationKey: formIllustrationKey,
      speaker: formSpeaker,
      speakerArabic: formSpeakerArabic,
      speakerRole: formSpeakerRole,
      avatar: formAvatar,
      arabicDialogue: formArabicDialogue,
      transliteration: formTransliteration,
      indonesianDialogue: formIndonesianDialogue,
      soundEffect: formSoundEffect,
      words: wordsList,
      questionPrompt:
        formQuestionArabic || formQuestionIndo
          ? {
              arabic: formQuestionArabic,
              indonesian: formQuestionIndo,
            }
          : undefined,
      choices: formChoices,
    };

    saveCustomScene(updatedScene);
    setActiveTab('list');
  };

  // Generate with Gemini AI
  const handleGenerateScriptWithAi = async () => {
    setIsGeneratingAi(true);
    try {
      const res = await fetch('/api/gemini/generate-branching-story', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: aiTopic,
          targetVocab: aiTargetVocab,
          characterNames: aiCharacters,
        }),
      });

      const data = await res.json();
      if (data.success && data.scene) {
        const generated: BranchingScene = {
          id: `scene-ai-${Date.now()}`,
          chapterTitle: data.scene.chapterTitle || 'Bab Khusus Yaumiyyatuna',
          settingTime: data.scene.settingTime || '08:00 Pagi',
          illustrationKey: data.scene.illustrationKey || 'classroom-seats',
          speaker: data.scene.speaker || 'Ahmad',
          speakerArabic: data.scene.speakerArabic || 'أَحْمَد',
          speakerRole: 'Santri',
          avatar: data.scene.avatar || '👦',
          arabicDialogue: data.scene.arabicDialogue || '',
          transliteration: data.scene.transliteration || '',
          indonesianDialogue: data.scene.indonesianDialogue || '',
          soundEffect: data.scene.soundEffect || '',
          words: data.scene.words || [],
          questionPrompt: data.scene.questionPrompt,
          choices: data.scene.choices || [],
        };
        setAiGeneratedScene(generated);
      }
    } catch (e) {
      console.error('AI generation error:', e);
    } finally {
      setIsGeneratingAi(false);
    }
  };

  const handleApplyAiScene = () => {
    if (!aiGeneratedScene) return;
    saveCustomScene(aiGeneratedScene);
    setActiveTab('list');
    setAiGeneratedScene(null);
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8 space-y-6">
      {/* Header Banner Mode Guru */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-purple-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-xs border border-white/20 flex items-center justify-center text-3xl shadow-inner">
              🧕
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="bg-amber-400 text-stone-950 font-black text-[10px] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                  Mode Guru (Pusat Pengelolaan)
                </span>
                <span className="text-xs text-indigo-200">Ustadzah Nisrina Maia</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-black mt-1">
                Pusat Manajemen Komik & Alur Bercabang Yaumiyyatuna
              </h1>
              <p className="text-xs text-indigo-100 font-medium mt-0.5">
                Kelola adegan visual 2D, buat naskah otomatis dengan Gemini AI, dan tentukan pilihan percabangan siswa.
              </p>
            </div>
          </div>

          <button
            onClick={onPreviewAsStudent}
            className="bg-amber-400 hover:bg-amber-500 text-stone-950 font-extrabold px-5 py-3 rounded-2xl text-xs flex items-center gap-2 shadow-md cursor-pointer transition-transform hover:scale-105 shrink-0"
          >
            <Eye className="w-4 h-4" />
            <span>Uji sebagai Siswa (Pratinjau)</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs */}
      <div className="flex border-b border-stone-200 bg-white p-2 rounded-2xl shadow-2xs gap-2">
        <button
          onClick={() => setActiveTab('list')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'list'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-50'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Daftar Adegan Komik ({branchingScenes.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('ai')}
          className={`flex-1 py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'ai'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-50'
          }`}
        >
          <Sparkles className="w-4 h-4 text-amber-400" />
          <span>AI Script Generator (Gemini)</span>
        </button>

        <button
          onClick={handleCreateNewScene}
          className={`py-2.5 px-4 rounded-xl text-xs sm:text-sm font-bold transition-colors cursor-pointer flex items-center justify-center gap-2 ${
            activeTab === 'editor'
              ? 'bg-indigo-600 text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-50'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Tambah Adegan Baru</span>
        </button>
      </div>

      {/* 1. SCENES LIST VIEW */}
      {activeTab === 'list' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between text-xs text-stone-500 font-semibold px-2">
            <span>Adegan komik 2D yang saat ini dapat diakses oleh siswa:</span>
            <button
              onClick={resetScenes}
              className="text-stone-500 hover:text-stone-800 flex items-center gap-1 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset ke Template Default</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {branchingScenes.map((scene, idx) => (
              <div
                key={scene.id}
                className="bg-white rounded-3xl border border-stone-200 p-5 shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700">
                      Adegan #{idx + 1} • {scene.settingTime}
                    </span>
                    <span className="text-xs text-stone-400 font-mono">{scene.id}</span>
                  </div>

                  <h3 className="text-sm font-black text-stone-900">{scene.chapterTitle}</h3>

                  {/* Visual scene preview */}
                  <div className="my-3 rounded-xl overflow-hidden border border-stone-100">
                    <ComicIllustration svgKey={scene.illustrationKey} className="w-full h-36" />
                  </div>

                  {/* Arabic snippet */}
                  <div className="font-arabic text-xl font-bold text-stone-900 text-right line-clamp-2 leading-relaxed">
                    {scene.arabicDialogue}
                  </div>
                  <div className="text-xs text-stone-600 font-medium mt-1">
                    {scene.indonesianDialogue}
                  </div>

                  {/* Branching choices preview */}
                  {scene.choices && scene.choices.length > 0 && (
                    <div className="mt-3 pt-3 border-t border-stone-100 space-y-1">
                      <span className="text-[10px] font-bold text-stone-400 uppercase flex items-center gap-1">
                        <GitBranch className="w-3 h-3 text-indigo-600" />
                        <span>Titik Percabangan ({scene.choices.length} Pilihan):</span>
                      </span>
                      {scene.choices.map((c, cIdx) => (
                        <div key={cIdx} className="text-[11px] text-stone-700 flex items-center gap-1.5 font-medium">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                          <span>{c.indonesianText}</span>
                          <span className="text-indigo-600 font-mono text-[10px]">➔ {c.nextSceneId}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                  <button
                    onClick={() => handleEditScene(scene)}
                    className="text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    <span>Edit Adegan & Percabangan</span>
                  </button>

                  <button
                    onClick={() => deleteCustomScene(scene.id)}
                    disabled={branchingScenes.length <= 1}
                    className="p-1.5 text-stone-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors cursor-pointer disabled:opacity-20"
                    title="Hapus Adegan"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 2. AI SCRIPT GENERATOR VIEW */}
      {activeTab === 'ai' && (
        <div className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <span className="w-10 h-10 rounded-2xl bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
              <Sparkles className="w-5 h-5 text-amber-500" />
            </span>
            <div>
              <h2 className="text-base font-extrabold text-stone-900">
                AI Script Generator untuk Komik Yaumiyyatuna
              </h2>
              <p className="text-xs text-stone-500 font-medium">
                Ketikkan topik atau target mufrodat yang ingin diajarkan. Gemini AI otomatis menyusun teks Arab berharakat, terjemahan, dan alur percabangan aktivitas santri!
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Topik Aktivitas Harian</label>
              <input
                type="text"
                value={aiTopic}
                onChange={(e) => setAiTopic(e.target.value)}
                placeholder="Contoh: Belajar Bersama di Perpustakaan"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Target Mufrodat Wajib</label>
              <input
                type="text"
                value={aiTargetVocab}
                onChange={(e) => setAiTargetVocab(e.target.value)}
                placeholder="Contoh: كِتَابٌ، أَقْرَأُ، المَكْتَبَةُ"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Karakter yang Terlibat</label>
              <input
                type="text"
                value={aiCharacters}
                onChange={(e) => setAiCharacters(e.target.value)}
                placeholder="Contoh: Ahmad dan Fatimah"
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-hidden"
              />
            </div>
          </div>

          <button
            onClick={handleGenerateScriptWithAi}
            disabled={isGeneratingAi}
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-extrabold px-6 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-md shadow-indigo-600/20 cursor-pointer transition-colors disabled:opacity-50"
          >
            {isGeneratingAi ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Menyusun Naskah Bahasa Arab & Percabangan...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span>Generate Naskah Komik dengan AI</span>
              </>
            )}
          </button>

          {/* AI Result Preview */}
          {aiGeneratedScene && (
            <div className="mt-6 p-5 sm:p-7 bg-indigo-50/70 border-2 border-indigo-200 rounded-3xl space-y-4 animate-fadeIn">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-indigo-900">
                  Draf Naskah Hasil AI: {aiGeneratedScene.chapterTitle}
                </span>
                <span className="text-xs bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded-full font-bold">
                  {aiGeneratedScene.settingTime}
                </span>
              </div>

              <div className="bg-white p-4 rounded-2xl border border-indigo-200 space-y-2">
                <div className="font-arabic text-2xl font-bold text-stone-900 text-right leading-relaxed">
                  {aiGeneratedScene.arabicDialogue}
                </div>
                <div className="text-xs text-amber-900 italic font-semibold">
                  {aiGeneratedScene.transliteration}
                </div>
                <div className="text-xs text-stone-700 font-medium">
                  {aiGeneratedScene.indonesianDialogue}
                </div>
              </div>

              {/* Branching choices preview */}
              {aiGeneratedScene.choices && aiGeneratedScene.choices.length > 0 && (
                <div className="space-y-2">
                  <div className="text-xs font-bold text-stone-700 flex items-center gap-1.5">
                    <GitBranch className="w-4 h-4 text-indigo-600" />
                    <span>Latihan Pilihan Aktivitas yang Dibuat AI:</span>
                  </div>
                  {aiGeneratedScene.choices.map((c, i) => (
                    <div key={i} className="bg-white p-3 rounded-xl border border-stone-200 text-xs space-y-0.5">
                      <div className="font-arabic text-base font-bold text-stone-900">{c.arabicText}</div>
                      <div className="text-stone-600 font-medium">{c.indonesianText}</div>
                      <div className="text-[10px] text-emerald-700 font-semibold">{c.feedbackIndo}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                <button
                  onClick={handleApplyAiScene}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white font-black px-5 py-2.5 rounded-xl text-xs flex items-center gap-2 cursor-pointer shadow-xs"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Simpan & Tambahkan ke Alur Komik Siswa</span>
                </button>

                <button
                  onClick={() => handleEditScene(aiGeneratedScene)}
                  className="bg-white border border-stone-300 text-stone-700 hover:bg-stone-50 font-bold px-4 py-2.5 rounded-xl text-xs cursor-pointer"
                >
                  Edit Terlebih Dahulu
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 3. SCENE EDITOR FORM */}
      {activeTab === 'editor' && (
        <form onSubmit={handleSaveEditor} className="bg-white rounded-3xl border border-stone-200 p-6 sm:p-8 shadow-sm space-y-6">
          <div className="flex items-center justify-between pb-4 border-b border-stone-200">
            <div>
              <h2 className="text-base font-extrabold text-stone-900">
                {editingSceneId?.startsWith('scene-custom-') ? 'Buat Adegan Baru' : 'Edit Adegan & Percabangan'}
              </h2>
              <span className="text-xs text-stone-500">ID: {editingSceneId}</span>
            </div>
            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className="text-xs text-stone-500 hover:text-stone-800 font-bold"
            >
              Batal
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Judul Bab / Adegan</label>
              <input
                type="text"
                value={formChapterTitle}
                onChange={(e) => setFormChapterTitle(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Waktu Kegiatan</label>
              <input
                type="text"
                value={formSettingTime}
                onChange={(e) => setFormSettingTime(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-hidden"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">Ilustrasi Visual 2D</label>
              <select
                value={formIllustrationKey}
                onChange={(e) => setFormIllustrationKey(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-hidden"
              >
                {illustrationOptions.map((opt) => (
                  <option key={opt.key} value={opt.key}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Nama Karakter</label>
                <input
                  type="text"
                  value={formSpeaker}
                  onChange={(e) => setFormSpeaker(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Emoji Avatar</label>
                <input
                  type="text"
                  value={formAvatar}
                  onChange={(e) => setFormAvatar(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Dialogue Section */}
          <div className="space-y-3 pt-2 border-t border-stone-100">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Teks Percakapan Bahasa Arab (Lengkap dengan Harakat)
              </label>
              <textarea
                rows={2}
                value={formArabicDialogue}
                onChange={(e) => setFormArabicDialogue(e.target.value)}
                required
                className="w-full p-3 rounded-xl border border-stone-300 text-right font-arabic text-xl font-bold text-stone-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 outline-hidden"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Cara Baca Latin (Transliterasi)</label>
                <input
                  type="text"
                  value={formTransliteration}
                  onChange={(e) => setFormTransliteration(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Terjemahan Bahasa Indonesia</label>
                <input
                  type="text"
                  value={formIndonesianDialogue}
                  onChange={(e) => setFormIndonesianDialogue(e.target.value)}
                  required
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs sm:text-sm"
                />
              </div>
            </div>
          </div>

          {/* Branching Exercise Controller */}
          <div className="pt-4 border-t border-stone-200 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <GitBranch className="w-4 h-4 text-indigo-600" />
                <h3 className="text-xs font-extrabold uppercase tracking-wider text-stone-800">
                  Kontrol Latihan & Titik Percabangan Siswa
                </h3>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFormChoices([
                    ...formChoices,
                    {
                      id: `c_${Date.now()}`,
                      arabicText: 'أَفْعَلُ نَشَاطًا جَدِيْدًا',
                      transliteration: 'Af\'alu nasyathan jadidan',
                      indonesianText: 'Memilih aksi baru',
                      nextSceneId: branchingScenes[0]?.id || 'scene-wake-up',
                      feedbackIndo: 'Pilihan yang baik!',
                      isRecommendedAdab: true,
                      pointsAwarded: 20,
                    },
                  ]);
                }}
                className="text-xs font-bold text-indigo-700 bg-indigo-50 hover:bg-indigo-100 px-3 py-1.5 rounded-xl cursor-pointer"
              >
                + Tambah Opsi Pilihan Aksi
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Pertanyaan Aksi (Arab)</label>
                <input
                  type="text"
                  value={formQuestionArabic}
                  onChange={(e) => setFormQuestionArabic(e.target.value)}
                  placeholder="مَاذَا تَفْعَلُ بَعْدَ ذَلِكَ؟"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm font-arabic font-bold text-right"
                />
              </div>
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">Pertanyaan Aksi (Indonesia)</label>
                <input
                  type="text"
                  value={formQuestionIndo}
                  onChange={(e) => setFormQuestionIndo(e.target.value)}
                  placeholder="Setelah bangun tidur, kamu memilih untuk apa?"
                  className="w-full px-3.5 py-2 rounded-xl border border-stone-300 text-xs sm:text-sm"
                />
              </div>
            </div>

            {/* List of choices */}
            <div className="space-y-3">
              {formChoices.map((choice, i) => (
                <div key={i} className="bg-stone-50 border border-stone-200 p-4 rounded-2xl space-y-3">
                  <div className="flex items-center justify-between text-xs font-bold text-stone-700">
                    <span>Pilihan #{i + 1}</span>
                    <button
                      type="button"
                      onClick={() => setFormChoices(formChoices.filter((_, idx) => idx !== i))}
                      className="text-rose-600 hover:text-rose-800 text-[11px]"
                    >
                      Hapus Pilihan
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">Teks Opsi (Arab berharakat)</label>
                      <input
                        type="text"
                        value={choice.arabicText}
                        onChange={(e) => {
                          const updated = [...formChoices];
                          updated[i].arabicText = e.target.value;
                          setFormChoices(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-arabic font-bold text-right"
                      />
                    </div>
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">Arti Teks Opsi (Indonesia)</label>
                      <input
                        type="text"
                        value={choice.indonesianText}
                        onChange={(e) => {
                          const updated = [...formChoices];
                          updated[i].indonesianText = e.target.value;
                          setFormChoices(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">Adegan Tujuan (Next Scene)</label>
                      <select
                        value={choice.nextSceneId}
                        onChange={(e) => {
                          const updated = [...formChoices];
                          updated[i].nextSceneId = e.target.value;
                          setFormChoices(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs font-semibold"
                      >
                        {branchingScenes.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.chapterTitle} ({s.id})
                          </option>
                        ))}
                      </select>
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-stone-600 mb-1">Komentar/Nasihat Adab</label>
                      <input
                        type="text"
                        value={choice.feedbackIndo || ''}
                        onChange={(e) => {
                          const updated = [...formChoices];
                          updated[i].feedbackIndo = e.target.value;
                          setFormChoices(updated);
                        }}
                        placeholder="Contoh: Pilihan yang sangat mulia!"
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-300 text-xs"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 pt-3">
            <button
              type="submit"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-black px-6 py-3 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-md cursor-pointer transition-colors"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Adegan</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('list')}
              className="px-5 py-3 rounded-2xl border border-stone-300 text-stone-700 text-xs sm:text-sm font-bold hover:bg-stone-50 cursor-pointer"
            >
              Batal
            </button>
          </div>
        </form>
      )}
    </div>
  );
};
