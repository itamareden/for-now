export interface IForecastWeatherResponse {
    Date: string;
    Sun: {
        Rise: string,
        Set: string,
    };
    Moon: {
        Rise: string,
        Set: string,
        Age: number,
    };
    Temperature: {
        Minimum: {
          Value: number,
        },
        Maximum: {
          Value: number,
        }
    };
    HoursOfSun: number;
    Day: {
        Icon: number,
        IconPhrase: string,
        PrecipitationProbability: number,
        TotalLiquid: {
          Value: number,
          Unit: string,
        },
        Wind: {
          Speed: {
            Value: number,
            Unit: string,
          },
          Direction: {
            Degrees: number,
          }
        },
    };
    Night: {
        Icon: number,
        IconPhrase: string,
        PrecipitationProbability: number,
        TotalLiquid: {
          Value: number,
        },
        Wind: {
            Speed: {
            Value: number,
          },
          Direction: {
            Degrees: number,
          }
        },
    };
}
