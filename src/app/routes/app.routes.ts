import { Routes,RouterModule } from '@angular/router';
import { HomePageComponent } from '../components/home-page/home-page.component';
import { FavoritesPageComponent } from '../components/favorites-page/favorites-page.component';
import { CurrentWeatherWidgetComponent } from '../components/current-weather-widget/current-weather-widget.component';

const routes: Routes = [
    {
        path: 'location/:countryID/:regionID/:city',
        component: HomePageComponent
    },
    {
        path: 'favorites',
        component: FavoritesPageComponent
    },
    {
        path: '**',
        component: HomePageComponent,
    },
];

export const appRouterModule = RouterModule.forRoot(routes);
