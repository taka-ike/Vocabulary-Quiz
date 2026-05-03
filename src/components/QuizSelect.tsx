import React from 'react';
import { QuizMode } from '../types';
import { Translations } from '../translations';

interface QuizSelectProps {
    loc: Translations;
    quizRange: { start: number | ''; end: number | '' };
    setQuizRange: React.Dispatch<React.SetStateAction<{ start: number | ''; end: number | '' }>>;
    isRandomOrder: boolean;
    setIsRandomOrder: (val: boolean) => void;
    showAdvancedQuizOpts: boolean;
    setShowAdvancedQuizOpts: (val: boolean) => void;
    quizMaxCount: number | '';
    setQuizMaxCount: (val: number | '') => void;
    quizBreakInterval: number | '';
    setQuizBreakInterval: (val: number | '') => void;
    startQuiz: (mode: QuizMode) => void;
    resetApp: () => void;
}

const QuizSelect: React.FC<QuizSelectProps> = ({
    loc,
    quizRange,
    setQuizRange,
    isRandomOrder,
    setIsRandomOrder,
    showAdvancedQuizOpts,
    setShowAdvancedQuizOpts,
    quizMaxCount,
    setQuizMaxCount,
    quizBreakInterval,
    setQuizBreakInterval,
    startQuiz,
    resetApp
}) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            <div className="max-w-md w-full bg-white p-10 rounded-sm shadow-xl border border-slate-200 text-center">
                <div className="mb-10">
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-6">{loc.quiz_setup}</h2>
                    <p className="text-xl font-medium text-slate-900">{loc.config_quiz}</p>
                </div>

                <div className="mb-8 p-4 bg-slate-50 rounded-xl border border-slate-100 space-y-5">
                    <div>
                        <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">{loc.question_range}</label>
                        <div className="flex items-center gap-4">
                            <input
                                type="number"
                                value={quizRange.start}
                                min={1}
                                onChange={e => setQuizRange(p => ({ ...p, start: e.target.value === '' ? '' : parseInt(e.target.value) || 1 }))}
                                className="w-full text-center py-2 px-3 border border-slate-200 rounded-lg text-sm text-slate-900"
                            />
                            <span className="text-slate-400 font-semibold">{loc.to}</span>
                            <input
                                type="number"
                                value={quizRange.end}
                                min={1}
                                onChange={e => setQuizRange(p => ({ ...p, end: e.target.value === '' ? '' : parseInt(e.target.value) || 1 }))}
                                className="w-full text-center py-2 px-3 border border-slate-200 rounded-lg text-sm text-slate-900"
                            />
                        </div>
                    </div>

                    <div className="pt-2 flex items-center justify-center gap-3">
                        <input
                            type="checkbox"
                            id="randomize"
                            checked={isRandomOrder}
                            onChange={e => setIsRandomOrder(e.target.checked)}
                            className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                        />
                        <label htmlFor="randomize" className="text-sm font-semibold text-slate-700">{loc.randomize}</label>
                    </div>

                    <div className="pt-3 border-t border-slate-200">
                        <button
                            onClick={() => setShowAdvancedQuizOpts(!showAdvancedQuizOpts)}
                            className="w-full flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition"
                        >
                            <span>{loc.advanced_options}</span>
                            <span>{showAdvancedQuizOpts ? '-' : '+'}</span>
                        </button>

                        {showAdvancedQuizOpts && (
                            <div className="mt-5 space-y-5 animate-in fade-in slide-in-from-top-2 duration-200">
                                <div>
                                    <h3 className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-3">{loc.quiz_length}</h3>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div>
                                            <label className="text-[10px] text-slate-500 block mb-1 font-semibold">{loc.max_questions}</label>
                                            <input
                                                type="number"
                                                value={quizMaxCount}
                                                onChange={e => setQuizMaxCount(e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
                                                className="w-full text-center py-2 px-3 border border-slate-200 rounded-lg text-sm text-slate-900"
                                            />
                                        </div>
                                        <div>
                                            <label className="text-[10px] text-slate-500 block mb-1 font-semibold">{loc.break_every}</label>
                                            <input
                                                type="number"
                                                value={quizBreakInterval}
                                                onChange={e => setQuizBreakInterval(e.target.value === '' ? '' : parseInt(e.target.value) || 0)}
                                                className="w-full text-center py-2 px-3 border border-slate-200 rounded-lg text-sm text-slate-900"
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="space-y-4">
                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{loc.multiple_choice}</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => startQuiz('JP_TO_EN')}
                            className="py-4 border-2 border-indigo-600 bg-indigo-50 text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-100 transition-colors"
                        >
                            JP → EN
                        </button>
                        <button
                            onClick={() => startQuiz('EN_TO_JP')}
                            className="py-4 border border-slate-200 text-slate-600 bg-white rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
                        >
                            EN → JP
                        </button>
                    </div>

                    <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2 mt-4">{loc.descriptive}</label>
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            onClick={() => startQuiz('JP_TO_EN_DESC')}
                            className="py-4 border border-indigo-200 bg-white text-indigo-700 rounded-xl text-xs font-bold hover:bg-indigo-50 transition-colors"
                        >
                            JP → EN
                        </button>
                        <button
                            onClick={() => startQuiz('EN_TO_JP_DESC')}
                            className="py-4 border border-slate-200 bg-white text-slate-600 rounded-xl text-xs font-bold hover:bg-slate-50 transition-colors"
                        >
                            EN → JP
                        </button>
                    </div>
                </div>

                <button onClick={resetApp} className="mt-8 text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-slate-600 transition">
                    {loc.cancel}
                </button>
            </div>
        </div>
    );
};

export default QuizSelect;
