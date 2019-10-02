import { Location } from "./location";

export class FavoriteLocation extends Location{
    
    constructor(city: string, region: string, country: string, countryID: string, key: string){
        super(city, region, country, countryID, key);
        this.isFavorite = true;
    }
    
}
