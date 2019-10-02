import { MainLocation } from "../../classes/main-location";
import { FavoriteLocation } from "../../classes/favorite-location";

export interface ILocationState{
    selectedLocation: MainLocation;
    favoriteLocations: FavoriteLocation[];
}

export const initialLocationsState: ILocationState = {
    selectedLocation: null,
    favoriteLocations: null,
}