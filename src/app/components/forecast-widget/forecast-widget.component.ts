import { Component, OnInit, Input } from '@angular/core';

import { faFan, faCloudRain, faWind, faCloudSun } from '@fortawesome/free-solid-svg-icons';
import { ForecastWeather } from '../../classes/forecast-weather';

@Component({
  selector: 'forecast-widget',
  templateUrl: './forecast-widget.component.html',
  styleUrls: ['./forecast-widget.component.scss']
})
export class ForecastWidgetComponent implements OnInit {
    
    @Input() dailyForecast: ForecastWeather;
    @Input() ms: string;
    windIcon = faWind;
    fanIcon = faFan;
    rainIcon = faCloudRain;
    cloudSunIcon = faCloudSun;

    constructor() { }

    ngOnInit() { }

}
