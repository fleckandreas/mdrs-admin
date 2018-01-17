import { Component, OnInit } from '@angular/core';
import {AuthentificationService} from '../service/authentification.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  public username:string;
  public password:string;
  constructor(private authentificationService:AuthentificationService) { }

  ngOnInit() {
  }
  login(){
    this.authentificationService.login(this.username,this.password);
  }
}
