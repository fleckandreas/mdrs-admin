import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { LogService } from '../../service/log.service';
import { DataConnectorService } from '../../service/data-connector.service';
import { CatalogController, ScopeGroup, DataModelController } from '../../classes/class-definitions';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogListSelectComponent } from '../../controls/dialog-list-select/dialog-list-select.component';
@Component({
  selector: 'app-scope-groups',
  templateUrl: './scope-groups.component.html',
  styleUrls: ['./scope-groups.component.css']
})
export class ScopeGroupsComponent implements OnInit, OnChanges {
  @Input() catalogController: CatalogController;
  scopeGroupsView: Array<any>;
  filteredScopeGroups = [];
  sortOptions=[{Key:"Label",Label:"Name"},{Key:"Key",Label:"Key"}]
  public selectedItem: any = null;
  constructor(public dialog: MatDialog, private dataConnectorService: DataConnectorService) { }

  ngOnChanges(change: SimpleChanges) {
    if (change.catalogController) {
      this.setContent();
    }
  }
  ngOnInit() {

  }

  setContent() {
    if (this.catalogController) {
      this.scopeGroupsView = this.catalogController.Children.filter(dm => { return dm.Type == "ScopeGroup" }).map(sg => {
        let l = this.dataConnectorService.getMetadataByLanguage(sg.Data.Metadata, sg.Data.Key);
        return {
          data: sg,
          Label: l.Label,
          Key:sg.Data.Key,
          searchText: l.Label.toLowerCase() + " " + l.Description.toLowerCase()
        }
      })
      this.filteredScopeGroups = [];
      
    }
  }
  trackFn(i, e: any) {
    return e.data.DBUID;
  }
  
  addScopeGroup() {
    let newItem = new ScopeGroup();
    newItem.Key ="_new_scopegroup";
    let newItemController = this.dataConnectorService.addChild(newItem, this.catalogController);
    this.setContent();
    this.selectedItem = newItemController;

  }
  deleteScopeGroup() {
    this.selectedItem = null;
    let dialogRef = this.dialog.open(DialogListSelectComponent, {
      data: {
        Title: "Remove ScopeGroup", List: this.scopeGroupsView.map((item: any) => {
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
      if (result) {
        (result as Array<any>).forEach(u => {
          if (u.Selected == true) {
            let scopegroup = u.Data;
            this.dataConnectorService.removeChild(scopegroup, this.catalogController);

          }
        });
        this.setContent();
      }
      });
  } 

}
