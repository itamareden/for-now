import { createSelector } from "@ngrx/store";

import { IAppState } from "../state/app.state";
import { ILocationState } from "../state/location.state";

const locations = (state: IAppState) => state.locations;

export const selectSelectedLocation = createSelector(locations, (state: ILocationState) => state.selectedLocation);
export const selectFavoriteLocations = createSelector(locations, (state: ILocationState) => state.favoriteLocations);