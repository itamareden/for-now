import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription, Observable } from "rxjs"; 

import { MainLocation } from "../../classes/main-location";
import { ILocationDetails } from "../../interfaces/ilocation-details";
import { Store, select } from '@ngrx/store';
import { IAppState } from "../../store/state/app.state";
import { selectSelectedLocation, selectHomeLocation } from "../../store/selectors/location.selectors";
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


    homeLocationSubscription: Subscription;
    selectedLocationSubscription: Subscription;
    homeLocationDetails: ILocationDetails;
    location: MainLocation;
    measurementSystem: Observable<string>;
    
    constructor(private store: Store<IAppState>) { }

    ngOnInit() {
        this.measurementSystem = this.store.pipe(select(selectMeasurementSystem));
        this.homeLocationSubscription = this.store.pipe(select(selectHomeLocation))
            .subscribe(
                // update the homeLocationDetails property each time the visitor changes his home Location
                homeLocationDetails => this.homeLocationDetails = homeLocationDetails,
                e => console.log(e),
            )
        this.selectedLocationSubscription = this.store.pipe(select(selectSelectedLocation))
            .subscribe(
                (location: MainLocation) => {
                    if(location === null){
                        // create a MainLocation object for home location
                        const homeLocation = new MainLocation(this.homeLocationDetails);
                        this.store.dispatch(new GetSelectedLocation(homeLocation));
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
        this.homeLocationSubscription.unsubscribe()
        this.selectedLocationSubscription.unsubscribe();
    }

}

