import { Injectable } from '@angular/core';
import { Action } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { of } from 'rxjs';
import { switchMap, map } from 'rxjs/operators';

import { LocalStorageService } from '../../services/local-storage.service';
import { EConfigActions, 
         GetMeasurementSystem,
         GetMeasurementSystemSuccess,
         UpdateMeasurementSystem } from '../actions/config.actions';


@Injectable()
export class ConfigEffects { 
    
    constructor(private actions$: Actions, private storageSrvc: LocalStorageService) {}      
    
    @Effect() 
    getMeasurementSystem$ = this.actions$.pipe(
        ofType<GetMeasurementSystem>(EConfigActions.getMeasurementSystem),
        switchMap(() => {
            const ms = this.storageSrvc.getMeasurementSystem();
            if(ms === 'F'){
                return of(new GetMeasurementSystemSuccess(ms));
            }
            else{
                // the default system...
                return of(new GetMeasurementSystemSuccess('C'));
            }
        })
    )
    
    @Effect() 
    updateMeasurementSystem$ = this.actions$.pipe(
        ofType<UpdateMeasurementSystem>(EConfigActions.updateMeasurementSystem),
        map(action => action.payload),
        switchMap(newValue => of(new GetMeasurementSystemSuccess(newValue))),
    )
    
}