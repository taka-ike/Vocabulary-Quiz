import React from 'react';
import { X, Save, Plus, BookOpen } from 'lucide-react';
import { VocabItem, Definition } from '../types';
import { Translations } from '../translations';

interface ModalsProps {
    editingItem: VocabItem | null;
    setEditingItem: (val: VocabItem | null) => void;
    saveEdit: () => void;
    addingVocab: VocabItem | null;
    setAddingVocab: (val: VocabItem | null) => void;
    saveNewVocab: () => void;
    addingDef: Definition | null;
    setAddingDef: (val: Definition | null) => void;
    saveNewDef: () => void;
    editingDef: Definition | null;
    setEditingDef: (val: Definition | null) => void;
    saveEditDef: () => void;
    loc: Translations;
}

const Modals: React.FC<ModalsProps> = ({
    editingItem,
    setEditingItem,
    saveEdit,
    addingVocab,
    setAddingVocab,
    saveNewVocab,
    addingDef,
    setAddingDef,
    saveNewDef,
    editingDef,
    setEditingDef,
    saveEditDef,
    loc
}) => {
    return (
        <>
            {editingItem && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-sm shadow-2xl border border-slate-200 max-w-lg w-full p-8 relative flex flex-col max-h-[90vh]">
                        <button onClick={() => setEditingItem(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X size={20} /></button>
                        <h2 className="text-xl font-semibold tracking-tight text-slate-900 mb-6">{loc.edit_vocab} #{editingItem.id}</h2>

                        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{loc.en_text}</label>
                                <textarea
                                    className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 box-border"
                                    rows={2}
                                    value={editingItem.english_text}
                                    onChange={e => setEditingItem({ ...editingItem, english_text: e.target.value })}
                                />
                                <p className="text-[10px] text-slate-400 mt-1">{loc.wrap_target}</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{loc.ja_text}</label>
                                <textarea
                                    className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 box-border"
                                    rows={2}
                                    value={editingItem.japanese_text}
                                    onChange={e => setEditingItem({ ...editingItem, japanese_text: e.target.value })}
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{loc.en_options}</label>
                                    <textarea
                                        className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:border-indigo-500"
                                        rows={3}
                                        value={editingItem.english_options.join(', ')}
                                        onChange={e => setEditingItem({ ...editingItem, english_options: e.target.value.split(',').map(s => s.trim()) })}
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{loc.ja_options}</label>
                                    <textarea
                                        className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:border-indigo-500"
                                        rows={3}
                                        value={editingItem.japanese_options.join(', ')}
                                        onChange={e => setEditingItem({ ...editingItem, japanese_options: e.target.value.split(',').map(s => s.trim()) })}
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={saveEdit}
                            className="mt-8 w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors"
                        >
                            <Save size={18} /> {loc.save_changes}
                        </button>
                    </div>
                </div>
            )}

            {addingVocab && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-sm shadow-2xl border border-slate-200 max-w-lg w-full p-8 relative flex flex-col max-h-[90vh]">
                        <button onClick={() => setAddingVocab(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X size={20} /></button>
                        <h2 className="text-xl font-semibold tracking-tight text-slate-900 mb-6 flex items-center gap-2"><Plus size={20} /> {loc.add_new_vocab}</h2>

                        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{loc.en_text}</label>
                                <textarea
                                    className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 box-border"
                                    rows={2}
                                    value={addingVocab.english_text}
                                    onChange={e => setAddingVocab({ ...addingVocab, english_text: e.target.value })}
                                    placeholder="e.g. He is a {{student}}."
                                />
                                <p className="text-[10px] text-slate-400 mt-1">{loc.wrap_target}</p>
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{loc.ja_text}</label>
                                <textarea
                                    className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 box-border"
                                    rows={2}
                                    value={addingVocab.japanese_text}
                                    onChange={e => setAddingVocab({ ...addingVocab, japanese_text: e.target.value })}
                                    placeholder="e.g. 彼は{{学生}}です。"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{loc.en_options}</label>
                                    <textarea
                                        className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:border-indigo-500"
                                        rows={3}
                                        value={addingVocab.english_options.join(', ')}
                                        onChange={e => setAddingVocab({ ...addingVocab, english_options: e.target.value.split(',').map(s => s.trim()) })}
                                        placeholder="student, teacher, doctor, friend"
                                    />
                                </div>
                                <div>
                                    <label className="block text-[10px] font-bold uppercase tracking-widest text-slate-400 mb-2">{loc.ja_options}</label>
                                    <textarea
                                        className="w-full border border-slate-200 rounded-lg p-2 text-xs focus:border-indigo-500"
                                        rows={3}
                                        value={addingVocab.japanese_options.join(', ')}
                                        onChange={e => setAddingVocab({ ...addingVocab, japanese_options: e.target.value.split(',').map(s => s.trim()) })}
                                        placeholder="学生, 先生, 医者, 友達"
                                    />
                                </div>
                            </div>
                        </div>

                        <button
                            onClick={saveNewVocab}
                            className="mt-8 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
                        >
                            <Plus size={18} /> {loc.add_vocab}
                        </button>
                    </div>
                </div>
            )}

            {addingDef && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-sm shadow-2xl border border-slate-200 max-w-md w-full p-8 relative flex flex-col max-h-[90vh]">
                        <button onClick={() => setAddingDef(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X size={20} /></button>
                        <h2 className="text-xl font-semibold tracking-tight text-slate-900 mb-6 flex items-center gap-2"><BookOpen size={20} /> {loc.add_dict_item}</h2>

                        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{loc.en_word}</label>
                                <input
                                    type="text"
                                    className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 box-border"
                                    value={addingDef.english_word}
                                    onChange={e => setAddingDef({ ...addingDef, english_word: e.target.value })}
                                    placeholder="e.g. apple"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{loc.pos}</label>
                                <input
                                    type="text"
                                    className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 box-border"
                                    value={addingDef.part_of_speech}
                                    onChange={e => setAddingDef({ ...addingDef, part_of_speech: e.target.value })}
                                    placeholder="e.g. Noun"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{loc.ja_meaning}</label>
                                <textarea
                                    className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 box-border"
                                    rows={3}
                                    value={addingDef.japanese_meaning}
                                    onChange={e => setAddingDef({ ...addingDef, japanese_meaning: e.target.value })}
                                    placeholder="e.g. りんご"
                                />
                            </div>
                        </div>

                        <button
                            onClick={saveNewDef}
                            className="mt-8 w-full py-3 bg-indigo-600 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-indigo-700 transition-colors"
                        >
                            <Plus size={18} /> {loc.add_entry}
                        </button>
                    </div>
                </div>
            )}

            {editingDef && (
                <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-sm shadow-2xl border border-slate-200 max-w-md w-full p-8 relative flex flex-col max-h-[90vh]">
                        <button onClick={() => setEditingDef(null)} className="absolute top-6 right-6 text-slate-400 hover:text-slate-600"><X size={20} /></button>
                        <h2 className="text-xl font-semibold tracking-tight text-slate-900 mb-6 flex items-center gap-2"><BookOpen size={20} /> {loc.edit_dict_item}</h2>

                        <div className="flex-1 overflow-y-auto space-y-6 pr-2">
                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{loc.en_word}</label>
                                <input
                                    type="text"
                                    className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 box-border"
                                    value={editingDef.english_word}
                                    onChange={e => setEditingDef({ ...editingDef, english_word: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{loc.pos}</label>
                                <input
                                    type="text"
                                    className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 box-border"
                                    value={editingDef.part_of_speech}
                                    onChange={e => setEditingDef({ ...editingDef, part_of_speech: e.target.value })}
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-bold uppercase tracking-widest text-slate-400 mb-2">{loc.ja_meaning}</label>
                                <textarea
                                    className="w-full border border-slate-200 rounded-lg p-3 text-sm focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 box-border"
                                    rows={3}
                                    value={editingDef.japanese_meaning}
                                    onChange={e => setEditingDef({ ...editingDef, japanese_meaning: e.target.value })}
                                />
                            </div>
                        </div>

                        <button
                            onClick={saveEditDef}
                            className="mt-8 w-full py-3 bg-slate-900 text-white rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-black transition-colors"
                        >
                            <Save size={18} /> Save Changes
                        </button>
                    </div>
                </div>
            )}
        </>
    );
};

export default Modals;
