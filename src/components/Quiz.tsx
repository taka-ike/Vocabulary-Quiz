import React, { RefObject } from 'react';
import { BookOpen, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { VocabItem, Definition, QuizMode } from '../types';
import { Translations } from '../translations';
import { getBaseForms } from '../utils';

interface QuizProps {
    currentItem: VocabItem | undefined;
    quizMode: QuizMode;
    currentQuestionIdx: number;
    quizItems: VocabItem[];
    loc: Translations;
    selectedAnswer: string | null;
    isAnswerCorrect: boolean | null;
    quizInput: string;
    setQuizInput: (val: string) => void;
    handleAnswerSelect: (answer: string) => void;
    shuffledOptions: string[];
    definitions: Definition[];
    nextActionRef: RefObject<HTMLDivElement>;
    toggleStack: () => void;
    isAddedToStack: boolean;
    nextQuestion: () => void;
}

const Quiz: React.FC<QuizProps> = ({
    currentItem,
    quizMode,
    currentQuestionIdx,
    quizItems,
    loc,
    selectedAnswer,
    isAnswerCorrect,
    quizInput,
    setQuizInput,
    handleAnswerSelect,
    shuffledOptions,
    definitions,
    nextActionRef,
    toggleStack,
    isAddedToStack,
    nextQuestion
}) => {
    if (!currentItem) return null;

    const isJpToEn = quizMode === 'JP_TO_EN' || quizMode === 'JP_TO_EN_DESC';
    const isDescMode = quizMode.endsWith('_DESC');

    const hintTemplate = isJpToEn ? currentItem.japanese_text : currentItem.english_text;
    const hintParts = hintTemplate.split(/{{(.*?)}}/);

    const questionTemplate = isJpToEn ? currentItem.english_text : currentItem.japanese_text;
    const questionParts = questionTemplate.split(/{{(.*?)}}/);

    const options = shuffledOptions.length > 0 ? shuffledOptions : (isJpToEn ? currentItem.english_options : currentItem.japanese_options);

    const correctMatch = questionTemplate.match(/{{(.*?)}}/);
    const correctAnswer = correctMatch ? correctMatch[1].trim() : "";

    const targetWordENOriginal = currentItem.english_text.match(/{{(.*?)}}/)?.[1] || '';
    const cleanWord = (w: string) => w.toLowerCase().replace(/[^a-z0-9]/g, '');
    const cleanTargetEN = cleanWord(targetWordENOriginal);
    const targetBases = getBaseForms(cleanTargetEN);

    const activeDef = definitions.find(d => {
        const cd = cleanWord(d.english_word);
        if (!cd) return false;
        const defBases = getBaseForms(cd);
        return targetBases.some(tb => defBases.includes(tb)) ||
            (cd.length > 4 && cleanTargetEN.includes(cd)) ||
            (cleanTargetEN.length > 4 && cd.includes(cleanTargetEN));
    });

    return (
        <div className="max-w-2xl mx-auto py-12 px-4 min-h-[80vh] flex flex-col">
            <div className="p-6 sm:p-10 bg-slate-50 rounded-2xl border border-slate-100 space-y-8 flex-1 flex flex-col">
                <div className="text-center space-y-4 flex-1 flex flex-col justify-center">
                    <span className="text-[11px] font-bold text-indigo-500 uppercase tracking-widest">
                        {loc.question_x_of_y.replace('{x}', (currentQuestionIdx + 1).toString()).replace('{y}', quizItems.length.toString())}
                    </span>

                    <div className="text-center mb-2">
                        <span className="text-slate-400 text-sm uppercase tracking-wider font-semibold">{loc.translate_idea}</span>
                        <span className="font-reading text-slate-600 block mt-2 text-xl leading-relaxed">
                            {hintParts.map((part, idx) =>
                                idx % 2 === 1
                                    ? <span key={idx} className="text-red-500 font-bold border-b border-red-200 px-1 mx-1">{part}</span>
                                    : <span key={idx}>{part}</span>
                            )}
                        </span>
                    </div>

                    <div className="text-2xl sm:text-3xl font-reading font-medium text-slate-900 leading-relaxed max-w-lg mx-auto">
                        {questionParts.map((part, idx) => {
                            if (idx % 2 === 1) {
                                let blankClasses = 'border-slate-300';
                                if (selectedAnswer !== null) {
                                    blankClasses = isAnswerCorrect ? 'border-indigo-500 text-indigo-600' : 'border-red-500 text-red-600';
                                }

                                if (isDescMode) {
                                    return (
                                        <span key={`${currentItem.id}-${idx}-desc`} className={`inline-block border-b-2 mx-2 px-4 pb-1 min-w-[120px] text-center ${blankClasses} align-bottom`}>
                                            {selectedAnswer !== null ? (
                                                isAnswerCorrect ? (
                                                    <span className="text-indigo-600 relative top-1">{part}</span>
                                                ) : (
                                                    <span className="inline-flex flex-col items-center justify-end leading-tight bottom-0 relative">
                                                        <span className="text-red-500 line-through text-xs mb-1 opacity-70 whitespace-nowrap">{selectedAnswer}</span>
                                                        <span className="text-indigo-600 font-bold whitespace-nowrap">{part}</span>
                                                    </span>
                                                )
                                            ) : (
                                                <input
                                                    type="text"
                                                    value={quizInput}
                                                    autoFocus
                                                    onChange={(e) => setQuizInput(e.target.value)}
                                                    onKeyDown={(e) => e.key === 'Enter' && handleAnswerSelect(quizInput)}
                                                    className="bg-transparent text-slate-900 placeholder-slate-400 text-center focus:outline-none w-full"
                                                    placeholder="..."
                                                />
                                            )}
                                        </span>
                                    )
                                }

                                return (
                                    <span key={idx} className={`inline-block border-b-2 mx-2 px-4 pb-1 min-w-[80px] text-center transition-colors ${blankClasses} ${selectedAnswer === null ? 'text-transparent' : ''}`}>
                                        {selectedAnswer !== null ? part : '________'}
                                    </span>
                                );
                            }
                            return <span key={idx}>{part}</span>;
                        })}
                    </div>
                </div>

                {!isDescMode ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-auto">
                        {options.map((opt, idx) => {
                            let btnClass = "bg-white border border-slate-200 text-slate-700 hover:border-indigo-400 hover:bg-slate-50";

                            if (selectedAnswer !== null) {
                                if (opt === correctAnswer) {
                                    btnClass = "bg-indigo-50 border border-indigo-500 text-indigo-700 font-medium";
                                } else if (opt === selectedAnswer && !isAnswerCorrect) {
                                    btnClass = "bg-red-50 border border-red-500 text-red-700 font-medium";
                                } else {
                                    btnClass = "bg-white border border-slate-200 text-slate-400 opacity-50 cursor-not-allowed";
                                }
                            }

                            return (
                                <button
                                    key={idx}
                                    disabled={selectedAnswer !== null}
                                    onClick={() => handleAnswerSelect(opt)}
                                    className={`p-4 rounded-xl text-sm transition-all duration-200 ${btnClass} flex items-center justify-between text-left`}
                                >
                                    <span className="font-medium text-base">{String.fromCharCode(97 + idx)}) {opt}</span>
                                    {selectedAnswer !== null && opt === correctAnswer && <CheckCircle2 size={18} className="text-indigo-600" />}
                                    {selectedAnswer === opt && !isAnswerCorrect && <XCircle size={18} className="text-red-500" />}
                                </button>
                            )
                        })}
                    </div>
                ) : (
                    selectedAnswer === null && (
                        <div className="mt-auto">
                            <button
                                onClick={() => handleAnswerSelect(quizInput)}
                                className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-lg"
                            >
                                {loc.check_answer} <ArrowRight size={18} />
                            </button>
                        </div>
                    )
                )}
            </div>

            {selectedAnswer !== null && (
                <div className="mt-6 flex flex-col gap-3" ref={nextActionRef}>
                    {activeDef && (
                        <div className="bg-indigo-50 border border-indigo-100 p-4 rounded-xl flex items-start gap-4">
                            <BookOpen className="text-indigo-500 mt-1 shrink-0" size={20} />
                            <div>
                                <div className="font-bold text-indigo-900">{activeDef.english_word} <span className="text-xs text-indigo-500 font-medium italic ml-2">{activeDef.part_of_speech}</span></div>
                                <div className="text-indigo-700 text-sm mt-1">{activeDef.japanese_meaning}</div>
                            </div>
                        </div>
                    )}

                    <div className="flex gap-2">
                        <button
                            onClick={toggleStack}
                            className={`flex-1 py-4 border rounded-2xl font-bold transition-colors flex items-center justify-center gap-2 ${isAddedToStack ? 'bg-indigo-600 border-indigo-600 text-white' : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'}`}
                        >
                            {isAddedToStack ? loc.saved_to_review : loc.keep_for_review}
                        </button>
                        <button
                            onClick={nextQuestion}
                            className="flex-[2] py-4 bg-slate-900 text-white rounded-2xl font-bold hover:bg-black transition-colors shadow-lg shadow-slate-200 flex items-center justify-center gap-2"
                        >
                            {currentQuestionIdx < quizItems.length - 1 ? loc.next_question : loc.view_results} <ArrowRight size={18} />
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Quiz;
