import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { appRouterModule } from "./routes/app.routes";
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

import { StoreModule } from '@ngrx/store';
import { EffectsModule } from '@ngrx/effects';
import { LocationEffects } from './store/effects/location.effects';
import { ConfigEffects } from './store/effects/config.effects';
import { appReducers } from './store/reducers/app.reducers';

import { LocationAutocompleteService } from './services/location-autocomplete.service';
import { WeatherDataService } from './services/weather-data.service';
import { LocalStorageService } from "./services/local-storage.service";

import { AppComponent } from './app.component';
import { HeaderComponent } from './components/header/header.component';
import { SearchLocationComponent } from './components/search-location/search-location.component';
import { CurrentWeatherWidgetComponent } from './components/current-weather-widget/current-weather-widget.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { FavoritesPageComponent } from './components/favorites-page/favorites-page.component';
import { FavoriteLocationWidgetComponent } from './components/favorite-location-widget/favorite-location-widget.component';
import { MainLocationWidgetComponent } from './components/main-location-widget/main-location-widget.component';
import { ForecastWidgetComponent } from './components/forecast-widget/forecast-widget.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { RiseSetTimesComponent } from './components/rise-set-times/rise-set-times.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SearchLocationComponent,
    CurrentWeatherWidgetComponent,
    HomePageComponent,
    FavoritesPageComponent,
    FavoriteLocationWidgetComponent,
    MainLocationWidgetComponent,
    ForecastWidgetComponent,
    RiseSetTimesComponent,
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    appRouterModule,
    FontAwesomeModule,
    StoreModule.forRoot(appReducers),
    EffectsModule.forRoot([LocationEffects, ConfigEffects]),
    NgbModule.forRoot(),
  ],
  providers: [LocationAutocompleteService, WeatherDataService, LocalStorageService],
  bootstrap: [AppComponent]
})
export class AppModule {}
