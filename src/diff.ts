export const getDiff = (input: string, target: string) => {
    const inputChars = input.split('');
    const targetChars = target.split('');
    const matrix = Array.from({ length: inputChars.length + 1 }, () => Array(targetChars.length + 1).fill(0));

    for (let i = 0; i <= inputChars.length; i++) matrix[i][0] = i;
    for (let j = 0; j <= targetChars.length; j++) matrix[0][j] = j;

    for (let i = 1; i <= inputChars.length; i++) {
        for (let j = 1; j <= targetChars.length; j++) {
            if (inputChars[i - 1] === targetChars[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(matrix[i - 1][j], matrix[i][j - 1], matrix[i - 1][j - 1]) + 1;
            }
        }
    }

    const diff = [];
    let i = inputChars.length, j = targetChars.length;
    while (i > 0 || j > 0) {
        if (i > 0 && j > 0 && inputChars[i - 1] === targetChars[j - 1]) {
            diff.unshift({ char: inputChars[i - 1], type: 'match' });
            i--; j--;
        } else if (i > 0 && (j === 0 || matrix[i - 1][j] <= matrix[i][j - 1])) {
            diff.unshift({ char: inputChars[i - 1], type: 'extra' });
            i--;
        } else {
            diff.unshift({ char: targetChars[j - 1], type: 'missing' });
            j--;
        }
    }
    return diff;
};
