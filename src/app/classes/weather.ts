export class Weather {
    
    readonly localTime: string;
    readonly description: {icon: number, text: string};
    readonly wind: {direction: number, speed: {value: number, unit: string} };
    
    constructor(localTime: string, 
                description: {icon: number, text: string}, 
                wind: {direction: number, speed: {value: number, unit: string}}){
        this.localTime = localTime;
        this.description = description;
        this.wind = wind;
    }
    
    
    celsiusToFahrenheit(degreesInCelsius: number): number{
        return Math.round(1.8 * degreesInCelsius + 32);
    }
    
    private kilometerToMile(dataInKilometer: number): number{
        return Math.round(dataInKilometer * 0.62137119);
    }
    
    private mmToInches(rainInMm: number): number{
        const rainInInches = rainInMm / 25.4;
        return Math.round(10 * rainInInches) / 10;
    }
    
    private cmToFeet(valInCm: number): number{
        const valInFeet = valInCm / 30.48;
        return Math.round(10 * valInFeet) / 10;
    } 
    
    convertMetricToImperial(dataObj: {value: number, unit: string}): string{
        switch(dataObj.unit){
            case "mm":    
                // millimeter => inch
                return `${this.mmToInches(dataObj.value)}in`;
            case "cm": {   
                // centimeter => inch or feet
                if(dataObj.value > 30){
                    // 30 cm is 1 feet so it's more convenient 
                    return `${this.cmToFeet(dataObj.value)}ft`;
                }
                else{
                    return `${10 * this.mmToInches(dataObj.value)}in`;
                }
            }
            case "m":     
                // meter => feet
                return `${10 * this.cmToFeet(dataObj.value)}ft`;
            case "km":     
                // kilometer => mile
                return `${this.kilometerToMile(dataObj.value)}mi`;
            case "km/h":     
                // kilometer per hour => mile per hour 
                return `${this.kilometerToMile(dataObj.value)}mi/h`;
            default :
                return null;    
        }
    }
    
    setMetricValue(dataObj: {value: number, unit: string}): string{
        // for temperature we don't need since we just use °
        return `${dataObj.value}${dataObj.unit}`
    }
    
    setWindSpeed(): string{
        const speed = this.wind.speed.value;
        if(speed > 40){
            return '0.4s';    
        }
        else if(speed > 30){
            return '0.8s';
        }
        else if(speed > 20){
            return '1.3s';
        }
        else if(speed > 10){
            return '2s';
        }
        else if(speed > 0){
            return '3s';
        }
    }
    
    getWeatherImageSrc(): string{
        const weatherIconsURLPrefix = `https://vortex.accuweather.com/adc2010/images/slate/icons/`;
        return `${weatherIconsURLPrefix}${this.description.icon}.svg`;
    }
    
    generateDateTemplate(): string{
        /*   the structure is like this: 2019-09-03T10:52:00-07:00*/
        const [date, time] = this.localTime.split("T");    // => [2019-09-03, 10:52:00-07:00]
        const [year, monthStr, day] = date.split("-"); // => [2019, 09, 03]
        const [timeOfDay, timezone] = time.split("-"); // => [10:52:00, 07:00]
        const [hours, minutes, seconds] = timeOfDay.split(":"); // => [10, 52, 00]
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        // convert monthStr into a number and subtract 1 to matche the month's name
        const month = monthNames[+monthStr - 1];
        return `${month}-${day}, ${hours}:${minutes}`;
    }
    
}
