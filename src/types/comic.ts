export type PartOfSpeech = 'fiil' | 'isim' | 'harf';

export interface VocabWord {
  arabic: string;
  transliteration: string;
  meaning: string;
  pos: PartOfSpeech;
  root?: string;
  notes?: string;
}

export interface ComicPanel {
  id: string;
  speaker: string;
  speakerArabic: string;
  speakerRole: string;
  avatar: string;
  arabic: string;
  transliteration: string;
  indonesian: string;
  soundEffect?: string;
  settingDesc: string;
  settingTime: string;
  illustrationSvgKey: string;
  words: VocabWord[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  arabicSnippet?: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export interface ComicEpisode {
  id: string;
  number: number;
  titleArabic: string;
  titleIndonesian: string;
  timeOfDay: string;
  summary: string;
  badge: string;
  panels: ComicPanel[];
  featuredVocab: VocabWord[];
  quiz: QuizQuestion[];
}

export interface BranchingChoice {
  id: string;
  arabicText: string;
  transliteration: string;
  indonesianText: string;
  nextSceneId: string;
  feedbackIndo?: string;
  feedbackArabic?: string;
  isRecommendedAdab?: boolean;
  pointsAwarded?: number;
}

export interface BranchingScene {
  id: string;
  chapterTitle: string;
  settingTime: string;
  illustrationKey: string;
  speaker: string;
  speakerArabic: string;
  speakerRole: string;
  avatar: string;
  arabicDialogue: string;
  transliteration: string;
  indonesianDialogue: string;
  soundEffect?: string;
  words: VocabWord[];
  questionPrompt?: {
    arabic: string;
    indonesian: string;
  };
  choices: BranchingChoice[];
  isEnding?: boolean;
}

export interface UserLearnerProfile {
  uid: string;
  displayName: string;
  email: string;
  photoURL?: string;
  role: 'student' | 'teacher' | 'admin';
  isAdmin?: boolean;
}

export interface UserStats {
  completedEpisodes: string[];
  stars: number;
  totalScore: number;
  streakDays: number;
  lastActive: string;
  visitedScenes: string[];
}

export interface SavedMufradatItem {
  id: string;
  arabic: string;
  transliteration: string;
  indonesian: string;
  category: string;
  episodeId: string;
  pos: PartOfSpeech;
  savedAt: string;
}
