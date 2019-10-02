import { ILocationDetails } from "../interfaces/ilocation-details";
import { EWeatherDataState } from "../enums/eweather-data-state.enum";
import { CurrentWeather } from "./current-weather";

export class Location {
    details: ILocationDetails;
    weatherDataState: EWeatherDataState; 
    currentWeather: CurrentWeather;
    isFavorite = false; 
    isHomeLocation = false;
    
    constructor(details: ILocationDetails){
        this.details = details;
        this.weatherDataState = EWeatherDataState.waiting;
    }
    
}
