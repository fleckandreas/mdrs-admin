import { Component } from '@angular/core';
import { LogService } from './service/log.service';
import { DynamicMenuService } from './service/dynamic-menu.service';
import { DataConnectorService } from './service/data-connector.service';
import {TranslateService} from '@ngx-translate/core';
import {AuthentificationService} from './service/authentification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  public dynamicMenuItems: Array<any> = [];
  private dynamicModuleMenuClickCallback;
  public dynamicModuleMenuLabel:string;
  public dynamicModuleMenuItems: Array<any> = [];
  public filtered_dynamicModuleMenuItems:Array<any>=[];
  constructor(public authentificationService:AuthentificationService,private logService: LogService, private dynamicMenuService: DynamicMenuService,public dataConnectorService:DataConnectorService ,private translate:TranslateService) {
    
   /* this.dynamicMenuService.CurrentMenuItems.subscribe((menuList: Array<any>) => {
      if (menuList) {
        this.dynamicMenuItems = menuList;
      }
    });
    this.dynamicMenuService.CurrentModuleMenuItems.subscribe((value:{Label:string,menuList: Array<any>,clickCallback:any}) => {
      this.dynamicModuleMenuClickCallback=null;
      
      if (value.clickCallback){
        this.dynamicModuleMenuClickCallback= value.clickCallback;
      }
      if (value.menuList) {
        this.dynamicModuleMenuItems = value.menuList;
      }else{
        this.dynamicModuleMenuItems=[];
      }
     this.dynamicModuleMenuLabel = value.Label;
     this.assignCopy();
    });
    */
    translate.setDefaultLang('de');
    translate.use('de');
  }
  assignCopy(){
   // this.filtered_dynamicModuleMenuItems = Object.assign([], this.dynamicModuleMenuItems);
 }
 
 public back(){
  history.back();
}
public changePassword(){
  let oldpassword = prompt("old password");
  let newpassword = prompt("new password");
  if (oldpassword!="" && newpassword!=""){
    this.dataConnectorService.changePassword(oldpassword,newpassword).then(val=>{
      if(val){
        alert("Password changed")
      }else{
        alert("something went wrong")
      }
    })
  }
  
}
unsaved:Number;
ngDoCheck(){
  
this.unsaved = this.dataConnectorService.unsaved();
 }
public save(){
  this.dataConnectorService.saveCatalogs();
}
  public clickCallback(menuItem:any){
    if(this.dynamicModuleMenuClickCallback){
      this.dynamicModuleMenuClickCallback(menuItem);
    }
  }

  title = 'app';
}
