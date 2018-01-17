import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import {DataConnectorService} from './data-connector.service';
@Injectable()
export class AuthentificationService {
  public redirectUrl:string ="/";
  public isLoggedIn:boolean=false;
  
  constructor(private router:Router,private dataConnectorService:DataConnectorService) {
    if (this.dataConnectorService.user){
      this.isLoggedIn=true; 
    }
   }
   login(username:string,password:string){
    console.log('AuthService LOGIN')
    localStorage.setItem("currentUser",username);
    return this.dataConnectorService.login(username,password).then(val =>{
        console.log('AuthService login')
        if(val){
            this.isLoggedIn=true;
            
            this.router.navigate([this.redirectUrl]);
        }else{
            this.isLoggedIn=false;
        }
    } )
  
  }
  public currentUserIsAdmin(){
    return this.dataConnectorService.user.isAdmin==true;
  }
  logout(): void {
    this.isLoggedIn = false;
    this.dataConnectorService.logout();
    this.router.navigate(['/login']);
    
  }
  
}
