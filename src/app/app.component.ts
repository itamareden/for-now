import { Component, OnInit } from '@angular/core';

import { Store } from '@ngrx/store';
import { IAppState } from "./store/state/app.state";
import { GetMeasurementSystemOnLoad } from "./store/actions/config.actions";
import { GetHomeLocationOnLoad } from "./store/actions/location.actions";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit{
    
    constructor(private store: Store<IAppState>){}
    
    ngOnInit(){
        // on app load we take the relevant data from localStorage...
        this.store.dispatch(new GetHomeLocationOnLoad());
        this.store.dispatch(new GetMeasurementSystemOnLoad());
    }

}
