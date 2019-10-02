import { Action } from "@ngrx/store";

export enum EConfigActions{
    getMeasurementSystemOnLoad = "[Measurement System] Get Measurement System On Load",
    getMeasurementSystemOnLoadSuccess = "[Measurement System] Get Measurement System On Load Success",
    updateMeasurementSystem = "[Measurement System] Update Measurement System",
    updateMeasurementSystemSuccess = "[Measurement System] Update Measurement System Success",
}
    
export class GetMeasurementSystemOnLoad implements Action{
    public readonly type = EConfigActions.getMeasurementSystemOnLoad;
}
    
export class GetMeasurementSystemOnLoadSuccess implements Action{
    public readonly type = EConfigActions.getMeasurementSystemOnLoadSuccess;
    constructor(public payload: string){}
}
    
export class UpdateMeasurementSystem implements Action{
    public readonly type = EConfigActions.updateMeasurementSystem;
    constructor(public payload: string){}
}
    
export class UpdateMeasurementSystemSuccess implements Action{
    public readonly type = EConfigActions.updateMeasurementSystemSuccess;
    constructor(public payload: string){}
}
    
export type ConfigActions = GetMeasurementSystemOnLoad | 
                            GetMeasurementSystemOnLoadSuccess | 
                            UpdateMeasurementSystem | 
                            UpdateMeasurementSystemSuccess;