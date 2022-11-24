import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonItemSliding } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { Place } from '../places.model';
import { PlacesService } from '../places.service';

@Component({
  selector: 'app-offers',
  templateUrl: './offers.page.html',
  styleUrls: ['./offers.page.scss'],
})
export class OffersPage implements OnInit,OnDestroy {
  offers:Place[];
  private placesSub: Subscription;
  isLoading: boolean;
  constructor(private placesService:PlacesService
    ,private router:Router) { }

  ngOnInit() {
    this.isLoading=true;
    this.placesSub = this.placesService.places.subscribe(places => {
      this.offers = places;
    });
    this.placesService.fetchPlaces().subscribe(() => {
      this.isLoading = false;
    });
  }
  onEdit(offerId:string,ionItemSliding:IonItemSliding){
    ionItemSliding.close();
    this.router.navigate(['/','places','tabs','offers','edit',offerId])
    console.log(offerId,ionItemSliding);
    
  }
  ngOnDestroy() {
    if (this.placesSub) {
      this.placesSub.unsubscribe();
    }
  }
}
