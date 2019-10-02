import { createSelector } from "@ngrx/store";

import { IAppState } from "../state/app.state";
import { IConfigState } from "../state/config.state";

const config = (state: IAppState) => state.config;

export const selectMeasurementSystem = createSelector(config, (state: IConfigState) => state.measurementSystem);