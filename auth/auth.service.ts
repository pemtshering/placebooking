import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { AlertController } from '@ionic/angular';
import { BehaviorSubject, from } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { User } from './user.model';
import { Storage } from '@capacitor/storage';
export interface AuthResponseData {
  kind: string;
  idToken: string;
  email: string;
  refreshToken:string;
  localId: string;
  expiresIn: string;
  registered?:boolean;
}
@Injectable({
  providedIn: 'root'
})
export class AuthService {
  //https://identitytoolkit.googleapis.com/v1/accounts:signInWithCustomToken?key=[AIzaSyAXM-kArKwzdgw3eGNjLWdBfPnq11b-Dek]
  //AIzaSyAXM-kArKwzdgw3eGNjLWdBfPnq11b-Dek     ---key
  private _user = new BehaviorSubject<User>(null);
  
  get userIsAuthenticated(){
    return this._user.asObservable().pipe(
      map(user =>{
        if (user){
          return !!user.token;
        }else{
          return false;
        }
      })
    );
  }
   
  get userId(){
    return this._user.asObservable().pipe(
      map(user =>{
        if(user){
          return user.id;
        }else{
          return null;
        }
      })
    );
  }
  constructor(private http:HttpClient){}
  signup(email:string, password:string){
    return this.http
    .post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAXM-kArKwzdgw3eGNjLWdBfPnq11b-Dek`,
      {email:email, password: password, returnSecureToken: true}
    )
    .pipe(tap(this.setUserData.bind(this)));
  }
  login(email:string, password:string){
    return this.http
    .post<AuthResponseData>(
      `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAXM-kArKwzdgw3eGNjLWdBfPnq11b-Dek`,
      {email:email, password: password, returnSecureToken: true}
    )
    .pipe(tap(this.setUserData.bind(this)));
  }
  logout(){
    this._user.next(null);
  }

  private setUserData(userData: AuthResponseData){
    const expirationTime = new Date(
      new Date().getTime() + + userData.expiresIn * 1000
    );
    this._user.next(
      new User(
        userData.localId,
        userData.email,
        userData.idToken,
        expirationTime
      )
    );
    this.storeAuthData(
      userData.localId,
      userData.idToken,
      expirationTime.toISOString(),
      userData.email,
    );
  }
  private storeAuthData(
    userId: string,
    token: string,
    tokenExpirationData: string,
    email:string,
  ){
    const data = JSON.stringify({
      usserId:userId,
      token:token,
      tokenExpirationData: tokenExpirationData,
      email:email
    });
    Storage.set({key:'authData', value:data});
  }
  autoLogin(){
    return from(Storage.get({key: 'authData'})).pipe(
      map(storedData =>{
        if (!storedData||!storedData.value){
          return null;
        }
        const parsedData = JSON.parse(storedData.value) as {
          token: string;
          tokenExpirationData: string;
          userId: string;
          email:string;
        };
        const expirationTime = new Date(parsedData.tokenExpirationData);
        if (expirationTime<= new Date()){
          return null;
        }
        const user = new User(
          parsedData.userId,
          parsedData.email,
          parsedData.token,
          expirationTime
        );
        return user;
      }),
      tap(user =>{
        if(user){
          this._user.next(user);
        }
      }),
      map(user => {
        console.log(user);
        console.log(!!user);
        return !! user;
      })
    );
  }
}
//   private _isUserAuthenticated:boolean=false;
//   userName='myname'
//   password='password'
//   isCredentialsTrue:boolean;
//   constructor(private alertController: AlertController) {}
//   get isUserAuthenticated(){
//     return this._isUserAuthenticated;
//   }
//   login(){
//     this._isUserAuthenticated=true;
//   }
//   logout(){
//     this._isUserAuthenticated=false;
//     this.isCredentialsTrue=false;
//   }
//   checkCredentials(userName:string,password:string){
//      this.isCredentialsTrue = 
//      (userName===this.userName && password===this.password);
//      if(this.isCredentialsTrue){
//       this.login();
//      }else{
//       this.presentAlert();
//      }
     
//   }
//   async presentAlert() {
//     const alert = await this.alertController.create({
//       header: 'Incorrect Credentials',
//       message: 'Either username or password is incorrect.',
//       buttons: ['OK']
//     });

//     await alert.present();
//   }
// }



//key api AIzaSyAXM-kArKwzdgw3eGNjLWdBfPnq11b-Dek