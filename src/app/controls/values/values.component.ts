import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LogService } from '../../service/log.service';

import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogListSelectComponent } from '../../controls/dialog-list-select/dialog-list-select.component';
import {ChangeType,Value, DataModelController, CatalogController } from '../../classes/class-definitions';
import { DataConnectorService } from '../../service/data-connector.service';

@Component({
  selector: 'app-values ',
  templateUrl: './values.component.html',
  styleUrls: ['./values.component.css']
})
export class ValuesComponent implements OnInit,OnChanges {
  @Input() propertyController: DataModelController;
  
  public values: Array<Value>=[];
  public valuesView: Array<any>=[];
  public selectedItem: any = null;
  filteredValues: Array<Value>=[];
  sortOptions=[{Key:"Label",Label:"Name"},{Key:"Key",Label:"Key"}]
  constructor(public dialog: MatDialog, private dataConnectorService: DataConnectorService) { }
  
  ngOnChanges(change: SimpleChanges) {
    if(change.propertyController){
      this.setContent();
    }
    
  }
  ngOnInit() {
    
  }
  setContent() {
    if (this.propertyController) {
      this.values = this.propertyController.Data.Values;
      this.valuesView = this.values.map(v=>{
        return {
          data:v,
          Key:v.Key,
        Label : this.dataConnectorService.getMetadataByLanguage(v.Metadata,v.Key).Label,
        searchText:this.dataConnectorService.getMetadataByLanguage(v.Metadata,v.Key).Label.toLowerCase()
        }
      })
    }

  }
  
  addValue() {
    let newItem = new Value();
    newItem.Key ="_new_value"
    this.propertyController.Data.Values.push(newItem);
    this.setContent();
    this.selectedItem = newItem;
    this.propertyController.wasChanged(ChangeType.AddValue,newItem.Key);
    this.setContent();
  }
  
  deleteValue() {
    this.selectedItem = null;
    let dialogRef = this.dialog.open(DialogListSelectComponent, {
      data: {
        Title: "Remove Value", List: this.values.map((item: Value) => {
          return {
            Name: this.dataConnectorService.getMetadataByLanguage(item.Metadata, item.Key).Label,
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
          let selected = u.Data;
          let index = this.propertyController.Data.Values.findIndex(item => { return item == selected })
          this.propertyController.Data.Values.splice(index, 1);
          this.propertyController.wasChanged(ChangeType.DeleteValue,selected.Key);
          this.setContent();
        }
      });
      this.setContent();
    });
  }


}
