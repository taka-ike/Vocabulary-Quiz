export interface VocabItem {
    id: number;
    english_text: string;
    japanese_text: string;
    english_options: string[];
    japanese_options: string[];
}

export interface Definition {
    id: string;
    english_word: string;
    part_of_speech: string;
    japanese_meaning: string;
}

export interface MistakeRecord {
    failCount: number;
    lastFailedAt: number;
    successCount?: number;
}

export type AppState = 'WELCOME' | 'HISTORY' | 'QUIZ_SELECT' | 'QUIZ' | 'RESULTS' | 'DICTIONARY' | 'QUIZ_REVIEW' | 'QUIZ_BREAK' | 'WEAK_WORDS';
export type QuizMode = 'JP_TO_EN' | 'EN_TO_JP' | 'JP_TO_EN_DESC' | 'EN_TO_JP_DESC';
export type AppLang = 'en' | 'ja';
