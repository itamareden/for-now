import { Injectable } from '@angular/core';
import { Observable, throwError } from "rxjs";  
import { map, catchError } from "rxjs/operators";
import { HttpClient, HttpErrorResponse } from "@angular/common/http";

import { ICurrentWeatherResponse } from "../interfaces/icurrent-weather-response";
import { IForecastWeatherResponse } from "../interfaces/iforecast-weather-response";
import { Location } from "../classes/location";
import { MainLocation } from "../classes/main-location";
import { CurrentWeather } from "../classes/current-weather";
import { ForecastWeather } from "../classes/forecast-weather";

@Injectable({
  providedIn: 'root'
})
export class WeatherDataService {
    
    private proxy = `https://cors-anywhere.herokuapp.com/`;
    private currWeatherUrl = `http://dataservice.accuweather.com/currentconditions/v1/`;
    private forcastUrl = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/`;
    private key = `dOWdFOeDWqJ4V3cB9c2xp1KFGun7TnE3`;

    constructor(private http: HttpClient) { }
    
    getCurrWeather(location: Location): Observable<Location>{
        return this.http.get<ICurrentWeatherResponse[]>(`${this.proxy}${this.currWeatherUrl}${location.key}?apikey=${this.key}&details=true`)
            .pipe(map(this.mapCurrWeather), map(weatherData => {
                location.currentWeather = weatherData;
                return location;
            }), catchError(this.handleWeatherDataError.bind(this)))
    }
    
    getLocationForecast(location: MainLocation): Observable<MainLocation>{
        return this.http.get<{DailyForecasts: IForecastWeatherResponse[]}>(`${this.proxy}${this.forcastUrl}${location.key}?apikey=${this.key}&details=true&metric=true`)
            .pipe(map(this.mapForecastResponse, this), map(weatherData => {
                location.forecastWeather = weatherData;
                return location;
            }), catchError(this.handleWeatherDataError.bind(this)))
    }
    
    private mapCurrWeather(responseArr: ICurrentWeatherResponse[]): CurrentWeather{
        const responseObj = responseArr[0];
        const localTime = responseObj.LocalObservationDateTime;
        const description = {
            icon: responseObj.WeatherIcon,
            text: responseObj.WeatherText,
        };
        const temp = {
            actual: Math.round(responseObj.Temperature.Metric.Value),
            feelsLike: Math.round(responseObj.RealFeelTemperature.Metric.Value),
        };
        const isDayTime = responseObj.IsDayTime;
        const humidity = responseObj.RelativeHumidity;
        const wind = {
            direction: responseObj.Wind.Direction.Degrees,
            speed: {
                value: Math.round(responseObj.Wind.Speed.Metric.Value),
                unit: responseObj.Wind.Speed.Metric.Unit,
            }
        };
        const uv = {
            index: responseObj.UVIndex,
            text: responseObj.UVIndexText
        };
        const visibility = {
            value: Math.round(responseObj.Visibility.Metric.Value),
            unit: responseObj.Visibility.Metric.Unit,
        };
        const cloudsCover = responseObj.CloudCover;
        return new CurrentWeather(localTime, description, wind, isDayTime, humidity, cloudsCover, temp, uv, visibility);
    }
    
    private mapForecastResponse(response: {DailyForecasts: IForecastWeatherResponse[]}): ForecastWeather[]{
        const forecastArrRes = response.DailyForecasts;
        const forecastObjArr = forecastArrRes.map(forecastResObject => this.createForecastObj(forecastResObject));
        return forecastObjArr;
    }
    
    private createForecastObj(forecastResObj: IForecastWeatherResponse): ForecastWeather{
        const localTime = forecastResObj.Date;
        const description = {
            /* in the description forecast we use only the value for day and ignore the value for night... */
            icon: forecastResObj.Day.Icon,
            text: forecastResObj.Day.IconPhrase,
        };
        const wind = {
            speed: {
                value: Math.round(Math.max(forecastResObj.Day.Wind.Speed.Value, forecastResObj.Night.Wind.Speed.Value)),
                unit: forecastResObj.Day.Wind.Speed.Unit
            },
            direction: forecastResObj.Day.Wind.Direction.Degrees,
        };
        const temp = {
            min: Math.round(forecastResObj.Temperature.Minimum.Value),
            max: Math.round(forecastResObj.Temperature.Maximum.Value),
        };
        const sunshineDuration = forecastResObj.HoursOfSun;
        const sun = {
            rise: forecastResObj.Sun.Rise,
            set: forecastResObj.Sun.Set,
        }
        const moon = {
            rise: forecastResObj.Moon.Rise,
            set: forecastResObj.Moon.Set,
        }
        const rainProb = Math.round(Math.max(forecastResObj.Day.PrecipitationProbability, 
                         forecastResObj.Night.PrecipitationProbability));
        const precipitation = {
            /* in the precipitation forecast we use the higher probability value between day and night as the 
               total day's probability of precipitation. and we combine the expected rainfall in the day and the
               night for the total day's rainfall value. */
            probability: rainProb,
            total: {
                /* sometimes even if the probability for precipitation is zero the totalLiquid value can be positive
                   which does'nt make any sense, so we check and correct it here */
                value: rainProb > 0 ? Math.round(forecastResObj.Day.TotalLiquid.Value + 
                                                 forecastResObj.Night.TotalLiquid.Value) : 0,
                unit: forecastResObj.Day.TotalLiquid.Unit,
            }
        }
        return new ForecastWeather(localTime, description, wind, temp, sunshineDuration, sun, moon, precipitation);
    }
    
    private handleWeatherDataError(error: HttpErrorResponse) { 
        let errorMsg: string;
        let locationKey: string;
        if (error.error instanceof ErrorEvent) {
            // A client-side or network error occurred. 
            errorMsg = `${error.error.message}`;
        } 
        else if(!!error.status || !!error.error){
            // The backend returned an unsuccessful response code.
            errorMsg = `${error.status}: ${error.error.Message ? error.error.Message : error.error}`;
        }
        locationKey = this.extractLocationKeyFromUrl(error.url);
        const errObj = {
            locationKey: locationKey,
            message: errorMsg
        }
        // return an observable with the new error object
        return throwError(errObj);
    };
    
    private extractLocationKeyFromUrl(url: string): string{
        /* Regex explained: 
           (1) => ([\s\S]*\/) => catches all url part prior to key
           (2) => (([\s\S](?!\/))*) => catches the key part
           (3) => (\?[\s\S]*) => catches the question mark for parameters and all of the parameters
        */
        const locationKey = url.replace(/([\s\S]*\/)(([\s\S](?!\/))*)(\?[\s\S]*)/g, '$2');
        return locationKey;
    }
    
}
