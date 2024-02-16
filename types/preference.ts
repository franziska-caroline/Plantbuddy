import { NewPreference } from "./newPreference";
import { Plant } from "./plant";
 
export interface Preference extends NewPreference {
    filterSettings?: Preference;
    preferencePlants?: Plant[];
    id: string;
}