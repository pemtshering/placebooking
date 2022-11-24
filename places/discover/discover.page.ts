import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Place } from '../places.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-discover',
  templateUrl: './discover.page.html',
  styleUrls: ['./discover.page.scss'],
})
export class DiscoverPage implements OnInit,OnDestroy {
  places:Place[]=[];
  private placesSub: Subscription;
  isLoading: boolean;
  constructor(private placesService:PlacesService) { }
  placeIndex:number;
  ngOnInit() {
   this.isLoading=true
    this.placesSub = this.placesService.places.subscribe(places => {
      this.places = places;
      console.log(this.places);
    });

    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
    
    this.placeIndex=0
    // setInterval(()=>{
    //   this.placeIndex++
    //   if(this.placeIndex===this.places.length){
    //     this.placeIndex= 0
    //   }
    // },5000)
    
  }
 
  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
