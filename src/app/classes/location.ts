import { EWeatherDataState } from "../enums/eweather-data-state.enum";
import { CurrentWeather } from "./current-weather";

export class Location {
    readonly city: string;
    readonly regionID: string;
    readonly country: string;
    readonly countryID: string;
    readonly key: string;
    isFavorite: boolean; 
    weatherDataState: EWeatherDataState; 
    currentWeather: CurrentWeather;
    
    constructor(city: string, regionID: string, country: string, countryID: string, key: string){
        this.city = city;
        this.regionID = regionID;
        this.country = country;
        this.countryID = countryID;
        this.key = key;
        this.weatherDataState = EWeatherDataState.waiting;
    }
    
}
