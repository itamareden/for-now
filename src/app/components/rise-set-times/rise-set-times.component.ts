import { Component, OnInit, OnDestroy, Input, ElementRef, ViewChild, HostListener } from '@angular/core';
import { interval, Subscription } from 'rxjs';  
import { map, takeWhile } from 'rxjs/operators';

@Component({
  selector: 'rise-set-times',
  templateUrl: './rise-set-times.component.html',
  styleUrls: ['./rise-set-times.component.scss']
})
export class RiseSetTimesComponent implements OnInit, OnDestroy {
    /* the size of this component is derived from the size of its parent element (100%).
       we take the measurements of the parent element and use them to determine the size 
       of radius-x and radius-y, the 2 radiuses of the ellipse. 
       the formula for the radiuses is:
       radius-x = (width of parent element - 40) / 2
       radius-y = height of parent element - 35
   */
    
    @Input() times: {rise: string, set: string};
    @Input() colors: {orbit: string, line: string, text: string} = {orbit: '#fff007', line: 'black', text: 'black'};
    @ViewChild('container') container: ElementRef;
    
    riseCoordinates: [number, number];
    setCoordinates: [number, number];
    centerCoordinates: [number, number];
    arcStartCoordinates: [number, number];
    radiusX: number;
    radiusY: number;
    readonly horizontalMargins = 20;
    readonly topMargins = 12;
    readonly bottomMargins = 3;
    readonly textHeight = 20;
    ellipsePath: string;
    underlinePath: string;
    arcPath: string;
    isReady = false;
    animationFinished = false;
    setOccured = false;
    orbitSubscription: Subscription;
    
    constructor() { }
    
    ngOnInit() {
        if(!this.ValidateTimes()){
            throw Error("times provided are invalid"); 
            return;
        }
        this.buildView();
        this.animateOrbitProgress();
    }
    
    buildView(){
        // extract component's measurements
        const totalWidth = this.container.nativeElement.offsetWidth;
        const totalHeight = this.container.nativeElement.offsetHeight;
        // initialize radiuses based on component's measurements and view's constraints
        this.radiusX = (totalWidth - 2 * this.horizontalMargins) / 2;
        this.radiusY = totalHeight - this.topMargins - this.bottomMargins - this.textHeight;
        // initialize points coordinates for: rise time, set time, underline's center and  arc start on ellipse
        this.initializePointsCoordinates();
        // initialize paths for ellipse and the underline
        this.ellipsePath = this.generateHalfEllipsePath();
        this.underlinePath = this.generateUnderlinePath();
        // render the view
        this.isReady = true;
    }
    
    initializePointsCoordinates(){
        // equal for all points: rise center and set
        const yValue = this.topMargins + this.radiusY;
        this.riseCoordinates = [this.horizontalMargins, yValue];
        this.setCoordinates = [this.horizontalMargins + 2 * this.radiusX, yValue];
        // it's in the middle so the average of rise and set
        const centerXValue = (this.riseCoordinates[0] + this.setCoordinates[0]) / 2;
        this.centerCoordinates = [centerXValue, yValue];
        // initialize to start of ellipse, which is the starting point for the animation.
        this.arcStartCoordinates = [this.horizontalMargins, yValue];
    }
    
    /* calculates the time from rise (i.e. sunrise or moonrise) until now as a % of time 
       from rise to set. */
    getElapsedTimeRatio(): number{
        const riseTime = new Date(this.times.rise).getTime();
        const setTime = new Date(this.times.set).getTime();
        const now = new Date().getTime();
        const elapsedRatio = (now - riseTime) / (setTime - riseTime); 
        return elapsedRatio > 1 ? 1 : elapsedRatio < 0 ? 0 : elapsedRatio;
    }
    
    ValidateTimes(): boolean{
        const riseTime = new Date(this.times.rise).getTime();
        const setTime = new Date(this.times.set).getTime();
        if(!isNaN(riseTime.valueOf()) && !isNaN(setTime.valueOf()) && setTime > riseTime){
            return true;
        }
        return false;
    }
    
    /* calculates the coordinates of the point from which the arc starts. this point is also the point of the
       big circle which depicts the star (i.e sun or moon). 
       the arc is the non-dashed line which describes the part of the rise - set interval already elapsed. 
       the arc starts from this point (whose coordinates are returned from this function) and ends at 
       riseCoordinates.
       this function has 1 parameter: elapsedRatio. it's value is between 0 and 1 => 0 means we're before
       or at sunrise and 1 means we're after or at sunset */
    calculateArcStartCoordinates(elapsedRatio: number): [number, number]{
        const x = Math.round(1000 * (this.centerCoordinates[0] + Math.cos(elapsedRatio * Math.PI) * this.radiusX * -1)) / 1000;
        const y = Math.round(1000 * (this.centerCoordinates[1] + Math.sin(elapsedRatio * Math.PI) * this.radiusY * -1)) / 1000;
        return [x, y];
    }
    
    generateHalfEllipsePath(): string{
        return `M${this.setCoordinates.toString()} A${this.radiusX} ${this.radiusY} 0 0 0 ${this.riseCoordinates.toString()}`;
        
    }
    
    /* the structure is: 
       M(starting point x,y) => in our case it's the start of the arc
       A(radius x, radius y , 0 0 0, end point x,y) => draw the arc based on the radius and the end point, which in 
       our case is the rise point */
    generateArcPath(elapsedRatio: number): string{
        if(elapsedRatio === 0){
            // no arc is needed since sun/moon rise hasn't started yet..
            return "";
        }
        else{
            let path: string;
            this.arcStartCoordinates = this.calculateArcStartCoordinates(elapsedRatio);
            path = `M${this.arcStartCoordinates.toString()} A${this.radiusX} ${this.radiusY} 0 0 0 ${this.riseCoordinates.toString()}`
            if(elapsedRatio === 1){
                /* sunset/moonset occured. we use this flag in the template to show/hide the big circle */
                this.setOccured = true;
            }
            return path;
        }
    }
    
    generateUnderlinePath(): string{
        const startCoordinates = [this.riseCoordinates[0] - this.horizontalMargins, this.riseCoordinates[1]];
        const endCoordinates = [this.setCoordinates[0] + this.horizontalMargins, this.setCoordinates[1]];
        return `M${startCoordinates.toString()} L${endCoordinates.toString()}`;
    }
    
    getTimeFormat(date: string): string{
        // the structure is like this: 2019-09-13T11:02:00-07:00 
        const [dateStr, time] = date.split("T");    
        const [timeOfDay, timezone] = time.split("-"); 
        const [hours, minutes, seconds] = timeOfDay.split(":"); 
        return `${hours}:${minutes}`;
    }
    
    /* set the size of the "star" (i.e. the big circle), based on the measurements of the ellipse (i.e. the radiuses) */
    setStarSize(): string{
        if(this.radiusX >= 100 && this.radiusY >= 100){
            return "12";
        }
        else if(this.radiusX >= 80 && this.radiusY >= 80){
            return "10";
        }
        else if(this.radiusX >= 60 && this.radiusY >= 60){
            return "8";
        }
        else if(this.radiusX >= 40 && this.radiusY >= 40){
            return "6";
        }
        else{
            return "4";
        }
    }
    
    animateOrbitProgress(){
        const stopValue = this.getElapsedTimeRatio();
        this.orbitSubscription = interval(50)
            .pipe(map(counter => counter / 100), 
                  takeWhile(counter => counter < stopValue)
             )
            .subscribe(
                counter => this.arcPath = this.generateArcPath(counter),
                e => console.log(e),
                () => {
                    this.arcPath = this.generateArcPath(stopValue);
                    this.animationFinished = true;
                }
            );
    }
    
    ngOnDestroy(){
        this.orbitSubscription.unsubscribe();
    }
    
    @HostListener('window:resize', ['$event'])
    onResize(event: Event) {
        /* since the app is responsive the size of the parent element may change when the screen size 
           changes so we need to update the view (size of radiuses, coordinates of points etc...) */
        this.buildView();
        if(this.animationFinished){
            /* the value of the arc path is constantly being calculated during the time the animation
               is running and only then. so if the animation has finished and then the visitor changes 
               the size of the screen we need to update the arc path manually */ 
            this.arcPath = this.generateArcPath(this.getElapsedTimeRatio());
        }
    }

}
