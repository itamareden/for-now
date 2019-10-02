import { Injectable } from '@angular/core';

import { FavoriteLocation } from '../classes/favorite-location';
import { Location } from '../classes/location';
import { ILocationDetails } from '../interfaces/ilocation-details';

@Injectable({
  providedIn: 'root'
})
export class LocalStorageService {
    
    favoritesStorageKey = "favoriteLocations";
    measurementSystemStorageKey = "measurementSystem";
    homeLocationStorageKey = "homeLocation";

    constructor() { }
    
    getAllFavoriteLocations(): FavoriteLocation[]{
        const jsonFavoritesArr = JSON.parse(localStorage.getItem(this.favoritesStorageKey));
        // check if there are locations in the array
        if(jsonFavoritesArr !== null){
            /* since the locations were "jsoned" and lost thier methods, we should use them to 
            create proper FavoriteLocation objects */
            const favoriteLocationsArr = jsonFavoritesArr.map(
                (locAsJson: {details: {city:string, regionID:string, country:string, countryID:string, key:string}}) => {
                return new FavoriteLocation(locAsJson.details);
            });
            return favoriteLocationsArr;
        }
        return [];
    }
    
    addLocationToFavorites(loc: Location): FavoriteLocation{
        // we set location to type Location since it can be either MainLocation or FavoriteLocation
        const newFavoriteLocation = new FavoriteLocation(loc.details);
        const oldFavoritesArr = this.getAllFavoriteLocations() || []; 
        // check that the location doesn't already exist... 
        if(this.getLocationIndexInFavoritesArr(loc, oldFavoritesArr) === -1){
            oldFavoritesArr.push(newFavoriteLocation);  
            localStorage.setItem(this.favoritesStorageKey, JSON.stringify(oldFavoritesArr));
            return loc;
        }
        return null;
    }
    
    removeLocationFromFavorites(location: Location): FavoriteLocation{  
        const oldFavoritesArr = this.getAllFavoriteLocations() || [];
        const locationIndexInArr = this.getLocationIndexInFavoritesArr(location, oldFavoritesArr);
        // check if the location exists in the array...
        if(locationIndexInArr > -1){
            oldFavoritesArr.splice(locationIndexInArr, 1);  
            localStorage.setItem(this.favoritesStorageKey, JSON.stringify(oldFavoritesArr));
            return location;
        }
        return null;
    }
    
    isLocationFavorite(location: Location): boolean{
        return this.getAllFavoriteLocations()
            .filter(favoriteLoc => favoriteLoc.details.key === location.details.key).length === 1;
    }
    
    private getLocationIndexInFavoritesArr(location: Location, favoritesArr): number{
        return favoritesArr.findIndex(favoriteLocationObj => favoriteLocationObj.details.key === location.details.key);
    }
    
    getMeasurementSystem(): string{
        return localStorage.getItem(this.measurementSystemStorageKey);
    }
    
    setMeasurementSystem(newValue: string){
        localStorage.setItem(this.measurementSystemStorageKey, newValue);
    }
    
    getHomeLocation(): ILocationDetails{
        return JSON.parse(localStorage.getItem(this.homeLocationStorageKey));
    }
    
    setHomeLocation(newHomeLocation: ILocationDetails){
        const detailsJson = JSON.stringify(newHomeLocation);
        localStorage.setItem(this.homeLocationStorageKey, detailsJson);
    }
    
    isLocationHome(location: Location): boolean{
        return this.getHomeLocation().key === location.details.key;
    }
}
