import { Component, OnInit,Input,OnChanges,SimpleChanges } from '@angular/core';
import {DataConnectorService} from '../../service/data-connector.service';
import {ActivatedRoute} from '@angular/router';
import {LogService} from '../../service/log.service';
import {CatalogController,DataModelController,Scope,Property,ChangeType} from '../../classes/class-definitions';
import { DialogListSelectComponent } from '../../controls/dialog-list-select/dialog-list-select.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { connectableObservableDescriptor } from 'rxjs/observable/ConnectableObservable';

@Component({
  selector: 'app-scope',
  templateUrl: './scope.component.html',
  styleUrls: ['./scope.component.css']
})
export class ScopeComponent implements OnInit,OnChanges {
  @Input() catalogController:CatalogController = null;
  @Input() scopeID:string=null;
  constructor(public dialog: MatDialog,private route:ActivatedRoute,private dataConnectorService:DataConnectorService,private logService:LogService) {

  }
  scopeController:DataModelController;
  selectedTabIndex=0;
  tabChange(event) {
    this.selectedTabIndex = event.index;
    this.dataConnectorService.AppState.Tabs[this.scopeController.DBUID]=event.index

  }
  ngOnChanges(change:SimpleChanges){
    if (change.catalogController || change.scopeID){
      console.log("detect change");
      this.setContent();
    }
  }
  ngOnInit() {
  
    if(!this.catalogController){
    this.route.params.subscribe(params=>{
      console.log(params)
      if (params.catalogid){
        this.dataConnectorService.getCatalogController(params.catalogid).then(catalogController=>{
           this.catalogController=catalogController;                      
           this.scopeID = params.scopeid;
           //old TAB
           if (this.dataConnectorService.AppState.Tabs[this.scopeID]){
            this.selectedTabIndex =  this.dataConnectorService.AppState.Tabs[this.scopeID]              
          }
           this.setContent();
        });
      }      
    });   
   } 
  }
  propertiesView;
  filteredProperties;
  setContent(){
    if (this.catalogController && this.scopeID){
    this.scopeController = this.catalogController.Children.find(pc=>{return pc.DBUID == this.scopeID });
    let scopeKey =(this.scopeController.Data as Scope).Key;
    this.propertiesView = this.catalogController.Children.filter(dm => 
      { 
        //Property and ScopeRef contains this scope
        return dm.Type == "Property" &&  (dm.Data as Property).ScopeRef.split(this.dataConnectorService.globalSeperator).find(key=>{ return key == scopeKey })!=null;      
      }).map(propertyController => {
      let l = this.dataConnectorService.getMetadataByLanguage(propertyController.Data.Metadata, propertyController.Data.Key);
      return {
        data: propertyController,
        Label: l.Label,
        searchText: l.Label.toLowerCase() + " " + l.Description.toLowerCase()
      }
    })
    this.filteredProperties = [];
  }
  }
  addRefToProperty(){
    let dialogRef = this.dialog.open(DialogListSelectComponent, {
      data: {
        Title: "Add ScopeRef to Property", List: this.catalogController.Children.filter(dmC=>{return dmC.Type =="Property" && this.propertiesView.find(val=>{return val.data ==dmC })==null}).map((item: DataModelController) => {
          let l = this.dataConnectorService.getMetadataByLanguage(item.Data.Metadata, item.Data.Key);
          return {
            Label: l.Label,
            Selected: false,
            Data: item
          }
        })
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      //result <== data.list 
      if(result){
      (result as Array<any>).forEach(u => {
        if (u.Selected == true) {
          let propertyController = u.Data as DataModelController;
          (propertyController.Data as Property).ScopeRef = (propertyController.Data as Property).ScopeRef + this.dataConnectorService.globalSeperator + this.scopeController.Data.Key
          propertyController.wasChanged(ChangeType.Property,"ScopeRef");
          //this.dataConnectorService.removeChild(scope,this.catalogController);
        }
      });
      this.setContent();
    }
    });
  }
  deleteRefToProperty(){
    let dialogRef = this.dialog.open(DialogListSelectComponent, {
      data: {
        Title: "Remove ScopeRef from Property", List: this.propertiesView.map((item: any) => {
          return {
            Label: item.Label,
            Selected: false,
            Data: item.data
          }
        })
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      //result <== data.list 
      if(result){
      (result as Array<any>).forEach(u => {
        if (u.Selected == true) {
          let propertyController = u.Data as DataModelController;
          let scopeRefs = (propertyController.Data as Property).ScopeRef.split(this.dataConnectorService.globalSeperator);
          scopeRefs = scopeRefs.filter(ref=>{ref !=this.scopeController.Data.Key});
          (propertyController.Data as Property).ScopeRef =  scopeRefs.join(this.dataConnectorService.globalSeperator);
          propertyController.wasChanged(ChangeType.Property,"ScopeRef");
          //this.dataConnectorService.removeChild(scope,this.catalogController);
        }
      });
      this.setContent();
    }
    });
  }

}
