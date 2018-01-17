import { Component, OnInit } from '@angular/core';
import {User,ModelController,ChangeType} from '../../classes/class-definitions';
import {DataConnectorService} from '../../service/data-connector.service';
import {LogService} from '../../service/log.service';

@Component({
  selector: 'app-user-manager',
  templateUrl: './user-manager.component.html',
  styleUrls: ['./user-manager.component.css']
})
export class UserManagerComponent implements OnInit {

  constructor(private dataConnector:DataConnectorService,private logService:LogService) { }

  public userData:Array<ModelController>=[];
  public currentUser:ModelController;
  ngOnInit() {
    this.dataConnector.getUser().then(user=>{
      this.userData = user;    
    })
  }
  onChange(user:ModelController){
    console.log("change",user)
  }
  trackFn(i,e){
    return e.UID;
  }
  addUser(){
    try{
      let newUser =this.dataConnector.addUser();
      this.currentUser=newUser;      
    }catch(e){
      this.logService.inform("Action:addUser-->error: " + e);
    }
    
    
  }
  deleteUser(user:User){
    //this.userData = this.userData.filter(c=>{return c!=user});
  }
  
  
}
