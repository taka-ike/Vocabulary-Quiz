import React, { RefObject } from 'react';
import { Upload, BookOpen, ArrowRight } from 'lucide-react';
import { VocabItem, Definition } from '../types';
import { Translations } from '../translations';

interface WelcomeProps {
    vocabularyList: VocabItem[];
    definitions: Definition[];
    loc: Translations;
    importVocabRef: RefObject<HTMLInputElement>;
    importDictRef: RefObject<HTMLInputElement>;
    handleImportVocab: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleImportDict: (e: React.ChangeEvent<HTMLInputElement>) => void;
    setAppState: (state: any) => void;
}

const Welcome: React.FC<WelcomeProps> = ({
    vocabularyList,
    definitions,
    loc,
    importVocabRef,
    importDictRef,
    handleImportVocab,
    handleImportDict,
    setAppState
}) => {
    return (
        <div className="flex flex-col items-center justify-center min-h-[70vh] px-4">
            <div className="max-w-md w-full bg-white p-10 rounded-xl shadow-xl border border-slate-200 text-center relative overflow-hidden">
                <div className="w-20 h-20 bg-indigo-50 text-indigo-600 rounded-2xl flex items-center justify-center mx-auto mb-8 shadow-sm border border-indigo-100">
                    <BookOpen size={40} />
                </div>
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 mb-2">{loc.welcome_title}</h2>
                <p className="text-slate-500 mb-10 text-sm text-balance">
                    {loc.welcome_subtitle}
                </p>

                <div className="flex flex-col gap-4">
                    <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        ref={importVocabRef}
                        onChange={handleImportVocab}
                    />
                    <button
                        onClick={() => vocabularyList.length === 0 && importVocabRef.current?.click()}
                        className={`w-full py-4 border rounded-2xl font-bold flex items-center justify-center gap-2 transition shadow-sm text-sm ${vocabularyList.length > 0 ? 'bg-indigo-50 text-indigo-700 border-indigo-200 cursor-default' : 'bg-white text-slate-900 border-slate-200 hover:bg-slate-50'}`}
                    >
                        <Upload size={18} className={vocabularyList.length > 0 ? 'text-indigo-400' : 'text-indigo-600'} /> {vocabularyList.length > 0 ? loc.import_completed : loc.import_vocab}
                    </button>

                    <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        ref={importDictRef}
                        onChange={handleImportDict}
                    />
                    <button
                        onClick={() => definitions.length === 0 && importDictRef.current?.click()}
                        className={`w-full py-4 border rounded-2xl font-bold flex items-center justify-center gap-2 transition shadow-sm text-sm ${definitions.length > 0 ? 'bg-indigo-50 text-indigo-700 border-indigo-200 cursor-default' : 'bg-white text-slate-900 border-slate-200 hover:bg-slate-50'}`}
                    >
                        <Upload size={18} className={definitions.length > 0 ? 'text-indigo-400' : 'text-indigo-600'} /> {definitions.length > 0 ? loc.import_completed : loc.import_dict}
                    </button>

                    <div className="h-4 border-b border-slate-100 mt-2 mb-4 relative">
                        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-white px-4 text-xs font-semibold text-slate-400 uppercase tracking-widest">OR</span>
                    </div>

                    <button
                        onClick={() => setAppState('HISTORY')}
                        className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors shadow-lg shadow-slate-200 text-sm"
                    >
                        {loc.continue_to_app} <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Welcome;
