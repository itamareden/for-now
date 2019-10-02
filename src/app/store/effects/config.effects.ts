import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { LocalStorageService } from '../../services/local-storage.service';
import { EConfigActions, 
         GetMeasurementSystemOnLoad,
         GetMeasurementSystemOnLoadSuccess,
         UpdateMeasurementSystem, 
         UpdateMeasurementSystemSuccess } from '../actions/config.actions';


@Injectable()
export class ConfigEffects { 
    
    constructor(private actions$: Actions, private storageSrvc: LocalStorageService) {}      
    
    @Effect() 
    getMeasurementSystem$ = this.actions$.pipe(
        ofType<GetMeasurementSystemOnLoad>(EConfigActions.getMeasurementSystemOnLoad),
        switchMap(() => {
            const ms = this.storageSrvc.getMeasurementSystem();
            return of(new GetMeasurementSystemOnLoadSuccess(ms));
        })
    )
    
    @Effect() 
    updateMeasurementSystem$ = this.actions$.pipe(
        ofType<UpdateMeasurementSystem>(EConfigActions.updateMeasurementSystem),
        map(action => action.payload),
        switchMap(newValue => {
            this.storageSrvc.setMeasurementSystem(newValue);
            return of(new UpdateMeasurementSystemSuccess(newValue));
        }),
    )
    
}