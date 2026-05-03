import React, { useState, useRef, useEffect } from 'react';
import { BookOpen } from 'lucide-react';
import { VocabItem, Definition, MistakeRecord, AppState, QuizMode, AppLang } from './types';
import { t } from './translations';
import { shuffleArray } from './utils';

// Components
import Welcome from './components/Welcome';
import History from './components/History';
import QuizSelect from './components/QuizSelect';
import Quiz from './components/Quiz';
import Results from './components/Results';
import Dictionary from './components/Dictionary';
import Review from './components/Review';
import QuizBreak from './components/QuizBreak';
import WeakWords from './components/WeakWords';
import Modals from './components/Modals';
import ErrorBoundary from './components/ErrorBoundary';

export default function App() {
    // Global States
    const [vocabularyList, setVocabularyList] = useState<VocabItem[]>(() => {
        try {
            const saved = localStorage.getItem('vocabScanHistory');
            if (saved) return JSON.parse(saved);
        } catch (e) { }
        return [];
    });

    const [definitions, setDefinitions] = useState<Definition[]>(() => {
        try {
            const saved = localStorage.getItem('vocabScanDefs');
            if (saved) {
                const parsed = JSON.parse(saved);
                return parsed.map((d: any) => ({
                    ...d,
                    id: d.id || Math.random().toString(36).substring(2, 11)
                }));
            }
        } catch (e) { }
        return [];
    });

    const [mistakeHistory, setMistakeHistory] = useState<Record<number, MistakeRecord>>(() => {
        try {
            const saved = localStorage.getItem('vocabMistakes');
            if (saved) return JSON.parse(saved);
        } catch (e) { }
        return {};
    });

    const [appState, setAppState] = useState<AppState>(() => {
        const vList = localStorage.getItem('vocabScanHistory');
        const dList = localStorage.getItem('vocabScanDefs');
        if ((vList && JSON.parse(vList).length > 0) || (dList && JSON.parse(dList).length > 0)) {
            return 'HISTORY';
        }
        return 'WELCOME';
    });

    const [lang, setLang] = useState<AppLang>(() => (localStorage.getItem('vocabLang') as AppLang) || 'en');
    const loc = t[lang];

    // Editing States
    const [editingItem, setEditingItem] = useState<VocabItem | null>(null);
    const [addingVocab, setAddingVocab] = useState<VocabItem | null>(null);
    const [addingDef, setAddingDef] = useState<Definition | null>(null);
    const [editingDef, setEditingDef] = useState<Definition | null>(null);

    // Quiz States
    const [quizItems, setQuizItems] = useState<VocabItem[]>([]);
    const [failedItems, setFailedItems] = useState<VocabItem[]>([]);
    const [quizRange, setQuizRange] = useState<{ start: number | ''; end: number | '' }>({ start: 1, end: 1 });
    const [isRandomOrder, setIsRandomOrder] = useState(false);
    const [quizMaxCount, setQuizMaxCount] = useState<number | ''>('');
    const [quizBreakInterval, setQuizBreakInterval] = useState<number | ''>('');
    const [showAdvancedQuizOpts, setShowAdvancedQuizOpts] = useState(false);
    const [quizMode, setQuizMode] = useState<QuizMode>('JP_TO_EN');
    const [currentQuestionIdx, setCurrentQuestionIdx] = useState(0);
    const [score, setScore] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [quizInput, setQuizInput] = useState('');
    const [isAnswerCorrect, setIsAnswerCorrect] = useState<boolean | null>(null);
    const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
    const [reviewStack, setReviewStack] = useState<VocabItem[]>([]);
    const [fullQuizReviewHistory, setFullQuizReviewHistory] = useState<VocabItem[]>([]);
    const [reviewSessionItems, setReviewSessionItems] = useState<VocabItem[]>([]);
    const [reviewReturnState, setReviewReturnState] = useState<AppState>('RESULTS');
    const [isReviewingFullHistory, setIsReviewingFullHistory] = useState(false);
    const [isAddedToStack, setIsAddedToStack] = useState(false);

    const nextActionRef = useRef<HTMLDivElement>(null);
    const importVocabRef = useRef<HTMLInputElement>(null);
    const importDictRef = useRef<HTMLInputElement>(null);

    // Persistence
    useEffect(() => {
        localStorage.setItem('vocabLang', lang);
    }, [lang]);

    useEffect(() => {
        localStorage.setItem('vocabScanHistory', JSON.stringify(vocabularyList));
    }, [vocabularyList]);

    useEffect(() => {
        localStorage.setItem('vocabScanDefs', JSON.stringify(definitions));
    }, [definitions]);

    useEffect(() => {
        localStorage.setItem('vocabMistakes', JSON.stringify(mistakeHistory));
    }, [mistakeHistory]);

    // Quiz Logic
    useEffect(() => {
        if (appState === 'QUIZ' && quizItems[currentQuestionIdx]) {
            const item = quizItems[currentQuestionIdx];
            const opts = quizMode.startsWith('JP_TO_EN') ? item.english_options : item.japanese_options;
            setShuffledOptions(shuffleArray(opts));
            setIsAddedToStack(false);
        }
    }, [currentQuestionIdx, appState, quizItems, quizMode]);

    useEffect(() => {
        if (appState === 'QUIZ' && selectedAnswer !== null && nextActionRef.current) {
            setTimeout(() => {
                nextActionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
            }, 50);
        }
    }, [selectedAnswer, appState]);

    const handleClearVocabData = () => {
        if (confirm(loc.clear_vocab_confirm)) setVocabularyList([]);
    };

    const handleClearDictData = () => {
        if (confirm(loc.clear_dict_confirm)) setDefinitions([]);
    };

    const startQuizModeSelection = () => {
        if (vocabularyList.length === 0) return;
        setQuizRange({
            start: Math.min(...vocabularyList.map(i => i.id)),
            end: Math.max(...vocabularyList.map(i => i.id))
        });
        setIsRandomOrder(false);
        setAppState('QUIZ_SELECT');
    };

    const startQuiz = (mode: QuizMode) => {
        let itemsInRange = vocabularyList.filter(item => {
            const start = Number(quizRange.start) || 1;
            const end = Number(quizRange.end) || 999999;
            return item.id >= start && item.id <= end;
        });
        if (itemsInRange.length === 0) {
            alert("No items found in the selected range.");
            return;
        }

        if (isRandomOrder) itemsInRange = shuffleArray(itemsInRange);
        if (Number(quizMaxCount) > 0 && Number(quizMaxCount) < itemsInRange.length) {
            itemsInRange = itemsInRange.slice(0, Number(quizMaxCount));
        }

        setQuizItems(itemsInRange);
        setQuizMode(mode);
        setCurrentQuestionIdx(0);
        setScore(0);
        setSelectedAnswer(null);
        setQuizInput('');
        setIsAnswerCorrect(null);
        setFailedItems([]);
        setReviewStack([]);
        setFullQuizReviewHistory([]);
        setAppState('QUIZ');
    };

    const handleAnswerSelect = (answer: string) => {
        const currentItem = quizItems[currentQuestionIdx];
        if (selectedAnswer !== null || !currentItem) return;

        setSelectedAnswer(answer);

        const isJpToEn = quizMode.startsWith('JP_TO_EN');
        const textWithBlank = isJpToEn ? currentItem.english_text : currentItem.japanese_text;
        const match = textWithBlank.match(/{{(.*?)}}/);
        const correctAnswer = match ? match[1].trim() : "";

        const isDescMode = quizMode.endsWith('_DESC');
        const correct = isDescMode
            ? answer.trim().toLowerCase() === correctAnswer.toLowerCase()
            : answer === correctAnswer;

        setIsAnswerCorrect(correct);
        if (correct) {
            setScore(s => s + 1);
            setMistakeHistory(prev => {
                if (!prev[currentItem.id]) return prev;
                const record = prev[currentItem.id];
                const newSuccessCount = (record.successCount || 0) + 1;
                if (newSuccessCount >= 5) {
                    const newState = { ...prev };
                    delete newState[currentItem.id];
                    return newState;
                }
                return { ...prev, [currentItem.id]: { ...record, successCount: newSuccessCount } };
            });
        } else {
            setFailedItems(prev => prev.find(i => i.id === currentItem.id) ? prev : [...prev, currentItem]);
            setFullQuizReviewHistory(prev => prev.find(i => i.id === currentItem.id) ? prev : [...prev, currentItem]);
            setMistakeHistory(prev => {
                const existing = prev[currentItem.id] || { failCount: 0, lastFailedAt: 0, successCount: 0 };
                return {
                    ...prev,
                    [currentItem.id]: {
                        failCount: existing.failCount + 1,
                        lastFailedAt: Date.now(),
                        successCount: Math.max(0, (existing.successCount || 0) - 1)
                    }
                };
            });
        }
    };

    const toggleStack = () => {
        const currentItem = quizItems[currentQuestionIdx];
        if (!currentItem) return;
        setReviewStack(prev => {
            if (prev.find(i => i.id === currentItem.id)) {
                setIsAddedToStack(false);
                return prev.filter(i => i.id !== currentItem.id);
            } else {
                setIsAddedToStack(true);
                return [...prev, currentItem];
            }
        });
        setFullQuizReviewHistory(prev => prev.find(i => i.id === currentItem.id) ? prev : [...prev, currentItem]);
        setTimeout(() => nextQuestion(), 600);
    };

    const advanceToNextQuestion = () => {
        if (currentQuestionIdx < quizItems.length - 1) {
            setCurrentQuestionIdx(idx => idx + 1);
            setSelectedAnswer(null);
            setQuizInput('');
            setIsAnswerCorrect(null);
            setAppState('QUIZ');
        } else {
            setAppState('RESULTS');
        }
    };

    const nextQuestion = () => {
        const interval = Number(quizBreakInterval);
        const isIntervalPassed = interval > 0 && (currentQuestionIdx + 1) % interval === 0;
        const isEndOfQuiz = currentQuestionIdx === quizItems.length - 1;

        if (interval > 0 && (isIntervalPassed || isEndOfQuiz) && appState !== 'QUIZ_BREAK') {
            setAppState('QUIZ_BREAK');
        } else {
            advanceToNextQuestion();
        }
    };

    // Review Logic
    const startReview = (returnTo: AppState, useFullHistory: boolean = false) => {
        const itemsToReview = useFullHistory ? fullQuizReviewHistory : reviewStack;
        if (itemsToReview.length === 0) return;
        setReviewSessionItems([...itemsToReview]);
        setReviewIdx(0);
        setReviewInput('');
        setIsReviewRevealed(false);
        setReviewReturnState(returnTo);
        setIsReviewingFullHistory(useFullHistory);
        setAppState('QUIZ_REVIEW');
    };

    const [reviewIdx, setReviewIdx] = useState(0);
    const [reviewInput, setReviewInput] = useState('');
    const [isReviewRevealed, setIsReviewRevealed] = useState(false);

    const handleReviewCheck = () => {
        setIsReviewRevealed(true);
        const currentReviewItem = reviewSessionItems[reviewIdx];
        if (!currentReviewItem) return;

        const isJpToEn = quizMode.startsWith('JP_TO_EN');
        const questionTemplate = isJpToEn ? currentReviewItem.english_text : currentReviewItem.japanese_text;  
        const correctMatch = questionTemplate.match(/{{(.*?)}}/);
        const correctAnswer = correctMatch ? correctMatch[1].trim() : "";
        const isCorrect = reviewInput.trim().toLowerCase() === correctAnswer.toLowerCase();

        if (isCorrect) {
            if (isReviewingFullHistory) {
                setFullQuizReviewHistory(prev => prev.filter(item => item.id !== currentReviewItem.id));       
            } else {
                setReviewStack(prev => prev.filter(item => item.id !== currentReviewItem.id));
            }
        }
    };

    const handleReviewSkip = () => {
        const currentReviewItem = reviewSessionItems[reviewIdx];
        if (!currentReviewItem) return;

        // Remove from stack even if skipped to allow breaking the loop
        if (isReviewingFullHistory) {
            setFullQuizReviewHistory(prev => prev.filter(item => item.id !== currentReviewItem.id));
        } else {
            setReviewStack(prev => prev.filter(item => item.id !== currentReviewItem.id));
        }
        nextReviewQuestion();
    };

    const nextReviewQuestion = () => {        if (reviewIdx < reviewSessionItems.length - 1) {
            setReviewIdx(reviewIdx + 1);
            setReviewInput('');
            setIsReviewRevealed(false);
        } else {
            const remaining = isReviewingFullHistory ? fullQuizReviewHistory : reviewStack;
            if (remaining.length > 0) {
                setReviewSessionItems([...remaining]);
                setReviewIdx(0);
                setReviewInput('');
                setIsReviewRevealed(false);
            } else {
                setAppState(reviewReturnState);
            }
        }
    };

    // Data Handlers
    const handleImportVocab = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target?.result as string);
                if (Array.isArray(data)) {
                    let nextId = vocabularyList.length > 0 ? Math.max(...vocabularyList.map(i => i.id)) + 1 : 1;
                    const newItems = data.map(item => ({
                        ...item,
                        id: nextId++,
                        english_options: Array.isArray(item.english_options) ? item.english_options : [],
                        japanese_options: Array.isArray(item.japanese_options) ? item.japanese_options : []
                    }));
                    setVocabularyList(prev => [...prev, ...newItems]);
                }
            } catch (err) { alert("Invalid JSON"); }
        };
        reader.readAsText(file);
    };

    const handleImportDict = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (ev) => {
            try {
                const data = JSON.parse(ev.target?.result as string);
                if (Array.isArray(data)) {
                    const newItems = data.map(item => ({
                        ...item,
                        id: item.id ? String(item.id) : Math.random().toString(36).substring(2, 11),
                        part_of_speech: item.part_of_speech || ''
                    }));
                    setDefinitions(prev => [...prev, ...newItems]);
                }
            } catch (err) { alert("Invalid JSON"); }
        };
        reader.readAsText(file);
    };

    const deleteItem = (id: number) => {
        if (confirm(loc.delete_confirm)) setVocabularyList(prev => prev.filter(i => i.id !== id));
    };

    const saveEdit = () => {
        if (editingItem) setVocabularyList(prev => prev.map(i => i.id === editingItem.id ? editingItem : i));
        setEditingItem(null);
    };

    const saveNewVocab = () => {
        if (addingVocab) {
            const newId = vocabularyList.length > 0 ? Math.max(...vocabularyList.map(i => i.id)) + 1 : 1;
            setVocabularyList(prev => [...prev, { ...addingVocab, id: newId }]);
        }
        setAddingVocab(null);
    };

    const saveNewDef = () => {
        if (addingDef) {
            const newDef = { ...addingDef, id: Math.random().toString(36).substring(2, 11) };
            setDefinitions(prev => [...prev, newDef]);
        }
        setAddingDef(null);
    };

    const saveEditDef = () => {
        if (editingDef) setDefinitions(prev => prev.map(d => d.id === editingDef.id ? editingDef : d));
        setEditingDef(null);
    };

    return (
        <ErrorBoundary>
            <div className="min-h-screen flex flex-col bg-[#FDFDFD] text-slate-900 font-sans overflow-hidden">
            <header className="flex items-center justify-between px-4 sm:px-8 py-4 border-b border-slate-100 bg-white">
                <div className="flex items-center gap-2 cursor-pointer" onClick={() => setAppState('HISTORY')}>
                    <div className="w-8 h-8 flex-shrink-0 bg-indigo-600 rounded-lg flex items-center justify-center">
                        <BookOpen className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-xl font-semibold tracking-tight hidden sm:block">{loc.vocab_quiz}</h1>
                </div>

                <div className="flex gap-2 sm:gap-4 overflow-x-auto no-scrollbar max-w-full pb-1 sm:pb-0">
                    <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-full text-xs font-semibold shrink-0">
                        <button onClick={() => setLang('en')} className={`px-2 py-1 rounded-full ${lang === 'en' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>EN</button>
                        <button onClick={() => setLang('ja')} className={`px-2 py-1 rounded-full ${lang === 'ja' ? 'bg-white shadow-sm text-indigo-600' : 'text-slate-500'}`}>JA</button>
                    </div>
                    <button onClick={() => setAppState('HISTORY')} className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border border-slate-200 rounded-full hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0">{loc.vocab_db}</button>
                    <button onClick={() => setAppState('DICTIONARY')} className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border border-slate-200 rounded-full hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0">{loc.dictionary}</button>
                    <button onClick={() => setAppState('WEAK_WORDS')} className="px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border border-slate-200 rounded-full hover:bg-slate-50 transition-colors whitespace-nowrap shrink-0">{loc.mistake_history}</button>
                </div>
            </header>

            <main className="flex-1 overflow-y-auto w-full max-w-5xl mx-auto animate-in fade-in duration-500 pb-12 relative">
                {appState === 'WELCOME' && (
                    <Welcome
                        vocabularyList={vocabularyList}
                        definitions={definitions}
                        loc={loc}
                        importVocabRef={importVocabRef}
                        importDictRef={importDictRef}
                        handleImportVocab={handleImportVocab}
                        handleImportDict={handleImportDict}
                        setAppState={setAppState}
                    />
                )}
                {appState === 'HISTORY' && (
                    <History
                        vocabularyList={vocabularyList}
                        loc={loc}
                        importVocabRef={importVocabRef}
                        handleImportVocab={handleImportVocab}
                        handleClearVocabData={handleClearVocabData}
                        setAddingVocab={setAddingVocab}
                        setEditingItem={setEditingItem}
                        deleteItem={deleteItem}
                        startQuizModeSelection={startQuizModeSelection}
                    />
                )}
                {appState === 'WEAK_WORDS' && (
                    <WeakWords
                        mistakeHistory={mistakeHistory}
                        vocabularyList={vocabularyList}
                        loc={loc}
                        setMistakeHistory={setMistakeHistory}
                        startQuizFromWeakWords={(items) => {
                            setQuizItems(items);
                            setQuizMode('JP_TO_EN');
                            setCurrentQuestionIdx(0);
                            setScore(0);
                            setSelectedAnswer(null);
                            setQuizInput('');
                            setIsAnswerCorrect(null);
                            setFailedItems([]);
                            setReviewStack([]);
                            setFullQuizReviewHistory([]);
                            setAppState('QUIZ');
                        }}
                        definitions={definitions}
                    />
                )}
                {appState === 'DICTIONARY' && (
                    <Dictionary
                        definitions={definitions}
                        loc={loc}
                        importDictRef={importDictRef}
                        handleImportDict={handleImportDict}
                        handleClearDictData={handleClearDictData}
                        setAddingDef={setAddingDef}
                        setEditingDef={setEditingDef}
                        deleteDef={(id) => setDefinitions(prev => prev.filter(d => d.id !== id))}
                    />
                )}
                {appState === 'QUIZ_SELECT' && (
                    <QuizSelect
                        loc={loc}
                        quizRange={quizRange}
                        setQuizRange={setQuizRange}
                        isRandomOrder={isRandomOrder}
                        setIsRandomOrder={setIsRandomOrder}
                        showAdvancedQuizOpts={showAdvancedQuizOpts}
                        setShowAdvancedQuizOpts={setShowAdvancedQuizOpts}
                        quizMaxCount={quizMaxCount}
                        setQuizMaxCount={setQuizMaxCount}
                        quizBreakInterval={quizBreakInterval}
                        setQuizBreakInterval={setQuizBreakInterval}
                        startQuiz={startQuiz}
                        resetApp={() => setAppState('HISTORY')}
                    />
                )}
                {appState === 'QUIZ' && (
                    <Quiz
                        currentItem={quizItems[currentQuestionIdx]}
                        quizMode={quizMode}
                        currentQuestionIdx={currentQuestionIdx}
                        quizItems={quizItems}
                        loc={loc}
                        selectedAnswer={selectedAnswer}
                        isAnswerCorrect={isAnswerCorrect}
                        quizInput={quizInput}
                        setQuizInput={setQuizInput}
                        handleAnswerSelect={handleAnswerSelect}
                        shuffledOptions={shuffledOptions}
                        definitions={definitions}
                        nextActionRef={nextActionRef}
                        toggleStack={toggleStack}
                        isAddedToStack={isAddedToStack}
                        nextQuestion={nextQuestion}
                    />
                )}
                {appState === 'QUIZ_BREAK' && (
                    <QuizBreak
                        loc={loc}
                        currentQuestionIdx={currentQuestionIdx}
                        quizItems={quizItems}
                        score={score}
                        advanceToNextQuestion={advanceToNextQuestion}
                        reviewStack={reviewStack}
                        fullQuizReviewHistory={fullQuizReviewHistory}
                        startReview={startReview}
                        setAppState={setAppState}
                    />
                )}
                {appState === 'RESULTS' && (
                    <Results
                        score={score}
                        quizItems={quizItems}
                        loc={loc}
                        startQuizModeSelection={startQuizModeSelection}
                        failedItems={failedItems}
                        retryMistakes={() => {
                            setQuizItems(failedItems);
                            setCurrentQuestionIdx(0);
                            setScore(0);
                            setSelectedAnswer(null);
                            setIsAnswerCorrect(null);
                            setFailedItems([]);
                            setAppState('QUIZ');
                        }}
                        setAppState={setAppState}
                        fullQuizReviewHistory={fullQuizReviewHistory}
                        startReview={startReview}
                    />
                )}
                {appState === 'QUIZ_REVIEW' && (
                    <Review
                        currentReviewItem={reviewSessionItems[reviewIdx]}
                        quizMode={quizMode}
                        reviewIdx={reviewIdx}
                        reviewSessionItems={reviewSessionItems}
                        isReviewRevealed={isReviewRevealed}
                        reviewInput={reviewInput}
                        setReviewInput={setReviewInput}
                        handleReviewCheck={handleReviewCheck}
                        handleReviewSkip={handleReviewSkip}
                        nextReviewQuestion={nextReviewQuestion}
                        loc={loc}
                    />
                )}
            </main>

            <Modals
                editingItem={editingItem}
                setEditingItem={setEditingItem}
                saveEdit={saveEdit}
                addingVocab={addingVocab}
                setAddingVocab={setAddingVocab}
                saveNewVocab={saveNewVocab}
                addingDef={addingDef}
                setAddingDef={setAddingDef}
                saveNewDef={saveNewDef}
                editingDef={editingDef}
                setEditingDef={setEditingDef}
                saveEditDef={saveEditDef}
                loc={loc}
            />
        </div>
        </ErrorBoundary>
    );
}
