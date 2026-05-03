import React from 'react';
import { CheckCircle2 } from 'lucide-react';
import { VocabItem, AppState } from '../types';
import { Translations } from '../translations';

interface ResultsProps {
    score: number;
    quizItems: VocabItem[];
    loc: Translations;
    startQuizModeSelection: () => void;
    failedItems: VocabItem[];
    retryMistakes: () => void;
    setAppState: (state: AppState) => void;
    fullQuizReviewHistory: VocabItem[];
    startReview: (returnTo: AppState, useFullHistory: boolean) => void;
}

const Results: React.FC<ResultsProps> = ({
    score,
    quizItems,
    loc,
    startQuizModeSelection,
    failedItems,
    retryMistakes,
    setAppState,
    fullQuizReviewHistory,
    startReview
}) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            <div className="bg-white rounded-sm shadow-xl border border-slate-200 p-12 max-w-md w-full text-center relative">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle2 size={40} />
                </div>
                <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-4">{loc.quiz_complete}</h2>

                <div className="flex justify-center items-end gap-2 my-8">
                    <span className="text-6xl font-medium text-slate-900 tracking-tighter">{score}</span>
                    <span className="text-2xl text-slate-400 mb-1">/ {quizItems.length}</span>
                </div>

                <p className="text-slate-500 mb-10 text-sm text-balance">
                    {score === quizItems.length ? loc.perfect :
                        score > quizItems.length / 2 ? loc.great :
                            loc.good}
                </p>

                <div className="flex flex-col gap-4">
                    <button
                        onClick={() => startQuizModeSelection()}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black shadow-lg shadow-slate-200 transition-colors"
                    >
                        {loc.new_quiz}
                    </button>

                    {failedItems.length > 0 && (
                        <button
                            onClick={retryMistakes}
                            className="w-full py-4 bg-red-50 text-red-600 rounded-2xl font-bold hover:bg-red-100 shadow-sm border border-red-100 transition-colors"
                        >
                            {loc.retry_mistakes.replace('{n}', failedItems.length.toString())}
                        </button>
                    )}

                    <button
                        onClick={() => setAppState('HISTORY')}
                        className="w-full py-4 bg-white text-slate-900 border border-slate-200 rounded-2xl font-medium hover:bg-slate-50 transition-colors"
                    >
                        {loc.back_home}
                    </button>

                    {fullQuizReviewHistory.length > 0 && (
                        <button
                            onClick={() => startReview('RESULTS', true)}
                            className="w-full py-4 bg-orange-50 text-orange-600 rounded-2xl font-bold hover:bg-orange-100 shadow-sm border border-orange-100 transition-colors flex items-center justify-center gap-2"
                        >
                            {loc.practice_saved.replace('{n}', fullQuizReviewHistory.length.toString())}
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Results;
