import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot,Router } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import {AuthentificationService} from './authentification.service';
@Injectable()
export class AuthentificationGuard implements CanActivate {
  constructor(private authentificationService:AuthentificationService,private router:Router){}
  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
      //ADMIN
      console.log(state.url)
      if (this.authentificationService.isLoggedIn==true && state.url.search("admin")>-1){
        return this.authentificationService.currentUserIsAdmin();
      }
      
      if (this.authentificationService.isLoggedIn==true) { return true; }
      
          // Store the attempted URL for redirecting
          this.authentificationService.redirectUrl = state.url;
          // Navigate to the login page with extras
          this.router.navigate(['/login']);
          return false;
  }
}
