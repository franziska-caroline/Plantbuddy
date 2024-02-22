import { Plant } from "./plant";

export interface Preference {
    id: string | undefined;
    preferenceTitle?: string;
    plantSize?: string; 
    sunlightRequirement?: string;
    waterNeeds?: string;
    optimalTemperature?: string;
    petFriendly?: boolean | string;
    filterSettings?: Preference;
    preferencePlants?: Plant[];
}