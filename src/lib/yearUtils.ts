/**
 * Génère une liste d'années autour de l'année actuelle
 * @param range - Nombre d'années avant et après l'année actuelle
 * @returns Un tableau d'années
 */
export const generateYearRange = (range: number = 5): number[] => {
    const currentYear = new Date().getFullYear();
    const years: number[] = [];

    for (let i = currentYear - range; i <= currentYear; i++) {
        years.push(i);
    }

    return years;
};

/**
 * Extrait les années disponibles à partir des données et définit l'année sélectionnée par défaut
 * @param data - Tableau d'objets contenant une propriété "annee"
 * @param currentSelectedYear - L'année actuellement sélectionnée (si disponible)
 * @returns Un objet contenant les années disponibles et l'année à sélectionner
 */
export const extractAvailableYears = <T extends { annee: number }>(
    data: T[],
    currentSelectedYear?: number
): { availableYears: number[]; yearToSelect: number } => {
    // Extraire les années uniques des données
    const availableYears = [...new Set(data.map(item => item.annee))].sort((a, b) => b - a);

    // Si aucune donnée disponible, utiliser l'année actuelle
    if (availableYears.length === 0) {
        const currentYear = new Date().getFullYear();
        return {availableYears: [currentYear], yearToSelect: currentYear};
    }

    // Si l'année actuellement sélectionnée est dans les années disponibles, la conserver
    if (currentSelectedYear && availableYears.includes(currentSelectedYear)) {
        return {availableYears, yearToSelect: currentSelectedYear};
    }

    // Sinon, utiliser la plus récente
    return {availableYears, yearToSelect: Math.max(...availableYears)};
};

/**
 * Récupère les données d'une année spécifique à partir d'un tableau
 * @param data - Tableau d'objets contenant une propriété "annee"
 * @param year - L'année à rechercher
 * @returns L'objet correspondant à l'année spécifiée ou undefined s'il n'existe pas
 */
export const getDataForYear = <T extends { annee: number }>(
    data: T[],
    year: number
): T | undefined => {
    return data.find(item => item.annee === year);
};