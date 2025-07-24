export interface Surah {
  id: number;
  name: string;
  meaning: string;
  arabic: string;
  ayat: number;
  type: 'mekki' | 'medeni';
  order: number;
  text: string;
  turkish: string;
  translation: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard';
  readingTime: number;
}

export interface Verse {
  number: number;
  arabic: string;
  turkish: string;
  translation: string;
}

export interface Dua {
  id: number;
  name: string;
  arabic: string;
  turkish: string;
  translation: string;
  category: string;
  occasion?: string;
}

export interface AppSettings {
  language: 'tr' | 'ar' | 'en';
  fontSize: 'small' | 'medium' | 'large';
  theme: 'light' | 'dark';
  notifications: boolean;
}

export interface Bookmark {
  id: string;
  surahId?: number;
  surahName?: string;
  ayatNumber?: number;
  duaId?: number;
  duaName?: string;
  type?: 'surah' | 'dua' | 'verse';
  createdAt: string;
}
