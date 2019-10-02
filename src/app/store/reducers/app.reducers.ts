import { ActionReducerMap } from "@ngrx/store";

import { IAppState } from "../state/app.state";
import { locationReducers } from "./location.reducers";
import { configReducers } from "./config.reducers";

export const appReducers: ActionReducerMap<IAppState, any> = {
    config: configReducers,
    locations: locationReducers,
}