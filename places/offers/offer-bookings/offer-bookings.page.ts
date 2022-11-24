import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NavController } from '@ionic/angular';
import { Place } from '../../places.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-offer-bookings',
  templateUrl: './offer-bookings.page.html',
  styleUrls: ['./offer-bookings.page.scss'],
})
export class OfferBookingsPage implements OnInit {
  selectedPlace:Place;
  constructor(private activatedRoute:ActivatedRoute,
    private placeService:PlacesService,
    private navController:NavController
    ) { }

  ngOnInit() {
    // this.activatedRoute.paramMap.subscribe(parmMap=>{
    //   if(!parmMap.has('placeId')){
    //     this.navController.navigateBack('/places/tabs/offers')
    //   }
    //   this.selectedPlace =
    //    this.placeService.getSelectedPlace(parmMap.get('placeId'))
    //   console.log(this.selectedPlace);
    // })
  }

}
