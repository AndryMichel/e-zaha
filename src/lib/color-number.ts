// @/lib/color-number.ts

/**
 * Retourne la classe de couleur Tailwind basée sur le pourcentage
 * @param percentage - Le pourcentage (0-100)
 * @returns Objet contenant les classes de couleur pour le texte et l'arrière-plan
 */
export function getPercentageColor(percentage: number) {
    if (percentage >= 0 && percentage < 25) {
        return {
            text: 'text-red-600',
            bg: 'bg-red-50',
            border: 'border-red-200',
            ring: 'ring-red-100'
        };
    } else if (percentage >= 25 && percentage < 50) {
        return {
            text: 'text-orange-600',
            bg: 'bg-orange-50',
            border: 'border-orange-200',
            ring: 'ring-orange-100'
        };
    } else if (percentage >= 50 && percentage < 75) {
        return {
            text: 'text-yellow-600',
            bg: 'bg-yellow-50',
            border: 'border-yellow-200',
            ring: 'ring-yellow-100'
        };
    } else if (percentage >= 75 && percentage <= 100) {
        return {
            text: 'text-green-600',
            bg: 'bg-green-50',
            border: 'border-green-200',
            ring: 'ring-green-100'
        };
    } else {
        // Valeur par défaut pour les cas hors limites
        return {
            text: 'text-gray-600',
            bg: 'bg-gray-50',
            border: 'border-gray-200',
            ring: 'ring-gray-100'
        };
    }
}

/**
 * Retourne une classe de couleur simplifiée pour le texte seulement
 * @param percentage - Le pourcentage (0-100)
 * @returns Classe Tailwind pour la couleur du texte
 */
export function getPercentageTextColor(percentage: number): string {
    return getPercentageColor(percentage).text;
}

/**
 * Retourne un badge coloré pour afficher un pourcentage
 * @param percentage - Le pourcentage (0-100)
 * @returns Objet avec les classes pour créer un badge coloré
 */
export function getPercentageBadgeClasses(percentage: number) {
    const colors = getPercentageColor(percentage);
    return `${colors.text} ${colors.bg} ${colors.border} px-2 py-1 rounded-md border font-medium`;
}

/**
 * Retourne le niveau de performance basé sur le pourcentage
 * @param percentage - Le pourcentage (0-100)
 * @returns Texte descriptif du niveau
 */
export function getPerformanceLevel(percentage: number): string {
    if (percentage >= 0 && percentage < 25) {
        return 'Faible';
    } else if (percentage >= 25 && percentage < 50) {
        return 'Modéré';
    } else if (percentage >= 50 && percentage < 75) {
        return 'Bon';
    } else if (percentage >= 75 && percentage <= 100) {
        return 'Excellent';
    } else {
        return 'N/A';
    }
}