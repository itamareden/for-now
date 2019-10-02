import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';
import { Store, select } from '@ngrx/store';
import { IAppState } from '../../store/state/app.state';
import { FavoriteLocation } from '../../classes/favorite-location'; 
import { faSwimmer, faCannabis, faAppleAlt, faPlaceOfWorship } from '@fortawesome/free-solid-svg-icons';
import { GetAllFavoriteLocations, 
         GetAllFavoriteLocationsData,
         AddFavoriteLocation } from '../../store/actions/location.actions';
import { selectFavoriteLocations } from "../../store/selectors/location.selectors";

@Component({
  selector: 'favorites-page',
  templateUrl: './favorites-page.component.html',
  styleUrls: ['./favorites-page.component.scss']
})
export class FavoritesPageComponent implements OnInit, OnDestroy {
    
    favoritesArr: FavoriteLocation[];
    favoritesSubscription: Subscription;
    summerIcon = faSwimmer;
    cannabisIcon = faCannabis;
    templeIcon = faPlaceOfWorship;
    appleIcon = faAppleAlt;
    
    constructor(private store: Store<IAppState>) { }

    ngOnInit() {
        /* we divide the favorites to 2 actions since we want to first immediately present all the locations 
           with a spinner so and only then fire multiple http requests in parallel and each favorite location box
           in the view will be updated automatically once its response data has arrived.
           in this way the order of the locations in the view is always preserved and not subject to the http 
           response for each location */
        this.store.dispatch(new GetAllFavoriteLocations());
        this.store.dispatch(new GetAllFavoriteLocationsData());    
        this.favoritesSubscription = this.store.pipe(select(selectFavoriteLocations))
            .subscribe(
                (favorites: FavoriteLocation[]) => { 
                    this.favoritesArr = favorites; 
                }
            );
    }
    
    /* this is an appetizer which is only active if the visitor didn't select any favorite locations yet */
    addLocation(locationName){
        let newFavoriteLocation: FavoriteLocation;
        switch(locationName){
            case 'Honolulu': {
                newFavoriteLocation = new FavoriteLocation("Honolulu", "HI", "United States", "US", "348211");
                break;
            }
            case 'Tokyo': {
                newFavoriteLocation = new FavoriteLocation("Tokyo", "13", "Japan", "JP", "226396");
                break;
            }
            case 'New York': {
                newFavoriteLocation = new FavoriteLocation("New York", "NY", "United States", "US", "349727");
                break;
            }
            case 'Amsterdam': {
                newFavoriteLocation = new FavoriteLocation("Amsterdam", "NH", "Netherlands", "NL", "249758");
                break;
            }
        }
        this.store.dispatch(new AddFavoriteLocation(newFavoriteLocation));
        this.store.dispatch(new GetAllFavoriteLocationsData());
    }
    
    ngOnDestroy(){
        this.favoritesSubscription.unsubscribe();
    }

}
