import { MainLocation } from "../../classes/main-location";
import { FavoriteLocation } from "../../classes/favorite-location";
import { ILocationDetails } from "../../interfaces/ilocation-details";

export interface ILocationState{
    selectedLocation: MainLocation;
    favoriteLocations: FavoriteLocation[];
    homeLocation: ILocationDetails,
}

const homeLocation = {city: "Tel Aviv", regionID: "TA", country: "Israel", countryID: "IL", key: "215854"};

export const initialLocationsState: ILocationState = {
    selectedLocation: null,
    favoriteLocations: null,
    homeLocation: homeLocation,
}