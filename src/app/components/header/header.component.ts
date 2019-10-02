import { Component, OnInit, HostListener, ElementRef, ViewChild } from '@angular/core';

import { shareReplay } from 'rxjs/operators';   
import { Store, select } from '@ngrx/store';
import { IAppState } from "../../store/state/app.state";
import { selectMeasurementSystem } from "../../store/selectors/config.selectors"; 
import { GetMeasurementSystem, UpdateMeasurementSystem } from "../../store/actions/config.actions";
import { GetSelectedLocation } from "../../store/actions/location.actions";
import { MainLocation } from '../../classes/main-location';   
import { faBars } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html', 
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
    
    @ViewChild('ms') msContainer: ElementRef;
    @ViewChild('iconContainer') iconContainer: ElementRef;
     
    // since in the template we have 2 async pipes, we share the data in 1 subscription...
    measureSystem = this.store.pipe(select(selectMeasurementSystem), shareReplay(1));
    isShowMenu = false;
    menuIcon = faBars;
  
    constructor(private store: Store<IAppState>) { }

    ngOnInit() {
        this.store.dispatch(new GetMeasurementSystem());
    }
    
    updateMeasurementSystem(newSystem: string){
        this.store.dispatch(new UpdateMeasurementSystem(newSystem));
    }
    
    navigateToHomePage(){
        const defaultLocation = new MainLocation("Tel Aviv", "TA", "Israel", "IL", "215854");
        this.store.dispatch(new GetSelectedLocation(defaultLocation));
    }
    
    
    @HostListener('window:click', ['$event']) 
    clickEvent(event: MouseEvent){
        /* first check if the click was on the icon because then there is nothing to do here since we deal with it
           in the template. then check if the measurement-system element is defined (visible) and if the click
           was on it. If it was, it means that the menu is open but we don't want to close it. we only want to 
           close it if the click is on somewhere in the window or inside the menu but not on measurement-system  */
        if(!this.iconContainer.nativeElement.contains(event.target) && 
           this.msContainer && 
           !this.msContainer.nativeElement.contains(event.target)){
            this.isShowMenu = false;
        }
    }

}
