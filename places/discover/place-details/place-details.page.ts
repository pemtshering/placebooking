import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActionSheetController, AlertController, LoadingController, ModalController, NavController } from '@ionic/angular';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { BookingService } from 'src/app/bookings/booking.service';

import { CreateBookingComponent } from 'src/app/bookings/create-booking/create-booking.component';
import { Place } from '../../places.model';
import { PlacesService } from '../../places.service';

@Component({
  selector: 'app-place-details',
  templateUrl: './place-details.page.html',
  styleUrls: ['./place-details.page.scss'],
})
export class PlaceDetailsPage implements OnInit {
  selectedPlace:Place;
  isBookable = false;
  isLoading :boolean;
  private placeSub: Subscription;
  constructor(
    private navCtrl: NavController,
    private route: ActivatedRoute,
    private placesService: PlacesService,
    private modalCtrl: ModalController,
    private actionSheetCtrl: ActionSheetController,
    private bookingService: BookingService,
    private loadingCtrl: LoadingController,
    private authService: AuthService,
    private alertCtrl: AlertController,
    private router: Router
    ) { }

  ngOnInit() {
    this.route.paramMap.subscribe(paramMap => {
      if (!paramMap.has('placeId')) {
        this.navCtrl.navigateBack('/places/tabs/discover');
        return;
      }
      this.isLoading = true;
      this.placeSub = this.placesService
        .getPlace(paramMap.get('placeId'))
        .subscribe(
          place => {
            this.selectedPlace = place;
            this.isBookable = place.userId === 'abc';
            this.isLoading = false;
          },
          error => {
            this.alertCtrl
              .create({
                header: 'An error ocurred!',
                message: 'Could not load place.',
                buttons: [
                  {
                    text: 'Okay',
                    handler: () => {
                      this.router.navigate(['/places/tabs/discover']);
                    }
                  }
                ]
              })
              .then(alertEl => alertEl.present());
          }
        );
    });
  }
  goToDiscover(){
    this.navCtrl.navigateBack('/places/tabs/discover')
  }
  bookPlace(){
    this.actionSheetCtrl.create({
      header: 'Book your Place',
      buttons: [
        {
        text: 'Select slot.',
        handler: () => {
          this.openBookingModal();
        }
       },
       {
        text: 'Cancel',
        role: 'cancel',
      }]
    }).then(actionSheet=>{
      actionSheet.present();
    })
  }
  openBookingModal() {
    this.modalCtrl
      .create({
        component: CreateBookingComponent,
        componentProps: { selectedPlace: this.selectedPlace}
      })
      .then(modalEl => {
        modalEl.present();
        return modalEl.onDidDismiss();
      }).then(data=>{
        if (data.role === 'confirm') {
          this.loadingCtrl
            .create({ message: 'Booking place...' })
            .then(loadingEl => {
              loadingEl.present();
              const resdata = data.data.bookingData;
              this.bookingService
                .addBooking(
                  this.selectedPlace.id,
                  this.selectedPlace.title,
                  this.selectedPlace.imageUrl,
                  resdata.firstName,
                  resdata.lastName,
                  resdata.guestNumber,
                  resdata.startDate,
                  resdata.endDate
                )
                .subscribe(() => {
                  loadingEl.dismiss();
                });
            });
        }
      })
  }
  ngOnDestroy() {
    if (this.placeSub) {
      this.placeSub.unsubscribe();
    }
  }

}
