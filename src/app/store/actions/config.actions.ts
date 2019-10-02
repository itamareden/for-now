import { Action } from "@ngrx/store";

export enum EConfigActions{
    getMeasurementSystem = "[Measurement System] Get Measurement System",
    getMeasurementSystemSuccess = "[Measurement System] Get Measurement System Success",
    updateMeasurementSystem = "[Measurement System] Update Measurement System",
}
    
export class GetMeasurementSystem implements Action{
    public readonly type = EConfigActions.getMeasurementSystem;
}
    
export class GetMeasurementSystemSuccess implements Action{
    public readonly type = EConfigActions.getMeasurementSystemSuccess;
    constructor(public payload: string){}
}
    
export class UpdateMeasurementSystem implements Action{
    public readonly type = EConfigActions.updateMeasurementSystem;
    constructor(public payload: string){}
}
    
export type ConfigActions = GetMeasurementSystem | GetMeasurementSystemSuccess | UpdateMeasurementSystem;