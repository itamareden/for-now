import { Component, OnInit, Input, ViewEncapsulation } from '@angular/core';

import { Store } from '@ngrx/store';
import { IAppState } from "../../store/state/app.state";
import { AddFavoriteLocation, RemoveFavoriteLocation } from "../../store/actions/location.actions";
import { MainLocation } from "../../classes/main-location";
import { faCompass, faHeart as faOpenHeart } from '@fortawesome/free-regular-svg-icons'; 
import { faFan, 
         faTint, 
         faWind, 
         faBinoculars, 
         faSun, 
         faCloud, 
         faLocationArrow, 
         faMoon,
         faHeart} from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'current-weather-widget',
  templateUrl: './current-weather-widget.component.html',
  styleUrls: ['./current-weather-widget.component.scss'],
  // for ng-bootstrap's tooltip
  encapsulation: ViewEncapsulation.None, 
})
export class CurrentWeatherWidgetComponent implements OnInit {
    
    @Input() location: MainLocation;
    @Input() ms: string;
    dropIcon = faTint;
    windIcon = faWind;
    fanIcon = faFan;
    binocularsIcon = faBinoculars;
    sunIcon = faSun;
    cloudIcon = faCloud;
    arrowIcon = faLocationArrow;
    compassIcon = faCompass;
    moonIcon = faMoon;
    heartIcon = faHeart;
    openHeartIcon = faOpenHeart;
    
    constructor(private store: Store<IAppState>){}
    
    ngOnInit() { }
    
    /* unlike with the sun, the moonrise can be after the moonset in any given day. 
       in this case we'll use the moonset of the subsequent day. 
       also, albeit seldom, there are days with no moonrise or moonset at all (because the moonrise/set 
       took place just minutes prior to midnight..). in that case the value for moonrise will be midnight 
       and for moonset we'll use the value from the subsequent day */
    getAppropriateMoonTimes(): {rise: string, set: string}{
        let moonrise = this.location.forecastWeather[0].moon.rise;
        let moonset = this.location.forecastWeather[0].moon.set;
        if(moonrise === null){
            /* if moonrise is null moonset cannot be null! set moonrise to midnight 
               the format is this: 2019-09-13T14:13:00+03:00 
               we replace it to: 2019-09-13T00:00:00-07:00*/
            moonrise = moonset.replace(/\d{2}:\d{2}:\d{2}/g, "00:00:00");
        }
        else if(moonset === null){
            moonset = this.location.forecastWeather[1].moon.set;
        }
        else{
            const todayMoonriseTime = new Date(moonrise).getTime();
            const todayMoonsetTime =new Date(moonset).getTime();
            if(!isNaN(todayMoonriseTime.valueOf()) && !isNaN(todayMoonsetTime.valueOf()) && 
               todayMoonriseTime > todayMoonsetTime){
                /* both moonrise and moonset occour on same day. check if moonrise is after moonset
                   and if so, take the value for moonset from the subsequent day */
                moonset = this.location.forecastWeather[1].moon.set;
            }
        }
        return {
            rise: moonrise,
            set: moonset,
        }
    }
    
    setViewBasedOnTimeOfDay(): string{
        if(!this.location.currentWeather.isDayTime){
            return 'cww-night-view';
        }
        return null;
    }
    
    setMoonTimesColors(): {area: string, line: string, text: string}{
        const colors = {
            area: '#d3d3d3de',
            line: '#898989',
            text: 'black'
        }
        if(!this.location.currentWeather.isDayTime){
            colors.area = 'lightgrey';
            colors.line = 'white';
            colors.text = 'white';
        }
        return colors;
    }
    
    setSunTimesColors(): {area: string, line: string, text: string}{
        const colors = {
            area: '#fff007a8',
            line: '#898989',
            text: 'black'
        }
        if(!this.location.currentWeather.isDayTime){
            colors.area = '#fcf89fd9';
            colors.line = 'white';
            colors.text = 'white';
        }
        return colors;
    }
    
    setDirectionAngle(): string{
        // the icon has an initial rotation of 45 degrees... we fix it here.
        const startAngle = -45;
        const finalAngle = startAngle + this.location.currentWeather.wind.direction;
        return `rotate-${finalAngle}`;
    }
    
    toggleFavorite(){
        if(this.location.isFavorite){
            this.store.dispatch(new RemoveFavoriteLocation(this.location));
            this.location.isFavorite = false; 
        }
        else{
            this.store.dispatch(new AddFavoriteLocation(this.location));
            this.location.isFavorite = true;
        }
    }

}
