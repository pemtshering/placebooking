import { Component } from '@angular/core';
import { NavController } from '@ionic/angular';
import { AuthService } from './auth/auth.service';
import { Storage } from '@capacitor/storage';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private authService:AuthService,
    private navController:NavController) {}
  logout(){
    this.authService.logout();
    this.navController.navigateBack('/auth');
    Storage.clear();
  }
}
