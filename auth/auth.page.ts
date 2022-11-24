import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AlertController, LoadingController, NavController } from '@ionic/angular';
import { Observable } from 'rxjs';
import { AuthResponseData, AuthService } from './auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  userName:string='';
  password:string='';
  isLogin:boolean=true;
  isLoading:boolean;
  constructor(private authService:AuthService,
    private navController:NavController,
    private router:Router,
    private loadingCtrl:LoadingController,
    private alertCtrl:AlertController) { }

  ngOnInit() {
  }

  authentication(email:string, password:string){
    this.isLoading=true;
    this.loadingCtrl
    .create({keyboardClose: true, message:'logging in...'})
    .then(loadingEl =>{
      loadingEl.present();
      let authObs: Observable<AuthResponseData>;
      if (this.isLogin){
        authObs = this.authService.login(email, password);
      }else{
        authObs = this.authService.signup(email, password);
      }
      authObs.subscribe(
        resData =>{
          console.log(resData);
          this.isLoading=false;
          loadingEl.dismiss();
          this.router.navigateByUrl('/places/tabs/discover');
        },
        errRes =>{
          loadingEl.dismiss();
          const code = errRes.error.error.message;
          let message = 'could not sign up, please try again';
          if(code==='EMAIL EXIST'){
            message= 'This email address exists already!';
          }else if(code==='EMAIL_NOT_FOUND'){
            message ='Email address could not be found';
          }else if(code ==='INVALID_PASSWORD'){
            message = 'this password is not correct';
          }
          this.showAlert(message)
        }
      );
    });
  }
  onSwitchAuthMode(){
    this.isLogin = !this.isLogin;
  }
  onSubmit(){
    const email = this.userName;
    const password = this.password;

    this.authentication(email, password);
    this.userName=''
    this.password=''
  }

  private showAlert(message:string){
    this.alertCtrl
    .create({
      header: 'Authentication failed',
      message: message,
      buttons: ['Okay']
    })
    .then(alertEl => alertEl.present());
  }

  // login(){
  //   this.authService.checkCredentials(this.userName,this.password);
  //   this.navController.navigateForward('/places/tabs/discover');
  //   this.userName='',
  //   this.password=''
  // }
}
