import { Action } from '@ngrx/store';
import { Location } from '../../classes/location';
import { MainLocation } from '../../classes/main-location';
import { FavoriteLocation } from '../../classes/favorite-location';
import { ILocationDetails } from '../../interfaces/ilocation-details';

export enum ELocationActions{
    getSelectedLocation = '[Location] Get Selected Location',
    getSelectedLocationSuccess = '[Location] Get Selected Location Success',
    getSelectedLocationData = '[Location] Get Selected Location Data',
    getSelectedLocationDataSuccess = '[Location] Get Selected Location Data Success',
    getSelectedLocationDataError = '[Location] Get Selected Location Data Error',
    getAllFavoriteLocations = '[Location] Get All Favorite Locations',
    getAllFavoriteLocationsSuccess = '[Location] Get All Favorite Locations Success',
    getAllFavoriteLocationsData = '[Location] Get All Favorite Locations Data',
    getFavoriteLocationDataSuccess = '[Location] Get Favorite Location Success',
    getFavoriteLocationDataError = '[Location] Get Favorite Location Error',  
    addFavoriteLocation = '[Location] Add Favorite Location',
    addFavoriteLocationSuccess = '[Location] Add Favorite Location Success',
    removeFavoriteLocation = '[Location] Remove Favorite Location',
    removeFavoriteLocationSuccess = '[Location] Remove Favorite Location Success',
    addOrRemoveFavoriteLocationError = '[Location] Add Or Remove Favorite Location Error',
    getHomeLocationOnLoad = '[Location] Get Home Location On Load',
    getHomeLocationOnLoadSuccess = '[Location] Get Home Location On Load Success',
    updateHomeLocation = '[Location] Update Home Location',
    updateHomeLocationSuccess = '[Location] Update Home Location Success',
}

export class GetSelectedLocation implements Action{
    public readonly type = ELocationActions.getSelectedLocation;
    constructor(public payload: Location){}
}
    
export class GetSelectedLocationSuccess implements Action{
    public readonly type = ELocationActions.getSelectedLocationSuccess;
    constructor(public payload: MainLocation){}
}
    
export class GetSelectedLocationData implements Action{
    public readonly type = ELocationActions.getSelectedLocationData;
    constructor(public payload: MainLocation){}
}
    
export class GetSelectedLocationDataSuccess implements Action{
    public readonly type = ELocationActions.getSelectedLocationDataSuccess;
    constructor(public payload: MainLocation){}
}
    
export class GetSelectedLocationDataError implements Action{
    public readonly type = ELocationActions.getSelectedLocationDataError;
}
    
export class GetAllFavoriteLocations implements Action{
    public readonly type = ELocationActions.getAllFavoriteLocations;
}
    
export class GetAllFavoriteLocationsSuccess implements Action{
    public readonly type = ELocationActions.getAllFavoriteLocationsSuccess;
    constructor(public payload: FavoriteLocation[]){}
}
    
export class GetAllFavoriteLocationsData implements Action{
    public readonly type = ELocationActions.getAllFavoriteLocationsData;
}
    
export class GetFavoriteLocationDataSuccess implements Action{  
    public readonly type = ELocationActions.getFavoriteLocationDataSuccess;
    constructor(public payload: FavoriteLocation){}
}
    
export class GetFavoriteLocationDataError implements Action{  
    public readonly type = ELocationActions.getFavoriteLocationDataError;
    constructor(public payload: string){}
}
    
export class AddFavoriteLocation implements Action{
    public readonly type = ELocationActions.addFavoriteLocation;
    constructor(public payload: FavoriteLocation){}
}
    
export class AddFavoriteLocationSuccess implements Action{
    public readonly type = ELocationActions.addFavoriteLocationSuccess;
    constructor(public payload: FavoriteLocation){}
}
    
export class RemoveFavoriteLocation implements Action{
    public readonly type = ELocationActions.removeFavoriteLocation;
    constructor(public payload: FavoriteLocation){}
}
    
export class RemoveFavoriteLocationSuccess implements Action{
    public readonly type = ELocationActions.removeFavoriteLocationSuccess;
    constructor(public payload: FavoriteLocation){}
}
    
export class AddOrRemoveFavoriteLocationError implements Action{
    public readonly type = ELocationActions.addOrRemoveFavoriteLocationError;
    constructor(public payload: FavoriteLocation[]){}
}
    
export class GetHomeLocationOnLoad implements Action{
    public readonly type = ELocationActions.getHomeLocationOnLoad;
}
    
export class GetHomeLocationOnLoadSuccess implements Action{
    public readonly type = ELocationActions.getHomeLocationOnLoadSuccess;
    constructor(public payload: ILocationDetails){}
}
    
export class UpdateHomeLocation implements Action{
    public readonly type = ELocationActions.updateHomeLocation;
    constructor(public payload: ILocationDetails){}
}
    
export class UpdateHomeLocationSuccess implements Action{
    public readonly type = ELocationActions.updateHomeLocationSuccess;
    constructor(public payload: ILocationDetails){}
}
    
export type LocationActions = GetSelectedLocation | 
                              GetSelectedLocationSuccess |
                              GetSelectedLocationData |
                              GetSelectedLocationDataSuccess |
                              GetSelectedLocationDataError |
                              GetAllFavoriteLocations | 
                              GetAllFavoriteLocationsSuccess | 
                              GetAllFavoriteLocationsData |
                              GetFavoriteLocationDataSuccess | 
                              GetFavoriteLocationDataError | 
                              AddFavoriteLocation |
                              AddFavoriteLocationSuccess |
                              RemoveFavoriteLocation |
                              RemoveFavoriteLocationSuccess |
                              AddOrRemoveFavoriteLocationError |
                              GetHomeLocationOnLoadSuccess | 
                              GetHomeLocationOnLoad | 
                              UpdateHomeLocation |
                              UpdateHomeLocationSuccess;