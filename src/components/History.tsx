import React, { RefObject, memo } from 'react';
import { Upload, BookOpen, ArrowRight, Trash2, Download, Plus, Edit2 } from 'lucide-react';
import { VocabItem } from '../types';
import { Translations } from '../translations';
import { exportData } from '../utils';

interface HistoryProps {
    vocabularyList: VocabItem[];
    loc: Translations;
    importVocabRef: RefObject<HTMLInputElement>;
    handleImportVocab: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleClearVocabData: () => void;
    setAddingVocab: (item: VocabItem) => void;
    setEditingItem: (item: VocabItem) => void;
    deleteItem: (id: number) => void;
    startQuizModeSelection: () => void;
}

const highlightWord = (text: string) => {
    const parts = text.split(/{{(.*?)}}/);
    return parts.map((part, index) =>
        index % 2 === 1 ? <span key={index} className="bg-red-50 text-red-600 border border-red-200 px-1 rounded">{part}</span> : part
    );
};

const VocabItemRow = memo(({ item, type, onEdit, onDelete }: { 
    item: VocabItem, 
    type: 'en' | 'ja', 
    onEdit?: (item: VocabItem) => void, 
    onDelete?: (id: number) => void 
}) => {
    if (type === 'en') {
        return (
            <div className="group relative border-b border-slate-100 pb-2">
                <p className="text-lg font-reading">
                    <span className="text-slate-400 mr-2 text-sm">{item.id}.</span> {highlightWord(item.english_text)}
                </p>
            </div>
        );
    }
    return (
        <div className="group relative flex justify-between border-b border-slate-100 pb-2">
            <p className="text-lg pr-12">
                <span className="text-slate-400 mr-2 text-sm">{item.id}.</span> {highlightWord(item.japanese_text)}
            </p>
            <div className="absolute right-0 top-1 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 bg-white pl-2">
                <button onClick={() => onEdit?.(item)} className="text-slate-400 hover:text-indigo-600"><Edit2 size={16} /></button>
                <button onClick={() => onDelete?.(item.id)} className="text-slate-400 hover:text-red-600"><Trash2 size={16} /></button>
            </div>
        </div>
    );
});

const History: React.FC<HistoryProps> = ({
    vocabularyList,
    loc,
    importVocabRef,
    handleImportVocab,
    handleClearVocabData,
    setAddingVocab,
    setEditingItem,
    deleteItem,
    startQuizModeSelection
}) => {
    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">{loc.history_title}</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
                        <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">{loc.total_items.replace('{n}', vocabularyList.length.toString())}</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 mt-4 sm:mt-0 justify-end">
                    <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        ref={importVocabRef}
                        onChange={handleImportVocab}
                    />
                    <button
                        onClick={handleClearVocabData}
                        className="text-red-500 hover:text-red-700 px-3 py-3 rounded-xl border border-transparent hover:bg-red-50 hover:border-red-100 transition text-sm flex items-center justify-center"
                        title={loc.clear_data}
                    >
                        <Trash2 size={18} />
                    </button>

                    <button
                        onClick={() => exportData(vocabularyList, 'vocab_history.json')}
                        className="text-slate-500 hover:text-slate-900 px-3 py-3 rounded-xl border border-transparent hover:border-slate-200 transition text-sm flex items-center justify-center"
                        title="Export to JSON"
                    >
                        <Download size={18} /> {loc.export}
                    </button>

                    <button
                        onClick={() => importVocabRef.current?.click()}
                        className="text-slate-500 hover:text-slate-900 px-3 py-3 rounded-xl border border-transparent hover:border-slate-200 transition text-sm flex items-center justify-center"
                        title="Import from JSON"
                    >
                        <Upload size={18} /> {loc.import}
                    </button>

                    <button
                        onClick={() => setAddingVocab({ id: 0, english_text: '', japanese_text: '', english_options: [], japanese_options: [] })}
                        className="bg-white text-indigo-700 border border-indigo-200 px-4 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-indigo-50 transition shadow-sm text-sm"
                    >
                        <Plus size={16} /> {loc.add_vocab}
                    </button>

                    <button
                        onClick={startQuizModeSelection}
                        className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition shadow-lg shadow-slate-200 text-sm disabled:opacity-50"
                        disabled={vocabularyList.length === 0}
                    >
                        {loc.quiz} <ArrowRight size={16} />
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-xl rounded-sm border border-slate-200 p-6 sm:p-10 relative min-h-[400px]">
                {vocabularyList.length === 0 ? (
                    <div className="text-center text-slate-400 py-20 flex flex-col items-center">
                        <BookOpen size={48} className="text-slate-200 mb-4" />
                        <p className="mb-2">{loc.empty_history}</p>
                        <p className="text-sm">{loc.empty_history_sub}</p>
                    </div>
                ) : (
                    <>
                        <div className="absolute left-[40px] top-0 bottom-0 w-px bg-red-100 hidden sm:block"></div>
                        <div className="absolute left-[42px] top-0 bottom-0 w-px bg-red-100 hidden sm:block"></div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10 h-full sm:pl-10 relative z-10">
                            <div className="space-y-6">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest sm:mb-4">{loc.en_col}</h3>
                                {vocabularyList.map((item) => (
                                    <VocabItemRow key={item.id} item={item} type="en" />
                                ))}
                            </div>

                            <div className="space-y-6">
                                <h3 className="text-[10px] font-bold text-slate-400 uppercase tracking-widest sm:mb-4">{loc.ja_col}</h3>
                                {vocabularyList.map((item) => (
                                    <VocabItemRow 
                                        key={item.id} 
                                        item={item} 
                                        type="ja" 
                                        onEdit={setEditingItem} 
                                        onDelete={deleteItem} 
                                    />
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default History;
