import { Component, OnInit,Input,OnChanges,SimpleChanges, AnimationKeyframe } from '@angular/core';
import {LogService} from '../../service/log.service';
import {Scope,DataModelController, CatalogController} from '../../classes/class-definitions';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogListSelectComponent } from '../../controls/dialog-list-select/dialog-list-select.component';
import {DataConnectorService} from '../../service/data-connector.service';
@Component({
  selector: 'app-scopes',
  templateUrl: './scopes.component.html',
  styleUrls: ['./scopes.component.css']
})
export class ScopesComponent implements OnInit {
  @Input() catalogController:CatalogController;
  scopesView: Array<any>;
  filteredScopes = [];
  sortOptions=[{Key:"Label",Label:"Name"},{Key:"Key",Label:"Key"}]
  public selectedItem:any=null;
  constructor(public dialog: MatDialog,public dataConnectorService:DataConnectorService) { }
  ngOnChanges(change:SimpleChanges){
    if(change.catalogController){
      this.setContent();
    }
    
  }
  ngOnInit() {

  }
  
  setContent(){
    if(this.catalogController){
      this.scopesView = this.catalogController.Children.filter(dm => { return dm.Type == "Scope" }).map(sg => {
        let l = this.dataConnectorService.getMetadataByLanguage(sg.Data.Metadata, sg.Data.Key);
        return {
          data: sg,
          Label: l.Label,
          Key:sg.Data.Key,
          searchText: l.Label.toLowerCase() + " " + l.Description.toLowerCase()
        }
      })
      this.filteredScopes = [];
    }
  }
  trackFn(i,e:DataModelController){
    return e.DBUID;
  }
  
  addScope(){
    let newItem = new Scope();
    newItem.Key ="_new_scope";
    let newItemController = this.dataConnectorService.addChild(newItem,this.catalogController);
    this.setContent();
    this.selectedItem=newItemController;    
    
  }
  deleteScope(){
    this.selectedItem=null;
    let dialogRef = this.dialog.open(DialogListSelectComponent, {
      data: {
        Title: "Remove Scope", List: this.scopesView.map((item: any) => {
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
          let scope = u.Data;
          this.dataConnectorService.removeChild(scope,this.catalogController);
        }
      });
      this.setContent();
    }
    });
  }

}
