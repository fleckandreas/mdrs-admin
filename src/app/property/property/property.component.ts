import { Component, OnInit,Input,OnChanges,SimpleChanges } from '@angular/core';
import {DataConnectorService} from '../../service/data-connector.service';
import {ActivatedRoute} from '@angular/router';
import {LogService} from '../../service/log.service';
import {CatalogController,DataModelController,Scope,Property} from '../../classes/class-definitions';
import { DialogListSelectComponent } from '../../controls/dialog-list-select/dialog-list-select.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-property',
  templateUrl: './property.component.html',
  styleUrls: ['./property.component.css']
})
export class PropertyComponent implements OnInit,OnChanges {
  @Input() catalogController:CatalogController = null;
  @Input() propertyID:string=null;
  constructor(public dialog: MatDialog,private route:ActivatedRoute,private dataConnectorService:DataConnectorService,private logService:LogService) {

  }
  propertyController:DataModelController;
  selectedTabIndex=0;
  tabChange(event) {
    this.selectedTabIndex = event.index;
    this.dataConnectorService.AppState.Tabs[this.propertyController.DBUID]=event.index
  }
  ngOnChanges(change:SimpleChanges){
    if (change.catalogController || change.propertyID){
      console.log("detect change");
      this.setContent();
    }
  }
  ngOnInit() {
  
    if(!this.catalogController){
    this.route.params.subscribe(params=>{
      if (params.catalogid){
        this.dataConnectorService.getCatalogController(params.catalogid).then(catalogController=>{
            console.log(catalogController)
            this.catalogController=catalogController;                      
           this.propertyID = params.propertyid;
           this.setContent();
           //old TAB
           if (this.dataConnectorService.AppState.Tabs[this.propertyID]){
            this.selectedTabIndex =  this.dataConnectorService.AppState.Tabs[this.propertyID]              
          }
        });
      }      
    });   
   } 
  }
  setContent(){
    if (this.catalogController && this.propertyID){
    this.propertyController = this.catalogController.Children.find(pc=>{return pc.DBUID == this.propertyID });
  }
  }

}
