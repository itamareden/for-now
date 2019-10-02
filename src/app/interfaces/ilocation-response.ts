export interface ILocationResponse {
    LocalizedName: string;
    AdministrativeArea: {
        ID: string,
        LocalizedName: string
    };
    Country: {
        ID: string,
        LocalizedName: string
    };
    Key: string;
}
