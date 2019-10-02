import { Injectable } from '@angular/core';
import { Observable, throwError } from "rxjs"; 
import { map, catchError } from "rxjs/operators";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import { ILocationResponse } from "../interfaces/ilocation-response";
import { Location } from "../classes/location";

@Injectable({
  providedIn: 'root'
})
export class LocationAutocompleteService {
    
    private proxy = `https://cors-anywhere.herokuapp.com/`;
    private url = `http://dataservice.accuweather.com/locations/v1/cities/autocomplete`;
    private key = `dOWdFOeDWqJ4V3cB9c2xp1KFGun7TnE3`;

    constructor(private http: HttpClient) { }
    
    getAvailableLocations(query: string): Observable<Location[]>{
        return this.http.get<ILocationResponse[]>(`${this.proxy}${this.url}?apikey=${this.key}&q=${query}`)
            .pipe(map(this.mapLocations), catchError(this.handleError));
    }
    
    private mapLocations(locationsResponse: ILocationResponse[]): Location[]{
        const locationsArr: Location[] = [];
        if(locationsResponse !== null){
            locationsResponse.forEach(locationObj => {
                const location = new Location(locationObj.LocalizedName, locationObj.AdministrativeArea.ID, locationObj.Country.LocalizedName, locationObj.Country.ID, locationObj.Key);
                locationsArr.push(location);
            });
            return locationsArr;
        }
        else{
            /* if the user types an invalid location the api response returns null and not error.
               but we want it as an error message and therefore we throw it ourself */
            throw new Error("location syntax is invalid");
        }
    }
    
    private handleError(error: HttpErrorResponse) { 
        let errorMsg: any;
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. 
            errorMsg = `${error.error.message}`;
        } 
        else if(!!error.status || !!error.error){
            // The backend returned an unsuccessful response code.
            errorMsg = `${error.status}: ${error.error.Message ? error.error.Message : error.error}`;
        }
        else{
            errorMsg = error;
        }
          // return an observable with the error message
        return throwError(errorMsg);
    };
 
}
