import { Weather } from "./weather";

export class CurrentWeather extends Weather{
    
    readonly isDayTime: boolean;
    readonly humidity: number;
    readonly cloudsCover: number;
    readonly temp: {actual: number, feelsLike: number};
    readonly uv: { index: number, text: string };
    readonly visibility: {value: number, unit: string};
    
    constructor(localTime: string, 
                description: {icon: number, text: string}, 
                wind: {direction: number, speed: {value: number, unit: string}},
                isDayTime: boolean,
                humidity: number,
                cloudsCover: number,
                temp: {actual: number, feelsLike: number},
                uv: {index: number, text: string},
                visibility: {value: number, unit: string}){
        super(localTime, description, wind);
        this.isDayTime = isDayTime;
        this.humidity = humidity;
        this.cloudsCover = cloudsCover;
        this.temp = temp;
        this.uv = uv;
        this.visibility = visibility;
    }
    
    calculateTimeSinceLastUpdate(): string{ 
        let timeDescription: [number, string];
        const lastUpdate = new Date(this.localTime);
        const now = new Date().getTime();
        const lastUpdateTime = lastUpdate.getTime();
        const intervalInMinutes = (now - lastUpdateTime) / (1000 * 60);
        if(intervalInMinutes < 60){
            timeDescription = [Math.round(intervalInMinutes), "minutes"];
        }
        else if(intervalInMinutes < 120){
            timeDescription = [1, "hour"];
        }
        else if(intervalInMinutes < 1440){  // minutes in 1 day
            timeDescription = [Math.round(intervalInMinutes / 60), "hours"];
        }
        else if(intervalInMinutes < 2880){  // minutes in 2 days
            timeDescription = [1, "day"];
        }
        else{
            timeDescription = [Math.round(intervalInMinutes / 1440), "days"];
        }
        return timeDescription.join(" ");
    }
}
