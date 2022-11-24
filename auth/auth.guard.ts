import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable , of} from 'rxjs';
import { switchMap,tap,take } from 'rxjs/operators';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private authService:AuthService,
    private router:Router){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
      // if(!this.authService.isUserAuthenticated){
      //   this.router.navigateByUrl('/auth');
      // }
    // return this.authService.isUserAuthenticated;
  //  return true;
    return this.authService.userIsAuthenticated.pipe(
      take(1),
      switchMap(isAuthenticated=>{
        if (!isAuthenticated){
          return this.authService.autoLogin();
        }else{
          return of(isAuthenticated);
        }
      }),
      tap(isAuthticated=>{
        if(!isAuthticated){
          this.router.navigateByUrl('/auth');
        }
      })
    )
   }
}