import { Location } from "./location";
import { ILocationDetails } from "../interfaces/ilocation-details";
import { ForecastWeather } from "../classes/forecast-weather";

export class MainLocation extends Location {
    
    forecastWeather: ForecastWeather[];
    
    constructor(details: ILocationDetails){
        super(details);
    }
    
}
