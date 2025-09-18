// Définition du type de province
export interface Province {
    code: string;
    name: string;
}

// Liste des provinces exportée
export const provinces: Province[] = [
    {code: "1", name: "ANTANANARIVO"},
    {code: "2", name: "FIANARANTSOA"},
    {code: "3", name: "TOAMASINA"},
    {code: "4", name: "MAHAJANGA"},
    {code: "5", name: "TOLIARA"},
    {code: "6", name: "ANTSIRANANA"}
];

/**
 * Récupère une province par son code
 * @param code Le code de la province à rechercher
 * @returns La province correspondante ou undefined si non trouvée
 */
export function getProvinceByCode(code: string): Province | undefined {
    return provinces.find(province => province.code === code);
}

/**
 * Récupère le nom d'une province à partir de son code
 * @param code Le code de la province
 * @returns Le nom de la province ou une chaîne vide si non trouvée
 */
export function getProvinceNameByCode(code: string): string {
    const province = getProvinceByCode(code);
    return province ? province.name : '';
}