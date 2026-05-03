import React from 'react';
import { CheckCircle } from 'lucide-react';
import { VocabItem, MistakeRecord, Definition } from '../types';
import { Translations } from '../translations';

interface WeakWordsProps {
    mistakeHistory: Record<number, MistakeRecord>;
    vocabularyList: VocabItem[];
    loc: Translations;
    setMistakeHistory: (val: Record<number, MistakeRecord>) => void;
    startQuizFromWeakWords: (items: VocabItem[]) => void;
    definitions: Definition[];
}

const WeakWords: React.FC<WeakWordsProps> = ({
    mistakeHistory,
    vocabularyList,
    loc,
    setMistakeHistory,
    startQuizFromWeakWords,
    definitions
}) => {
    const sortedMistakes = Object.entries(mistakeHistory)
        .map(([idStr, record]) => ({ id: parseInt(idStr), ...record }))
        .filter(record => record.failCount > 0)
        .sort((a, b) => b.failCount - a.failCount || b.lastFailedAt - a.lastFailedAt);

    const handleQuizWeakWords = () => {
        const itemsToQuiz = sortedMistakes
            .map(record => vocabularyList.find(v => v.id === record.id))
            .filter((item): item is VocabItem => item !== undefined);
        startQuizFromWeakWords(itemsToQuiz);
    };

    const renderTextWithTarget = (text: string) => {
        const parts = text.split(/({{[^}]+}})/g);
        return (
            <>
                {parts.map((part, i) => {
                    if (part.startsWith('{{') && part.endsWith('}}')) {
                        return <span key={i} className="text-red-500 font-bold">{part.slice(2, -2)}</span>;
                    }
                    return <span key={i}>{part}</span>;
                })}
            </>
        );
    };

    return (
        <div className="max-w-4xl mx-auto py-12 px-4 sm:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight text-slate-900 mb-2">{loc.mistake_history}</h2>
                </div>
                <div className="flex gap-4 w-full sm:w-auto">
                    {sortedMistakes.length > 0 && (
                        <>
                            <button
                                onClick={() => {
                                    if (confirm(loc.clear_mistakes_confirm)) {
                                        setMistakeHistory({});
                                    }
                                }}
                                className="flex-1 sm:flex-none px-4 py-2 border border-red-200 text-red-600 rounded-lg text-sm font-semibold hover:bg-red-50 transition"
                            >
                                {loc.clear_mistakes}
                            </button>
                            <button
                                onClick={handleQuizWeakWords}
                                className="flex-1 sm:flex-none px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition"
                            >
                                {loc.quiz_weak_words}
                            </button>
                        </>
                    )}
                </div>
            </div>

            {sortedMistakes.length === 0 ? (
                <div className="text-center py-24 bg-slate-50 border border-slate-100 rounded-2xl">
                    <CheckCircle className="mx-auto h-12 w-12 text-slate-300 mb-4" />
                    <h3 className="text-lg font-medium text-slate-900">{loc.no_mistakes}</h3>
                </div>
            ) : (
                <div className="bg-white border text-sm border-slate-200 rounded-2xl shadow-sm overflow-x-auto">
                    <div className="min-w-[600px]">
                        <div className="grid grid-cols-12 bg-slate-50 border-b border-slate-200 font-semibold text-slate-500 uppercase tracking-wider text-[10px] py-4 px-6 gap-4">
                            <div className="col-span-1">ID</div>
                            <div className="col-span-3">{loc.en_text}</div>
                            <div className="col-span-3">{loc.ja_text}</div>
                            <div className="col-span-3">{loc.dictionary}</div>
                            <div className="col-span-2 text-right">{loc.mistake_history}</div>
                        </div>
                        <div className="divide-y divide-slate-100 max-h-[60vh] overflow-y-auto">
                            {sortedMistakes.map(record => {
                                const item = vocabularyList.find(v => v.id === record.id);
                                if (!item) return null;
                                const d = new Date(record.lastFailedAt);
                                return (
                                    <div key={record.id} className="grid grid-cols-12 py-4 px-6 gap-4 items-center hover:bg-slate-50 transition min-h-[64px]">
                                        <div className="col-span-1 font-mono text-slate-400">{item.id}</div>
                                        <div className="col-span-3 font-medium text-slate-900 leading-snug">{renderTextWithTarget(item.english_text)}</div>
                                        <div className="col-span-3 text-slate-600 leading-snug">{renderTextWithTarget(item.japanese_text)}</div>
                                        <div className="col-span-3 text-slate-500 text-xs">
                                            {(() => {
                                                const match = item.english_text.match(/{{(.*?)}}/);
                                                if (!match) return <span className="text-slate-300">-</span>;
                                                const target = match[1].trim().toLowerCase();
                                                const def = definitions.find(d => d.english_word.toLowerCase() === target);
                                                return def ? (
                                                    <div>
                                                        <span className="font-semibold text-slate-700 block">{def.english_word}</span>
                                                        <span className="text-[10px] text-slate-400 inline-block mr-1">[{def.part_of_speech}]</span>
                                                        <span className="text-slate-600">{def.japanese_meaning}</span>
                                                    </div>
                                                ) : <span className="text-slate-300">-</span>;
                                            })()}
                                        </div>
                                        <div className="col-span-2 text-right flex flex-col items-end gap-1">
                                            <span className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-[10px] font-medium text-red-700 ring-1 ring-inset ring-red-600/10 whitespace-nowrap">
                                                {loc.times_failed.replace('{n}', record.failCount.toString())}
                                            </span>
                                            <div className="w-full flex justify-end gap-[3px] mt-1 items-center" title={`${record.successCount || 0} / 5`}>
                                                {[...Array(5)].map((_, i) => (
                                                    <div key={i} className={`w-2 h-1.5 rounded-sm transition-colors ${(record.successCount || 0) > i ? 'bg-green-500 shadow-[0_0_4px_rgba(34,197,94,0.4)]' : 'bg-slate-200'}`} />
                                                ))}
                                            </div>
                                            <span className="text-[10px] text-slate-400 whitespace-nowrap mt-0.5">{loc.last_failed.replace('{d}', `${d.getMonth() + 1}/${d.getDate()} ${d.getHours().toString().padStart(2, '0')}:${d.getMinutes().toString().padStart(2, '0')}`)}</span>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default WeakWords;
