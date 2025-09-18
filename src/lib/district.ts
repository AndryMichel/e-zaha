// Définition du type de district
export interface District {
    code: string;
    name: string;
    region_code: string;
    province_code: string;
}

// Liste des districts exportée avec leurs codes de région et province
export const districtsData: District[] = [
    // Province 1 - ANTANANARIVO
    // Région 11 - ANALAMANGA
    {code: "111", name: "TANA 1,2,3,4,5,6", region_code: "11", province_code: "1"},
    {code: "112", name: "ANKAZOBE", region_code: "11", province_code: "1"},
    {code: "113", name: "ANJOZOROBE", region_code: "11", province_code: "1"},
    {code: "114", name: "AMBOHIDRATRIMO", region_code: "11", province_code: "1"},
    {code: "115", name: "MANJAKANDRIANA", region_code: "11", province_code: "1"},
    {code: "116", name: "AVARADRANO", region_code: "11", province_code: "1"},
    {code: "117", name: "ATSIMONDRANO", region_code: "11", province_code: "1"},
    {code: "118", name: "ANDRAMASINA", region_code: "11", province_code: "1"},

    // Région 12 - VAKINANKARATRA
    {code: "122", name: "AMBATOLAMPY", region_code: "12", province_code: "1"},
    {code: "123", name: "FARATSIHO", region_code: "12", province_code: "1"},
    {code: "124", name: "MANDOTO", region_code: "12", province_code: "1"},
    {code: "125", name: "ANTANIFOTSY", region_code: "12", province_code: "1"},
    {code: "126", name: "BETAFO", region_code: "12", province_code: "1"},
    {code: "127", name: "ANTSIRABE I", region_code: "12", province_code: "1"},

    // Région 13 - ITASY
    {code: "131", name: "MIARINARIVO", region_code: "13", province_code: "1"},
    {code: "132", name: "ARIVONIMAMO", region_code: "13", province_code: "1"},
    {code: "133", name: "SOAVINANDRIANA", region_code: "13", province_code: "1"},

    // Région 14 - BONGOLAVA
    {code: "141", name: "TSIROANOMANDIDY", region_code: "14", province_code: "1"},
    {code: "142", name: "FENOARIVOBE", region_code: "14", province_code: "1"},

    // Province 2 - FIANARANTSOA
    // Région 21 - HAUTE MATSIATRA
    {code: "211", name: "FIANARANTSOA I", region_code: "21", province_code: "2"},
    {code: "212", name: "AMBOHIMAHASOA", region_code: "21", province_code: "2"},
    {code: "215", name: "LALANGINA", region_code: "21", province_code: "2"},
    {code: "216", name: "VOHIBATO", region_code: "21", province_code: "2"},
    {code: "217", name: "AMBALAVAO", region_code: "21", province_code: "2"},
    {code: "219", name: "IKALAMAVONY", region_code: "21", province_code: "2"},
    {code: "225", name: "ISANDRA", region_code: "21", province_code: "2"},

    // Région 23 - FITOVINANY
    {code: "231", name: "MANAKARA", region_code: "23", province_code: "2"},
    {code: "235", name: "IKONGO", region_code: "23", province_code: "2"},
    {code: "236", name: "VOHIPENO", region_code: "23", province_code: "2"},

    // Région 23a - VATOVAVY
    {code: "232", name: "NOSY VARIKA", region_code: "23a", province_code: "2"},
    {code: "233", name: "MANANJARY", region_code: "23a", province_code: "2"},
    {code: "234", name: "IFANADIANA", region_code: "23a", province_code: "2"},

    // Région 24 - IHOROMBE
    {code: "241", name: "IHOSY", region_code: "24", province_code: "2"},
    {code: "242", name: "IVOHIBE", region_code: "24", province_code: "2"},
    {code: "243", name: "IAKORA", region_code: "24", province_code: "2"},

    // Région 25 - ATSIMO ATSINANANA
    {code: "251", name: "FARAFANGANA", region_code: "25", province_code: "2"},
    {code: "252", name: "VONDROZO", region_code: "25", province_code: "2"},
    {code: "253", name: "VANGAINDRANO", region_code: "25", province_code: "2"},
    {code: "254", name: "MIDONGY SUD", region_code: "25", province_code: "2"},
    {code: "255", name: "BEFOTAKA SUD", region_code: "25", province_code: "2"},
    {code: "256", name: "BEFOTAKA SUD", region_code: "25", province_code: "2"},

    // Province 3 - TOAMASINA
    // Région 31 - ATSINANANA
    {code: "311", name: "TOAMASINA I", region_code: "31", province_code: "3"},
    {code: "312", name: "TOAMASINA II", region_code: "31", province_code: "3"},
    {code: "313", name: "BRICKAVILLE", region_code: "31", province_code: "3"},
    {code: "314", name: "BRICKAVILLE", region_code: "31", province_code: "3"},
    {code: "315", name: "ANTANAMBAO MANAMPOTSY", region_code: "31", province_code: "3"},
    {code: "316", name: "MAHANORO", region_code: "31", province_code: "3"},
    {code: "317", name: "MAROLAMBO", region_code: "31", province_code: "3"},

    // Région 32 - ANALANJIROFO
    {code: "321", name: "FENERIVE EST", region_code: "32", province_code: "3"},
    {code: "322", name: "MAROANTSETRA", region_code: "32", province_code: "3"},
    {code: "323", name: "MANANARA NORD", region_code: "32", province_code: "3"},
    {code: "324", name: "SOANIERANA IVONGO", region_code: "32", province_code: "3"},
    {code: "325", name: "SAINTE MARIE", region_code: "32", province_code: "3"},
    {code: "326", name: "VAVATENINA", region_code: "32", province_code: "3"},

    // Région 33 - ALAOTRA MANGORO
    {code: "331", name: "AMBATONDRAZAKA", region_code: "33", province_code: "3"},
    {code: "332", name: "ANDILAMENA", region_code: "33", province_code: "3"},
    {code: "333", name: "AMPARAFARAVOLA", region_code: "33", province_code: "3"},
    {code: "334", name: "MORAMANGA", region_code: "33", province_code: "3"},
    {code: "335", name: "ANOSIBE AN", region_code: "33", province_code: "3"},

    // Province 4 - MAHAJANGA
    // Région 41 - BOENY
    {code: "411", name: "MAHAJANGA I", region_code: "41", province_code: "4"},
    {code: "412", name: "MAHAJANGA II", region_code: "41", province_code: "4"},
    {code: "413", name: "MITSINJO", region_code: "41", province_code: "4"},
    {code: "414", name: "MAROVOAY", region_code: "41", province_code: "4"},
    {code: "415", name: "SOALALA", region_code: "41", province_code: "4"},
    {code: "416", name: "AMBATO BOENY", region_code: "41", province_code: "4"},

    // Région 42 - SOFIA
    {code: "421", name: "ANTSOHIHY", region_code: "42", province_code: "4"},
    {code: "422", name: "ANALALAVA", region_code: "42", province_code: "4"},
    {code: "423", name: "BEALANANA", region_code: "42", province_code: "4"},
    {code: "424", name: "BEFANDRIANA NORD", region_code: "42", province_code: "4"},
    {code: "425", name: "PORT BERGE", region_code: "42", province_code: "4"},
    {code: "426", name: "MANDRITSARA", region_code: "42", province_code: "4"},
    {code: "427", name: "MAMPIKONY", region_code: "42", province_code: "4"},

    // Région 43 - BETSIBOKA
    {code: "431", name: "MAEVATANANA", region_code: "43", province_code: "4"},
    {code: "432", name: "TSARATANANA", region_code: "43", province_code: "4"},
    {code: "433", name: "KANDREHO", region_code: "43", province_code: "4"},

    // Région 44 - MELAKY
    {code: "441", name: "MAINTIRANO", region_code: "44", province_code: "4"},
    {code: "442", name: "BESALAMPY", region_code: "44", province_code: "4"},
    {code: "443", name: "AMBATOMAINTY", region_code: "44", province_code: "4"},
    {code: "444", name: "MORAFENOBE", region_code: "44", province_code: "4"},
    {code: "445", name: "ANTSALOVA", region_code: "44", province_code: "4"},

    // Province 5 - TOLIARY
    // Région 51 - ATSIMO ANDREFANA
    {code: "511", name: "TOLIARA I", region_code: "51", province_code: "5"},
    {code: "512", name: "BEROROHA", region_code: "51", province_code: "5"},
    {code: "513", name: "MOROMBE", region_code: "51", province_code: "5"},
    {code: "514", name: "ANKAZOABO SUD", region_code: "51", province_code: "5"},
    {code: "515", name: "SAKARAHA", region_code: "51", province_code: "5"},
    {code: "516", name: "TOLIARA II", region_code: "51", province_code: "5"},
    {code: "517", name: "BENENITRA", region_code: "51", province_code: "5"},
    {code: "518", name: "BETIOKY SUD", region_code: "51", province_code: "5"},
    {code: "519", name: "AMPANIHY OUEST", region_code: "51", province_code: "5"},

    // Région 52 - ANDROY
    {code: "521", name: "AMBOVOMBE ANDROY", region_code: "52", province_code: "5"},
    {code: "522", name: "BEKILY", region_code: "52", province_code: "5"},
    {code: "524", name: "TSIHOMBE", region_code: "52", province_code: "5"},

    // Région 53 - ANOSY
    {code: "531", name: "TAOLAGNARO", region_code: "53", province_code: "5"},
    {code: "532", name: "BETROKA", region_code: "53", province_code: "5"},
    {code: "533", name: "AMBOASARY SUD", region_code: "53", province_code: "5"},

    // Région 54 - MENABE
    {code: "541", name: "MORONDAVA", region_code: "54", province_code: "5"},
    {code: "542", name: "MIANDRIVAZO", region_code: "54", province_code: "5"},
    {code: "543", name: "BELO SUR TSIRIBIHINA", region_code: "54", province_code: "5"},
    {code: "544", name: "MAHABO", region_code: "54", province_code: "5"},
    {code: "545", name: "MANJA", region_code: "54", province_code: "5"},

    // Province 6 - ANTSIRANANA
    // Région 61 - DIANA
    {code: "612", name: "ANTSIRANANA I", region_code: "61", province_code: "6"},
    {code: "613", name: "AMBILOBE", region_code: "61", province_code: "6"},
    {code: "614", name: "NOSY BE", region_code: "61", province_code: "6"},
    {code: "615", name: "AMBANJA", region_code: "61", province_code: "6"},
    {code: "719", name: "AMBANJA", region_code: "61", province_code: "6"},

    // Région 62 - SAVA
    {code: "621", name: "SAMBAVA", region_code: "62", province_code: "6"},
    {code: "622", name: "VOHEMAR", region_code: "62", province_code: "6"},
    {code: "623", name: "ANDAPA", region_code: "62", province_code: "6"},
    {code: "624", name: "ANTALAHA", region_code: "62", province_code: "6"}
];

/**
 * Récupère un district par son code
 * @param code Le code du district à rechercher
 * @returns Le district correspondant ou undefined si non trouvé
 */
export function getDistrictByCode(code: string): District | undefined {
    return districtsData.find(district => district.code === code);
}

/**
 * Récupère le nom d'un district à partir de son code
 * @param code Le code du district
 * @returns Le nom du district ou une chaîne vide si non trouvé
 */
export function getDistrictNameByCode(code: string): string {
    const district = getDistrictByCode(code);
    return district ? district.name : '';
}

/**
 * Récupère les districts d'une région donnée
 * @param regionCode Le code de la région
 * @returns Un tableau des districts de cette région
 */
export function getDistrictsByRegionCode(regionCode: string): District[] {
    return districtsData.filter(district => district.region_code === regionCode);
}

/**
 * Récupère les districts d'une province donnée
 * @param provinceCode Le code de la province
 * @returns Un tableau des districts de cette province
 */
export function getDistrictsByProvinceCode(provinceCode: string): District[] {
    return districtsData.filter(district => district.province_code === provinceCode);
}

/**
 * Récupère le code de région d'un district
 * @param districtCode Le code du district
 * @returns Le code de région ou une chaîne vide si non trouvé
 */
export function getRegionCodeByDistrictCode(districtCode: string): string {
    const district = getDistrictByCode(districtCode);
    return district ? district.region_code : '';
}

/**
 * Récupère le code de province d'un district
 * @param districtCode Le code du district
 * @returns Le code de province ou une chaîne vide si non trouvé
 */
export function getProvinceCodeByDistrictCode(districtCode: string): string {
    const district = getDistrictByCode(districtCode);
    return district ? district.province_code : '';
}