export const getBaseForms = (word: string) => {
    const w = word.toLowerCase().replace(/[^a-z0-9]/g, '');
    if (!w) return [];
    const bases = new Set([w]);

    if (w.endsWith('ies')) bases.add(w.slice(0, -3) + 'y');
    else if (w.endsWith('s')) bases.add(w.slice(0, -1));

    if (w.endsWith('es')) bases.add(w.slice(0, -2));

    if (w.endsWith('ied')) bases.add(w.slice(0, -3) + 'y');
    else if (w.endsWith('ed')) {
        bases.add(w.slice(0, -1)); // lived -> live
        bases.add(w.slice(0, -2)); // played -> play
        if (w.length > 3 && w[w.length - 3] === w[w.length - 4]) {
            bases.add(w.slice(0, -3)); // stopped -> stop
        }
    }

    if (w.endsWith('ing')) {
        bases.add(w.slice(0, -3)); // playing -> play
        bases.add(w.slice(0, -3) + 'e'); // making -> make
        if (w.length > 4 && w[w.length - 4] === w[w.length - 5]) {
            bases.add(w.slice(0, -4)); // stopping -> stop
        }
    }

    if (w.endsWith('ly')) bases.add(w.slice(0, -2));

    return Array.from(bases);
};

export const shuffleArray = <T,>(array: T[]) => {
    const arr = [...array];
    for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
};

export const exportData = (data: any, filename: string) => {
    const dataStr = JSON.stringify(data);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    link.click();
    URL.revokeObjectURL(url);
};
