import { EConfigActions } from "../actions/config.actions";
import { ConfigActions } from "../actions/config.actions";
import { initialConfigState } from "../state/config.state";

export function configReducers(state = initialConfigState, action: ConfigActions){   
    switch(action.type){
        case EConfigActions.getMeasurementSystemSuccess:{
            return {
                ...state,
                measurementSystem: action.payload,
            }
        }
        default: 
            return state;
    }
}
