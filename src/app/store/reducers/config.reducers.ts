import { EConfigActions } from "../actions/config.actions";
import { ConfigActions } from "../actions/config.actions";
import { initialConfigState } from "../state/config.state";

export function configReducers(state = initialConfigState, action: ConfigActions){   
    switch(action.type){
        case EConfigActions.getMeasurementSystemOnLoadSuccess:{
            // payload can be null if localStorage is empty
            const measurementSystem = action.payload || state.measurementSystem;
            return {
                ...state,
                measurementSystem: measurementSystem,
            }
        }
        case EConfigActions.updateMeasurementSystemSuccess:{
            return {
                ...state,
                measurementSystem: action.payload,
            }
        }
        default: 
            return state;
    }
}
