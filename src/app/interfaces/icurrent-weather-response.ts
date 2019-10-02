export interface ICurrentWeatherResponse {  
    LocalObservationDateTime: string;
    WeatherText: string;
    WeatherIcon: number;
    IsDayTime: boolean;
    Temperature: {
        Metric: {
            Value: number,
            Unit: string,
        },
    };
    RealFeelTemperature: {
      Metric: {
            Value: number,
            Unit: string,
        },
    };
    RelativeHumidity: number;
    Wind: {
      Direction: {
        Degrees: number,
      },
      Speed: {
        Metric: {
            Value: number,
            Unit: string,
        },
      }
    };
    UVIndex: number;
    UVIndexText: string;
    CloudCover: number;
    Visibility: {
        Metric: {
            Value: number,
            Unit: string,
        },
    };
}
