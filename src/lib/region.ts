// Définition du type de région avec code de province
export interface Region {
    code: string;
    name: string;
    province_code: string; // Ajout du code de province
}

// Liste des régions avec leurs codes de province
export const regionsData: Region[] = [
    // Province 1 - ANTANANARIVO
    {code: "11", name: "ANALAMANGA", province_code: "1"},
    {code: "12", name: "VAKINANKARATRA", province_code: "1"},
    {code: "13", name: "ITASY", province_code: "1"},
    {code: "14", name: "BONGOLAVA", province_code: "1"},

    // Province 2 - FIANARANTSOA
    {code: "21", name: "HAUTE MATSIATRA", province_code: "2"},
    {code: "22", name: "AMORON'I MANIA", province_code: "2"},
    {code: "23", name: "FITOVINANY", province_code: "2"},
    {code: "23a", name: "VATOVAVY", province_code: "2"},
    {code: "24", name: "IHOROMBE", province_code: "2"},
    {code: "25", name: "ATSIMO ATSINANANA", province_code: "2"},

    // Province 3 - TOAMASINA
    {code: "31", name: "ATSINANANA", province_code: "3"},
    {code: "32", name: "ANALANJIROFO", province_code: "3"},
    {code: "33", name: "ALAOTRA MANGORO", province_code: "3"},

    // Province 4 - MAHAJANGA
    {code: "41", name: "BOENY", province_code: "4"},
    {code: "42", name: "SOFIA", province_code: "4"},
    {code: "43", name: "BETSIBOKA", province_code: "4"},
    {code: "44", name: "MELAKY", province_code: "4"},

    // Province 5 - TOLIARA
    {code: "51", name: "ATSIMO ANDREFANA", province_code: "5"},
    {code: "52", name: "ANDROY", province_code: "5"},
    {code: "53", name: "ANOSY", province_code: "5"},
    {code: "54", name: "MENABE", province_code: "5"},

    // Province 6 - ANTSIRANANA
    {code: "61", name: "DIANA", province_code: "6"},
    {code: "62", name: "SAVA", province_code: "6"}
];

/**
 * Récupère une région par son code
 * @param code Le code de la région à rechercher
 * @returns La région correspondante ou undefined si non trouvée
 */
export function getRegionByCode(code: string): Region | undefined {
    return regionsData.find(region => region.code === code);
}

/**
 * Récupère le nom d'une région à partir de son code
 * @param code Le code de la région
 * @returns Le nom de la région ou une chaîne vide si non trouvée
 */
export function getRegionNameByCode(code: string): string {
    const region = getRegionByCode(code);
    return region ? region.name : '';
}

/**
 * Récupère les régions d'une province donnée
 * @param provinceCode Le code de la province
 * @returns Un tableau des régions de cette province
 */
export function getRegionsByProvinceCode(provinceCode: string): Region[] {
    return regionsData.filter(region => region.province_code === provinceCode);
}

/**
 * Récupère le code de province d'une région
 * @param regionCode Le code de la région
 * @returns Le code de province ou une chaîne vide si non trouvé
 */
export function getProvinceCodeByRegionCode(regionCode: string): string {
    const region = getRegionByCode(regionCode);
    return region ? region.province_code : '';
}