import React from 'react';
import { CheckCircle2, ArrowRight } from 'lucide-react';
import { VocabItem, QuizMode } from '../types';

interface ReviewProps {
    currentReviewItem: VocabItem | undefined;
    quizMode: QuizMode;
    reviewIdx: number;
    reviewSessionItems: VocabItem[];
    isReviewRevealed: boolean;
    reviewInput: string;
    setReviewInput: (val: string) => void;
    handleReviewCheck: () => void;
    nextReviewQuestion: () => void;
}

const Review: React.FC<ReviewProps> = ({
    currentReviewItem,
    quizMode,
    reviewIdx,
    reviewSessionItems,
    isReviewRevealed,
    reviewInput,
    setReviewInput,
    handleReviewCheck,
    nextReviewQuestion
}) => {
    if (!currentReviewItem) return null;

    const isJpToEn = quizMode === 'JP_TO_EN' || quizMode === 'JP_TO_EN_DESC';
    const hintTemplate = isJpToEn ? currentReviewItem.japanese_text : currentReviewItem.english_text;
    const hintParts = hintTemplate.split(/{{(.*?)}}/);

    const questionTemplate = isJpToEn ? currentReviewItem.english_text : currentReviewItem.japanese_text;
    const questionParts = questionTemplate.split(/{{(.*?)}}/);

    const correctMatch = questionTemplate.match(/{{(.*?)}}/);
    const correctAnswer = correctMatch ? correctMatch[1].trim() : "";

    return (
        <div className="max-w-2xl mx-auto py-12 px-4 min-h-[80vh] flex flex-col">
            <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400 mb-8 sm:mb-8">Descriptive Review</h2>

            <div className="p-6 sm:p-10 bg-slate-50 rounded-2xl border border-slate-100 space-y-8 flex-1 flex flex-col">
                <div className="text-center space-y-6 flex-1 flex flex-col justify-center">
                    <div className="space-y-4">
                        <span className="text-[11px] font-bold text-orange-500 uppercase tracking-widest">
                            Review {reviewIdx + 1} of {reviewSessionItems.length}
                        </span>

                        <div className="text-center mb-2">
                            <span className="text-slate-400 text-sm uppercase tracking-wider font-semibold">Translate this idea:</span>
                            <span className="font-reading text-slate-600 block mt-2 text-xl leading-relaxed">
                                {hintParts.map((part, idx) =>
                                    idx % 2 === 1
                                        ? <span key={idx} className="text-red-500 font-bold border-b border-red-200 px-1 mx-1">{part}</span>
                                        : <span key={idx}>{part}</span>
                                )}
                            </span>
                        </div>
                    </div>

                    <div className="text-2xl sm:text-3xl font-reading font-medium text-slate-900 leading-relaxed max-w-lg mx-auto">
                        {questionParts.map((part, idx) => {
                            if (idx % 2 === 1) {
                                return (
                                    <span key={idx} className="inline-block border-b-2 border-slate-300 mx-2 px-4 pb-1 min-w-[120px] text-center">
                                        {isReviewRevealed ? (
                                            <span className="text-indigo-600">{part}</span>
                                        ) : (
                                            <input
                                                type="text"
                                                value={reviewInput}
                                                autoFocus
                                                onChange={(e) => setReviewInput(e.target.value)}
                                                onKeyDown={(e) => e.key === 'Enter' && handleReviewCheck()}
                                                className="bg-transparent text-center focus:outline-none w-full"
                                                placeholder="..."
                                            />
                                        )}
                                    </span>
                                );
                            }
                            return <span key={idx}>{part}</span>;
                        })}
                    </div>
                </div>

                <div className="mt-auto pt-6 border-t border-slate-200">
                    {!isReviewRevealed ? (
                        <button
                            onClick={handleReviewCheck}
                            className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold transition-all flex items-center justify-center gap-2"
                        >
                            Reveal Answer <CheckCircle2 size={18} />
                        </button>
                    ) : (
                        <div className="space-y-4">
                            <div className="text-center">
                                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Your Input</p>
                                <p className={`text-xl font-reading font-bold ${reviewInput.trim().toLowerCase() === correctAnswer.toLowerCase() ? 'text-green-600' : 'text-red-500'}`}>
                                    {reviewInput || '(empty)'}
                                </p>
                            </div>
                            <button
                                onClick={nextReviewQuestion}
                                className="w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all flex items-center justify-center gap-2"
                            >
                                {reviewIdx < reviewSessionItems.length - 1 ? 'Next Review' : 'Back to Results'} <ArrowRight size={18} />
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Review;
