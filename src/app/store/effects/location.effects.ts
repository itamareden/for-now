import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Action, Store } from '@ngrx/store';
import { Effect, Actions, ofType } from '@ngrx/effects';
import { ObservableInput, of, forkJoin, from } from 'rxjs'; 
import { switchMap, map, mergeMap, catchError } from 'rxjs/operators';  
import { WeatherDataService } from '../../services/weather-data.service';  
import { FavoriteLocation } from '../../classes/favorite-location';
import { MainLocation } from '../../classes/main-location';
import { ILocationDetails } from '../../interfaces/ilocation-details';
import { LocalStorageService } from '../../services/local-storage.service';
import { IAppState } from '../state/app.state';
import { LocationActions,
         ELocationActions,
         GetSelectedLocation,
         GetSelectedLocationSuccess,
         GetSelectedLocationData,
         GetSelectedLocationDataSuccess,
         GetSelectedLocationDataError,
         GetAllFavoriteLocations, 
         GetAllFavoriteLocationsSuccess,
         GetAllFavoriteLocationsData,
         GetFavoriteLocationDataSuccess,
         GetFavoriteLocationDataError, 
         AddFavoriteLocation,
         AddFavoriteLocationSuccess,
         RemoveFavoriteLocation,
         RemoveFavoriteLocationSuccess,
         AddOrRemoveFavoriteLocationError,
         GetHomeLocationOnLoad,
         GetHomeLocationOnLoadSuccess,
         UpdateHomeLocation,
         UpdateHomeLocationSuccess,
       } from '../actions/location.actions';


@Injectable()
export class LocationEffects { 
    
    constructor(private actions: Actions, 
                private router: Router, 
                private storageSrvc: LocalStorageService, 
                private weatherDataSrvc: WeatherDataService) {}  
    
    
    @Effect() 
    getSelectedLocation$ = this.actions.pipe(
        ofType<GetSelectedLocation>(ELocationActions.getSelectedLocation),
        map(action => action.payload),
        switchMap(loc => {
            // all selected locations are of type MainLocation
            const mainLocation = new MainLocation(loc.details);
            // if the location is favorite then mark it as so in the object
            if(this.storageSrvc.isLocationFavorite(mainLocation)){
                mainLocation.isFavorite = true;
            }
            // if the location is the home location then mark it as so in the object
            if(this.storageSrvc.isLocationHome(mainLocation)){
                mainLocation.isHomeLocation = true;
            }
            this.router.navigate(['/location/', 
                                  `${loc.details.countryID}`, 
                                  `${loc.details.regionID}`, 
                                  loc.details.city.split(" ").join("_")]);
            return of(new GetSelectedLocationSuccess(mainLocation));
        })
    )

    @Effect() 
    getSelectedLocationData$ = this.actions.pipe(
        ofType<GetSelectedLocationData>(ELocationActions.getSelectedLocationData),
        map(action => action.payload),
        switchMap((mainLocation: MainLocation) => {
            // send 2 parallel http requests and wait for response from both of them
            return forkJoin([this.weatherDataSrvc.getCurrWeather(mainLocation), this.weatherDataSrvc.getLocationForecast(mainLocation)]).pipe(
                map(data => new GetSelectedLocationDataSuccess(data[1])),
                catchError((e: {locationKey: string, message: string}) =>  {
                    return of(new GetSelectedLocationDataError())
                })
            );
        }),
    )
    
    @Effect() 
    getFavorites$ = this.actions.pipe(
        ofType<GetAllFavoriteLocations>(ELocationActions.getAllFavoriteLocations),
        switchMap(() => {
            const favoritesArr = this.storageSrvc.getAllFavoriteLocations();
            return of(new GetAllFavoriteLocationsSuccess(favoritesArr));   
        }),
    )
    
    @Effect() 
    getFavoritesData$ = this.actions.pipe(
        ofType<GetAllFavoriteLocationsData>(ELocationActions.getAllFavoriteLocationsData),
        switchMap(() => from(this.storageSrvc.getAllFavoriteLocations())),
        // mergeMap to fire all requests in parallel
        mergeMap((location: FavoriteLocation) => {
            return this.weatherDataSrvc.getCurrWeather(location).pipe(
                map((location: FavoriteLocation) =>  new GetFavoriteLocationDataSuccess(location)),
                catchError((e: {locationKey: string, message: string}) =>  {
                    // each location response updates the state immediately
                    return of(new GetFavoriteLocationDataError(e.locationKey))
                })
            )
        })
    )
    
    @Effect() 
    addToFavorites$ = this.actions.pipe(
        ofType<AddFavoriteLocation>(ELocationActions.addFavoriteLocation),
        map(action => action.payload),
        switchMap((location: FavoriteLocation): ObservableInput<LocationActions> => {
            const addedLocation = this.storageSrvc.addLocationToFavorites(location);
            if(addedLocation !== null){
                return of(new AddFavoriteLocationSuccess(addedLocation));
            }
            else{
                const favoritesArr = this.storageSrvc.getAllFavoriteLocations();
                return of(new AddOrRemoveFavoriteLocationError(favoritesArr));
            }
        })
    )
    
    @Effect() 
    removeFromFavorites$ = this.actions.pipe(
        ofType<RemoveFavoriteLocation>(ELocationActions.removeFavoriteLocation),
        map(action => action.payload),
        switchMap((location: FavoriteLocation): ObservableInput<LocationActions> => {
            const removedLocation = this.storageSrvc.removeLocationFromFavorites(location);
            if(removedLocation !== null){
                return of(new RemoveFavoriteLocationSuccess(removedLocation));
            }
            else{
                const favoritesArr = this.storageSrvc.getAllFavoriteLocations();
                return of(new AddOrRemoveFavoriteLocationError(favoritesArr));
            }
        })
    )
    
    @Effect() 
    getHomeLocationOnLoad$ = this.actions.pipe(
        ofType<GetHomeLocationOnLoad>(ELocationActions.getHomeLocationOnLoad),
        switchMap(() => {
            const homeLocationDetails = this.storageSrvc.getHomeLocation();
            return of(new GetHomeLocationOnLoadSuccess(homeLocationDetails));
        })
    )
    
    @Effect() 
    updateHomeLocation$ = this.actions.pipe(
        ofType<UpdateHomeLocation>(ELocationActions.updateHomeLocation),
        map(action => action.payload),
        switchMap((locationDetails: ILocationDetails) => {
            this.storageSrvc.setHomeLocation(locationDetails);
            return of(new UpdateHomeLocationSuccess(locationDetails));
        })
    )
    
}