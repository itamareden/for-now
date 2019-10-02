import { Component, OnInit, Input, HostListener, ViewChild, ElementRef, ViewEncapsulation } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { Observable } from 'rxjs';

import { faFan, faTint, faTrashAlt, faWind } from '@fortawesome/free-solid-svg-icons';

import { FavoriteLocation } from '../../classes/favorite-location';
import { MainLocation } from "../../classes/main-location";
import { IAppState } from "../../store/state/app.state";
import { GetSelectedLocation, RemoveFavoriteLocation } from "../../store/actions/location.actions";
import { selectMeasurementSystem } from "../../store/selectors/config.selectors";


@Component({
  selector: 'favorite-location-widget',
  templateUrl: './favorite-location-widget.component.html',
  styleUrls: ['./favorite-location-widget.component.scss'],
  // for ng-bootstrap's tooltip
  encapsulation: ViewEncapsulation.None, 
})
export class FavoriteLocationWidgetComponent implements OnInit {

    @Input() location: FavoriteLocation;
    @ViewChild('trashContainer') trashContainer: ElementRef;
    measurementSystem: Observable<string>;
    isReadyToRemove = false;
    trashIcon = faTrashAlt;
    windIcon = faWind;
    fanIcon = faFan;
    dropIcon = faTint;
    
    constructor(private store: Store<IAppState>) { }

    ngOnInit() {
        this.measurementSystem = this.store.pipe(select(selectMeasurementSystem));
    }
    
    navigateToLocationPage(location: FavoriteLocation){
        this.store.dispatch(new GetSelectedLocation(location));
    }
    
    removeLocation(){
        /* to prevent a situation in which the user accidently clicks on the remove button, we want to remove
           a location only if the user clicks on the trash icon twice. on the first click the icon will turn 
           red and on the second, the location will get deleted.
       */
        if(this.isReadyToRemove){
            // now we can delete the location
            this.store.dispatch(new RemoveFavoriteLocation(this.location))
        }
        else{
            // prepare for remove, change the icon's color to red
            this.isReadyToRemove = true;
        }
    }
    
    setViewBasedOnTimeOfDay(): string{
        if(this.location.currentWeather && !this.location.currentWeather.isDayTime){
            return 'flw-night-view';
        }
        return null;
    }
    
    
    @HostListener('window:click', ['$event']) 
    clickEvent(event: MouseEvent){
        /* if the user clicked on the trash icon once and then decided to not delete the location he can click
           anywhere on the page and the icon will go back to its original color */
        if(this.isReadyToRemove && !this.trashContainer.nativeElement.contains(event.target)){
            this.isReadyToRemove = false;
        }
    }
    

}
