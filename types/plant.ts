export interface Plant {
    _id: string;
    species: string;
    commonName: string;
    waterNeeds: string;
    sunlightRequirements: string;
    size: string;
    optimalTemperature: string;
    image: string;
    description: string;
    petFriendly: boolean;
    categorySlug: string;
}