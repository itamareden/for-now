import { ILocationState, initialLocationsState } from "./location.state";
import { IConfigState, initialConfigState } from "./config.state";

export interface IAppState{
    locations: ILocationState;
    config: IConfigState;
}

export const initialAppState = {
    locations: initialLocationsState,
    config: initialConfigState,
}

export function getInitialState(): IAppState{
    return initialAppState;
}