import express, { Request, Response } from 'express';
import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
app.use(express.json());

// Initialize Gemini client server-side
const apiKey = process.env.GEMINI_API_KEY || '';
const ai = apiKey
  ? new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// Health check endpoint
app.get('/api/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    geminiConfigured: !!ai,
    message: 'Backend API Pembelajaran Bahasa Arab Yaumiyyatuna aktif.',
  });
});

// Admin login endpoint
// Credentials requested: username 'nisrinamaia', password 'nisrinamaia1107'
app.post('/api/admin/login', (req: Request, res: Response) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      res.status(400).json({ error: 'Username dan password wajib diisi.' });
      return;
    }

    if (username === 'nisrinamaia' && password === 'nisrinamaia1107') {
      res.json({
        success: true,
        user: {
          uid: 'admin_nisrinamaia',
          username: 'nisrinamaia',
          displayName: 'Ustadzah Nisrina Maia (Admin)',
          email: 'nisrinamaia@yaumiyyatuna.edu',
          role: 'admin',
          photoURL: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80',
          isAdmin: true,
        },
        token: `adm_${Date.now()}_auth_token_nisrinamaia`,
      });
      return;
    }

    res.status(401).json({ error: 'Username atau password admin salah!' });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Internal Server Error';
    res.status(500).json({ error: message });
  }
});

// Gemini AI Tutor Endpoint: Ask questions about Arabic grammar (Nahwu/Sharaf), vocabulary, or sentence meaning
app.post('/api/gemini/tutor', async (req: Request, res: Response) => {
  try {
    const { question, arabicSentence, contextTopic } = req.body;

    if (!question) {
      res.status(400).json({ error: 'Pertanyaan wajib disertakan.' });
      return;
    }

    if (!ai) {
      res.status(500).json({
        error: 'GEMINI_API_KEY belum dikonfigurasi di server environment.',
      });
      return;
    }

    const systemInstruction = `Kamu adalah "Ustadz Salman", seorang guru bahasa Arab yang ramah, bijak, dan sangat ahli dalam mengajar pemula dan santri. 
Tema pembelajaran saat ini adalah "Yaumiyyatuna" (يَوْمِيَّاتُنَا - Kegiatan Sehari-hari).
Bila ada kalimat bahasa Arab, berikan harakat yang lengkap dan jelas.
Jelaskan kaidah Nahwu (tata bahasa), Sharaf (perubahan kata fi'il/isim), makna kosakata (mufradat), dan contoh penggunaan sehari-hari dalam bahasa Indonesia yang mudah dipahami, santun, dan menyemangati.
Gunakan format markdown yang rapi dengan poin-poin penjelasan.`;

    const prompt = `Konteks Kalimat/Topik: ${contextTopic || 'Kegiatan Sehari-hari (Yaumiyyatuna)'}
${arabicSentence ? `Kalimat Arab: ${arabicSentence}` : ''}
Pertanyaan Santri: ${question}

Mohon jelaskan secara terstruktur:
1. Makna dan terjemahan kata per kata jika relevan.
2. Penjelasan tata bahasa (Fi'il Madhi/Mudhari'/Amr, Fa'il, Maf'ul bih, Dhomir ana/nahnu/anta/huwa) secara sederhana.
3. Tips cara mengingat atau mengucapkannya dengan baik.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction,
        temperature: 0.7,
      },
    });

    res.json({
      success: true,
      answer: response.text,
    });
  } catch (err: unknown) {
    console.error('Gemini Tutor Error:', err);
    const message = err instanceof Error ? err.message : 'Gagal menghubungi Gemini API';
    res.status(500).json({ error: message });
  }
});

// Gemini AI Scene & Dialog Generator for Custom Comic Scenarios
app.post('/api/gemini/generate-dialogue', async (req: Request, res: Response) => {
  try {
    const { activityTitle, characters } = req.body;

    if (!ai) {
      res.status(500).json({ error: 'GEMINI_API_KEY tidak tersedia di server.' });
      return;
    }

    const prompt = `Buatlah sebuah dialog komik pendek 4-5 panel tentang kegiatan sehari-hari (Yaumiyyatuna) dengan topik: "${activityTitle || 'Kegiatan di Rumah'}".
Karakter yang terlibat: ${characters || 'Ahmad (أَحْمَد) dan Fatimah (فَاطِمَة)'}.
Untuk setiap panel, buat dalam format JSON:
- speaker: nama karakter (Ahmad/Fatimah/dll)
- arabic: teks dialog bahasa Arab DENGAN HARAKAT LENGKAP
- transliteration: cara baca latin
- indonesian: terjemahan bahasa Indonesia
- visualDescription: deskripsi visual adegan komik
- soundEffect: efek suara komik (misal: "طَاطْ!", "تَكْ تَكْ!", atau kosong)`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Kembalikan HANYA JSON array dari panel dialog. Jangan gunakan pembungkus markdown selain JSON murni.',
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '[]');
    res.json({ success: true, panels: parsed });
  } catch (err: unknown) {
    console.error('Gemini Generate Dialog Error:', err);
    const message = err instanceof Error ? err.message : 'Gagal membuat dialog baru';
    res.status(500).json({ error: message });
  }
});

// Gemini AI Quiz Generator based on Yaumiyyatuna theme
app.post('/api/gemini/generate-quiz', async (req: Request, res: Response) => {
  try {
    const { episodeTitle, difficulty } = req.body;

    if (!ai) {
      res.status(500).json({ error: 'GEMINI_API_KEY belum tersedia.' });
      return;
    }

    const prompt = `Buatlah 3 soal kuis interaktif bahasa Arab bertema Yaumiyyatuna (kegiatan sehari-hari) untuk episode: "${episodeTitle || 'Kegiatan Pagi'}".
Tingkat kesulitan: ${difficulty || 'pemula'}.
Format JSON tiap soal:
{
  "question": "Pertanyaan dalam bahasa Indonesia dengan kutipan kalimat Arab berharakat",
  "arabicSnippet": "Kutipan bahasa Arab berharakat",
  "options": ["Pilihan A", "Pilihan B", "Pilihan C", "Pilihan D"],
  "correctAnswerIndex": 0,
  "explanation": "Penjelasan tata bahasa / arti mengapa jawaban tersebut benar"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Kembalikan format JSON murni array 3 soal kuis.',
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '[]');
    res.json({ success: true, questions: parsed });
  } catch (err: unknown) {
    console.error('Gemini Generate Quiz Error:', err);
    const message = err instanceof Error ? err.message : 'Gagal membuat kuis';
    res.status(500).json({ error: message });
  }
});

// Gemini AI Branching Comic Story Generator for Mode Guru
app.post('/api/gemini/generate-branching-story', async (req: Request, res: Response) => {
  try {
    const { topic, targetVocab, characterNames } = req.body;

    if (!ai) {
      res.status(500).json({ error: 'GEMINI_API_KEY belum dikonfigurasi di server.' });
      return;
    }

    const prompt = `Buatlah naskah adegan komik interaktif 2D bercabang (branching choice) bertema Yaumiyyatuna (kegiatan sehari-hari).
Topik adegan: "${topic || 'Kegiatan Pagi Santri'}"
Target Mufrodat yang wajib ada: "${targetVocab || 'أَسْتَيْقِظُ، أَتَوَضَّأُ، المَسْجِدُ'}"
Karakter: "${characterNames || 'Ahmad dan Fatimah'}"

Kembalikan dalam format JSON murni:
{
  "chapterTitle": "Judul Bab dalam Bahasa Indonesia",
  "settingTime": "Waktu kegiatan (contoh: 05:00 Pagi)",
  "illustrationKey": "pilih salah satu dari: bedroom-alarm, bathroom-wudhu, walk-to-mosque, tidy-bedroom, family-breakfast, wear-uniform, parents-salim, walk-street, school-gate, classroom-seats, teacher-whiteboard, student-answer, school-bell, mosque-prayer, canteen-lunch, football-field, kitchen-help, quran-reading, sleep-dua",
  "speaker": "Nama Karakter Utama",
  "speakerArabic": "Nama dalam Bahasa Arab berharakat",
  "avatar": "Emoji (contoh: 👦 atau 👧 atau 👳‍♂️)",
  "arabicDialogue": "Kalimat percakapan Arab berharakat LENGKAP",
  "transliteration": "Cara baca huruf latin yang fasih",
  "indonesianDialogue": "Arti terjemahan bahasa Indonesia",
  "soundEffect": "Efek suara komik (contoh: طَشْ طَشْ! atau kosong)",
  "questionPrompt": {
    "arabic": "Pertanyaan pilihan aksi berikutnya dalam Bahasa Arab berharakat",
    "indonesian": "Pertanyaan dalam bahasa Indonesia untuk siswa memilih aksi berikutnya"
  },
  "choices": [
    {
      "arabicText": "Pilihan Aksi 1 dalam Bahasa Arab berharakat",
      "transliteration": "Cara baca latin pilihan 1",
      "indonesianText": "Arti pilihan 1",
      "feedbackIndo": "Komentar adab/nasihat positif untuk pilihan 1",
      "isRecommendedAdab": true,
      "pointsAwarded": 25
    },
    {
      "arabicText": "Pilihan Aksi 2 dalam Bahasa Arab berharakat",
      "transliteration": "Cara baca latin pilihan 2",
      "indonesianText": "Arti pilihan 2",
      "feedbackIndo": "Komentar untuk pilihan 2",
      "isRecommendedAdab": false,
      "pointsAwarded": 15
    },
    {
      "arabicText": "Pilihan Aksi 3 dalam Bahasa Arab berharakat",
      "transliteration": "Cara baca latin pilihan 3",
      "indonesianText": "Arti pilihan 3",
      "feedbackIndo": "Komentar untuk pilihan 3",
      "isRecommendedAdab": false,
      "pointsAwarded": 10
    }
  ],
  "words": [
    { "arabic": "kata 1 berharakat", "transliteration": "latin", "meaning": "arti", "pos": "fiil" },
    { "arabic": "kata 2 berharakat", "transliteration": "latin", "meaning": "arti", "pos": "isim" },
    { "arabic": "kata 3 berharakat", "transliteration": "latin", "meaning": "arti", "pos": "harf" }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        systemInstruction: 'Kamu adalah pakar kurikulum bahasa Arab interaktif. Kembalikan HANYA format JSON valid tanpa tanda kutip markdown.',
        responseMimeType: 'application/json',
      },
    });

    const parsed = JSON.parse(response.text?.trim() || '{}');
    res.json({ success: true, scene: parsed });
  } catch (err: unknown) {
    console.error('Gemini Branching Story Error:', err);
    const message = err instanceof Error ? err.message : 'Gagal menghasilkan naskah komik';
    res.status(500).json({ error: message });
  }
});

// Export default app without app.listen (crucial for Vercel serverless)
export default app;
