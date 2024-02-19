import { Plant } from "./plant";

export interface Preference {
    id: string;
    preferenceTitle?: string;
    plantSize?: string; 
    sunlightRequirement?: string;
    waterNeeds?: string;
    optimalTemperature?: string;
    petFriendly?: boolean;
    filterSettings?: Preference;
    preferencePlants?: Plant[];
}