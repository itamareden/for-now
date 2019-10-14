import { Weather } from "./weather";

export class ForecastWeather extends Weather{
    
    readonly temp: {min: number, max: number};
    readonly sunshineDuration: number;
    readonly sun: {rise: string, set: string};
    readonly moon: {rise: string, set: string};
    readonly precipitation: {probability: number, total: {value: number, unit: string}};
    
    constructor(localTime: string, 
                description: {icon: number, text: string}, 
                wind: {direction: number, speed: {value: number, unit: string}},
                temp:  {min: number, max: number},
                sunshineDuration: number,
                sun: {rise: string, set: string},
                moon: {rise: string, set: string},
                precipitation: {probability: number, total: {value: number, unit: string}}){
        super(localTime, description, wind);
        this.temp = temp;
        this.sunshineDuration = sunshineDuration;
        this.sun = sun;
        this.moon = moon;
        this.precipitation = precipitation;
    } 
    
    /* override the method in parent */
    generateDateTemplate(): string{
        /*   the structure is like this: 2019-09-03T10:52:00-07:00*/
        const [date, time] = this.localTime.split("T");    // => [2019-09-03, 10:52:00-07:00]
        const [year, monthStr, day] = date.split("-"); // => [2019, 09, 03]
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        // convert monthStr into a number and subtract 1 to matche the month's name
        const month = monthNames[+monthStr - 1];
        return `${month}-${day}`;
    }
    
    getDayOfWeek(): string{
        const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const dayOfWeek = dayNames[new Date(this.localTime).getDay()];
        return `${dayOfWeek}`;
    }
    
    calcDaylightDuration(): number{
        const start = new Date(this.sun.rise).getTime();
        const end = new Date(this.sun.set).getTime();
        const lengthInMinutes = Math.round((end - start) / (60 * 1000));
        return lengthInMinutes;
    }
    
    setDurationInTimeFormat(lengthInMinutes: number): string{
        const hours = Math.floor(lengthInMinutes / 60);
        const minutes = Math.round(lengthInMinutes - 60 * hours);
        const hoursStr = hours > 9 ? hours : '0' + hours;
        const minutesStr = minutes > 9 ? minutes : '0' + minutes;
        return `${hoursStr}:${minutesStr}`;
    }
    
}
