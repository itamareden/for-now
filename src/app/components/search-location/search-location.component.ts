import { Component, OnInit, ViewChild, ElementRef, HostListener } from '@angular/core'; 
import { Store } from '@ngrx/store';
import { fromEvent, of, Subscription } from 'rxjs';   
import { debounceTime, switchMap, tap, catchError, delay } from 'rxjs/operators';

import { LocationAutocompleteService } from '../../services/location-autocomplete.service';
import { Location } from "../../classes/location";
import { MainLocation } from "../../classes/main-location";
import { IAppState } from "../../store/state/app.state";
import { GetSelectedLocation } from "../../store/actions/location.actions";

@Component({
  selector: 'search-location',
  templateUrl: './search-location.component.html',
  styleUrls: ['./search-location.component.scss']
})
export class SearchLocationComponent implements OnInit {
    
    @ViewChild('input') inputElm: ElementRef<HTMLInputElement>;
    @ViewChild('resultsContainer') resultsContainer: ElementRef<HTMLElement>;
    searchResults: Location[];
    isThinking = false;
    isError = false;
    enableResults = false;
    errorMsg: string;
    highlightedLocationIndex = -1;
    tip = `For example: Amsterdam`;
    searchBoxInputSubscription: Subscription;
    searchBoxBlurSubscription: Subscription;
    
    constructor(private lac: LocationAutocompleteService, private store: Store<IAppState>) { }

    ngOnInit() {
        this.manageAutocomplete();
        this.onInputBlur();
    }
    
    manageAutocomplete() {
        this.searchBoxInputSubscription = fromEvent(this.inputElm.nativeElement, 'input')
            .pipe(
                tap(() => {
                    this.isThinking = true;
                    this.isError = false;
                }),
                debounceTime(1000),
                switchMap((e: InputEvent) => {
                    const inputVal = (<HTMLInputElement>e.srcElement).value;
                    if(inputVal.length > 0){
                        return this.lac.getAvailableLocations(inputVal)
                            .pipe(  
                                catchError(e => {
                                    /* catch the error inisde and return an empty observable to enable the user 
                                       to fix the bad syntax he provided (most likely the cause of the error).
                                       if we catch it outside it will stop the fromEvent operation...
                                    */
                                    this.isError = true;
                                    this.errorMsg = e;
                                    return of([]);
                                })
                            );
                    }
                    // if the input is empty return an empty observable
                    return of([]);
                }),
            )
            .subscribe( 
                (results: Location[]) => {
                    this.searchResults = results;
                    this.isThinking = false;
                }
            )
    }
    
    onFocus(){
        this.enableResults = true;
    }
    
    onInputBlur(){
        /* register to blur event on inputElement to reset the properties related to search box functionality */
        this.searchBoxBlurSubscription = fromEvent(this.inputElm.nativeElement, 'blur')
            .pipe(
            // delay to enable execution of setLocation when there's a click on a particular location
                delay(200),
            )
            .subscribe(() => {
                this.enableResults = false; 
                this.isThinking = false;
                this.highlightedLocationIndex = -1;
            })
        
    }
    
    setLocation(location: Location){
        /* since the purpose of this action is to present the selected location, we dispatch the Location object 
           to inform the state object */
        this.store.dispatch(new GetSelectedLocation(location));   
        this.searchResults = [];
        this.inputElm.nativeElement.value = "";
    }
    
    ngOnDestroy(){
        this.searchBoxInputSubscription.unsubscribe();
        this.searchBoxBlurSubscription.unsubscribe();
    } 
    
    @HostListener('window:keydown', ['$event']) 
    keyEvent(event: KeyboardEvent){
        if(this.enableResults && !this.isThinking) {
            switch(event.keyCode){
                case 13:    // Enter
                    this.setLocation(this.searchResults[this.highlightedLocationIndex]);
                    break;
                case 38:    // arrow up => highlightedLocationIndex value should go down unless we reached the start
                    this.highlightedLocationIndex = this.highlightedLocationIndex > 0 ? this.highlightedLocationIndex - 1 : this.highlightedLocationIndex;
                    break;
                case 40:    // arrow down => highlightedLocationIndex value should go up unless we reached the end   
                    this.highlightedLocationIndex = this.highlightedLocationIndex < this.searchResults.length - 1 ? this.highlightedLocationIndex + 1 : this.highlightedLocationIndex;
                    break;
            }
        }
    }

}
