import { Component, OnInit } from '@angular/core';
import {Settings,ModelController,ChangeType} from '../../classes/class-definitions';
import {DataConnectorService} from '../../service/data-connector.service';
import {LogService} from '../../service/log.service';
import { DynamicMenuService } from '../../service/dynamic-menu.service';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogListSelectComponent } from '../../controls/dialog-list-select/dialog-list-select.component';
@Component({
  selector: 'app-settings-manager',
  templateUrl: './settings-manager.component.html'  
})
export class SettingsManagerComponent implements OnInit {

  constructor(private dialog:MatDialog, private dataConnector:DataConnectorService,private logService:LogService,private dynamicMenuService: DynamicMenuService) { }
  

  public settings:Settings;
  settingsController:ModelController;
  propertyTypesView:Array<any>=[];
  propertyTypesFiltered=[];
  ngOnInit() {
    this.dataConnector.getSettings().then(settingsController=>{
      this.settingsController = settingsController
      if(!settingsController.Data.EmailSettings){
        settingsController.Data.EmailSettings={From:"",Title:"",Text:""};
      }
      if(!settingsController.Data.AppSettings){
        settingsController.Data.AppSettings={UIDPattern:"",NewCatalogNeedPermission:false};
      }
      this.settings = settingsController.Data;      
      this.setContent();
  });
    
  }
  setContent(){
    this.propertyTypesView =  this.settings.PropertyTypes.map((item: any) => {
      return {
        Label: item,
        Data: item
      }
  });
  }
  addPropertyType(){
    try{
      let v = window.prompt("new value")
      if (v && v!=""){
        this.settings.PropertyTypes.push(v)
        this.settingsController.wasChanged(ChangeType.AddPropertyType);
      }
      this.setContent();
    }catch(e){
      this.logService.inform("Action:addPropertyType-->error: " + e);
    }
    
    
  }
  deletePropertyType(propertytype:any){
    let dialogRef = this.dialog.open(DialogListSelectComponent, {
      data: {
        Title: "Remove Property", List: this.settings.PropertyTypes.map((item: any) => {
          return {
            Label: item,
            Selected: false,
            Data: item
          }
        })
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      //result <== data.list 

      (result as Array<any>).forEach(u => {
        if (u.Selected == true) {
          let propertytype = u.Data;
          
          let index = this.settings.PropertyTypes.findIndex(item => { return item == propertytype })
          this.settings.PropertyTypes.splice(index, 1);
          this.settingsController.wasChanged(ChangeType.DeletePropertyType,propertytype);
         
        }
      });
      this.setContent();
    });
  }
  
    
  
  

}
