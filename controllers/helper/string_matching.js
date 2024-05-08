

export function levenshteinDistance(a, b) {
    const lenA = a.length;
    const lenB = b.length;
  
    // Create a matrix
    const matrix = [];
  
    // Initialize the matrix
    for (let i = 0; i <= lenA; i++) {
      matrix[i] = [i];
    }
    for (let j = 0; j <= lenB; j++) {
      matrix[0][j] = j;
    }
  
    // Calculate Levenshtein distance
    for (let i = 1; i <= lenA; i++) {
      for (let j = 1; j <= lenB; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        matrix[i][j] = Math.min(
          matrix[i - 1][j] + 1, // deletion
          matrix[i][j - 1] + 1, // insertion
          matrix[i - 1][j - 1] + cost // substitution
        );
      }
    }
  
    // Return the Levenshtein distance
    return matrix[lenA][lenB];
}

export function findMatches(str, names) {
    const strArray = str.split(',');
    const matches = [];

    for (const name of names) {
        let isMatch = false;
        for (const item of strArray) {
            const distance = levenshteinDistance(name, item.trim());
            if (distance <= 1) {
                isMatch = true;
                break;
            }
        }
        if (isMatch) {
            matches.push(name);
        }
    }

    return matches;
}