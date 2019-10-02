import { Location } from "./location";
import { ForecastWeather } from "../classes/forecast-weather";

export class MainLocation extends Location {
    
    forecastWeather: ForecastWeather[];
    
    constructor(city: string, region: string, country: string, countryID: string, key: string){
        super(city, region, country, countryID, key);
    }
    
}
