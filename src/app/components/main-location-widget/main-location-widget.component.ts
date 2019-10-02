import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from "rxjs"; 

import { MainLocation } from "../../classes/main-location";
import { Store, select } from '@ngrx/store';
import { IAppState } from "../../store/state/app.state";
import { selectSelectedLocation } from "../../store/selectors/location.selectors";
import { selectMeasurementSystem } from "../../store/selectors/config.selectors";
import { GetSelectedLocation, 
         GetSelectedLocationData,
         AddFavoriteLocation,
         RemoveFavoriteLocation,
       } from "../../store/actions/location.actions";


@Component({
  selector: 'main-location-widget',
  templateUrl: './main-location-widget.component.html',
  styleUrls: ['./main-location-widget.component.scss']
})
export class MainLocationWidgetComponent implements OnInit, OnDestroy {


    selectedLocationSubscription: Subscription;
    location: MainLocation;
    measurementSystem: Observable<string>;
    
    constructor(private store: Store<IAppState>) { }

    ngOnInit() {
        this.measurementSystem = this.store.pipe(select(selectMeasurementSystem));
        this.selectedLocationSubscription = this.store.pipe(select(selectSelectedLocation))
            .subscribe(
                (location: MainLocation) => {
                    if(location === null){
                        // create a MainLocation object for default location
                        const defaultLocation = new MainLocation("Tel Aviv", "TA", "Israel", "IL", "215854");
                        // initiate the selectedLocation of the state with the default location
                        this.store.dispatch(new GetSelectedLocation(defaultLocation));
                    }
                    else{
                        this.location = location;
                        /* check the state of weather data (WAITING, SUCCESS or ERROR). if it's WAITING we need
                           to send an Http request by dispatching the appropriate action  */
                        if(location.weatherDataState === 'WAITING'){
                            this.store.dispatch(new GetSelectedLocationData(location));
                        }
                    }
                },
                e => console.log(e),
            )
    }
    
    ngOnDestroy(){
        this.selectedLocationSubscription.unsubscribe();
    }

}

