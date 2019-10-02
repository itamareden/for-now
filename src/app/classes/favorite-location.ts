import { Location } from "./location";
import { ILocationDetails } from "../interfaces/ilocation-details";

export class FavoriteLocation extends Location{
    
    constructor(details: ILocationDetails){
        super(details);
        this.isFavorite = true;
    }
    
}
