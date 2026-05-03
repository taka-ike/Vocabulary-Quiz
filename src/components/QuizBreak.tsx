import React from 'react';
import { ArrowRight } from 'lucide-react';
import { VocabItem, AppState } from '../types';
import { Translations } from '../translations';

interface QuizBreakProps {
    loc: Translations;
    currentQuestionIdx: number;
    quizItems: VocabItem[];
    score: number;
    advanceToNextQuestion: () => void;
    reviewStack: VocabItem[];
    fullQuizReviewHistory: VocabItem[];
    startReview: (returnTo: AppState, useFullHistory?: boolean) => void;
    setAppState: (state: AppState) => void;
}

const QuizBreak: React.FC<QuizBreakProps> = ({
    loc,
    currentQuestionIdx,
    quizItems,
    score,
    advanceToNextQuestion,
    reviewStack,
    fullQuizReviewHistory,
    startReview,
    setAppState
}) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            <div className="bg-white rounded-sm shadow-xl border border-slate-200 p-12 max-w-md w-full text-center relative">
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">{loc.quiz_paused}</h2>
                <p className="text-xl font-medium text-slate-900 mb-6">{loc.break_time}</p>

                <div className="flex flex-col gap-2 mb-8">
                    <p className="text-sm text-slate-500">{loc.progress} <span className="font-bold text-slate-900">{currentQuestionIdx + 1} / {quizItems.length}</span></p>
                    <p className="text-sm text-slate-500">{loc.current_score} <span className="font-bold text-slate-900">{score}</span></p>
                </div>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={advanceToNextQuestion}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black shadow-lg shadow-slate-200 transition-colors flex items-center justify-center gap-2"
                    >
                        {loc.continue_quiz} <ArrowRight size={18} />
                    </button>

                    {fullQuizReviewHistory.length > 0 && (
                        <button
                            onClick={() => startReview('QUIZ_BREAK', true)}
                            className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 shadow-sm border border-red-100 transition-colors flex items-center justify-center gap-2"
                        >
                            {loc.retry_mistakes.replace('{n}', fullQuizReviewHistory.length.toString())}
                        </button>
                    )}

                    {reviewStack.length > 0 && (
                        <button
                            onClick={() => startReview('QUIZ_BREAK')}
                            className="w-full py-4 bg-orange-50 text-orange-600 rounded-2xl font-bold hover:bg-orange-100 shadow-sm border border-orange-100 transition-colors flex items-center justify-center gap-2"
                        >
                            {loc.practice_saved.replace('{n}', reviewStack.length.toString())}
                        </button>
                    )}

                    <button
                        onClick={() => setAppState('RESULTS')}
                        className="w-full py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-medium hover:bg-slate-50 transition-colors mt-4"
                    >
                        {loc.end_quiz_now}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default QuizBreak;
