import React, { RefObject, memo } from 'react';
import { BookOpen, Download, Upload, Trash2, Plus, Edit2 } from 'lucide-react';
import { Definition } from '../types';
import { Translations } from '../translations';
import { exportData } from '../utils';

interface DictionaryProps {
    definitions: Definition[];
    loc: Translations;
    importDictRef: RefObject<HTMLInputElement>;
    handleImportDict: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleClearDictData: () => void;
    setAddingDef: (val: Definition) => void;
    setEditingDef: (val: Definition) => void;
    deleteDef: (id: string) => void;
}

const DictItemRow = memo(({ def, onEdit, onDelete }: { 
    def: Definition, 
    onEdit: (def: Definition) => void, 
    onDelete: (id: string) => void 
}) => {
    return (
        <div className="border border-slate-200 rounded-xl p-5 hover:shadow-md transition-shadow relative group bg-white flex justify-between">
            <div className="flex-1">
                <h3 className="font-bold font-reading text-slate-900 text-lg">{def.english_word} <span className="text-xs text-indigo-500 font-sans font-medium italic ml-2">{def.part_of_speech}</span></h3>
                <p className="text-sm font-medium text-slate-600 mt-1">{def.japanese_meaning}</p>
            </div>
            <div className="flex items-center gap-3">
                <button
                    onClick={() => onEdit(def)}
                    className="p-3 text-slate-400 hover:text-indigo-600 bg-white hover:bg-slate-50 rounded-xl transition-colors"
                >
                    <Edit2 size={18} />
                </button>
                <button
                    onClick={() => onDelete(def.id)}
                    className="p-3 text-slate-400 hover:text-red-600 bg-white hover:bg-red-50 rounded-xl transition-colors"
                >
                    <Trash2 size={18} />
                </button>
            </div>
        </div>
    );
});

const Dictionary: React.FC<DictionaryProps> = ({
    definitions,
    loc,
    importDictRef,
    handleImportDict,
    handleClearDictData,
    setAddingDef,
    setEditingDef,
    deleteDef
}) => {
    return (
        <div className="max-w-4xl mx-auto py-10 px-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4">
                <div>
                    <h2 className="text-xs font-bold uppercase tracking-widest text-slate-400">{loc.dict_database}</h2>
                    <div className="flex items-center gap-2 mt-2">
                        <span className="flex h-2 w-2 rounded-full bg-indigo-500"></span>
                        <span className="text-[11px] text-slate-500 uppercase tracking-wider font-semibold">{loc.defs_saved.replace('{n}', definitions.length.toString())}</span>
                    </div>
                </div>
                <div className="flex flex-wrap gap-2 justify-end">
                    <input
                        type="file"
                        accept=".json"
                        className="hidden"
                        ref={importDictRef}
                        onChange={handleImportDict}
                    />
                    <button
                        onClick={handleClearDictData}
                        className="text-red-500 hover:text-red-700 px-3 py-3 rounded-xl border border-transparent hover:bg-red-50 hover:border-red-100 transition text-sm flex items-center justify-center"
                        title={loc.clear_data}
                    >
                        <Trash2 size={18} />
                    </button>
                    <button
                        onClick={() => exportData(definitions, 'dictionary_database.json')}
                        className="text-slate-500 hover:text-slate-900 px-3 py-3 rounded-xl border border-transparent hover:border-slate-200 transition text-sm flex items-center justify-center"
                        title="Export to JSON"
                    >
                        <Download size={18} /> {loc.export}
                    </button>

                    <button
                        onClick={() => importDictRef.current?.click()}
                        className="text-slate-500 hover:text-slate-900 px-3 py-3 rounded-xl border border-transparent hover:border-slate-200 transition text-sm flex items-center justify-center"
                        title="Import from JSON"
                    >
                        <Upload size={18} /> {loc.import}
                    </button>

                    <button
                        onClick={() => setAddingDef({ id: '', english_word: '', part_of_speech: '', japanese_meaning: '' })}
                        className="bg-slate-900 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-black transition shadow-lg shadow-slate-200 text-sm disabled:opacity-50"
                    >
                        <Plus size={16} /> {loc.add_def}
                    </button>
                </div>
            </div>

            <div className="bg-white shadow-xl rounded-sm border border-slate-200 p-6 sm:p-10 relative min-h-[400px]">
                {definitions.length === 0 ? (
                    <div className="text-center text-slate-400 py-20 flex flex-col items-center">
                        <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4"><BookOpen size={24} className="text-slate-300" /></div>
                        {loc.empty_dict}<br />{loc.empty_dict_sub}
                    </div>
                ) : (
                    <div className="space-y-4">
                        {definitions.map(def => (
                            <DictItemRow 
                                key={def.id} 
                                def={def} 
                                onEdit={setEditingDef} 
                                onDelete={deleteDef} 
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dictionary;
