import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ModelController, DynProperty, ChangeType } from '../../classes/class-definitions';
import { DataConnectorService } from '../../service/data-connector.service';
import { DialogListSelectComponent } from '../../controls/dialog-list-select/dialog-list-select.component';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
@Component({
  selector: 'app-dyn-properties-list',
  templateUrl: './dyn-properties-list.component.html',
  styleUrls: ['./dyn-properties-list.component.css']
})
export class DynPropertiesListComponent implements OnInit, OnChanges {
  @Input() modelController: ModelController;
  @Input() model: any;
  @Input() modeltype: string;
  @Input() isreadonly: boolean = true;
  dynProperties: Array<DynProperty> = [];
  options = null;
  constructor(private dialog: MatDialog, private dataConnectorService: DataConnectorService) { }

  ngOnInit() {
  }
  ngOnChanges(change: SimpleChanges) {
    if (change.modelController) {
      this.setContent()
    }
    if (change.modeltype) {
      console.log(change.modeltype)
      this.setContent()

    }
  }
  onChange(propertyname: string) {
    if (this.modelController) {
      this.modelController.wasChanged(ChangeType.Property,propertyname);
     // console.log(this.modelController)
    }
  }
  
  trackFn(i, e) {
    //console.log(e)
    return e.value;
  }
  
  
  getPropertyAsList(name: string, type: string): Array<any> {
    let refsAsArray: Array<any> = [];
    if (this.model && this.options) {
      let modelValue = this.model[name];
      if (modelValue) {

        if (type == "string") {
          refsAsArray = modelValue.split(this.dataConnectorService.globalSeperator);
        } else if (type == "list") {
          refsAsArray = modelValue;
        }
      }
    }
    return refsAsArray;
  }
  getRefAsString(name: string, type: string): string {
    let retstr="";
    if (this.model && this.options && this.options[name]) {
      let refsAsArray: Array<any> = this.getPropertyAsList(name, type);
       retstr = refsAsArray.map(value => {
        let option = (this.options[name] as Array<{ label, value }>).find(kvp => { return kvp.value == value });
        if (option) {
          return option.label;
        }
      }).join("; ")
     

    }
    return retstr;
  }
  manageRef(name: string, type: string) {
    let refsAsArray: Array<any> = this.getPropertyAsList(name, type);
    let dialogRef = this.dialog.open(DialogListSelectComponent, {
      data: {
        Title: "Manage Ref", List: this.options[name].map((item: { value, label }) => {
          return {
            Label: item.label,
            Selected: refsAsArray.find(s => { return s == item.value }) != null,
            Data: item.value
          }
        })
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      //result <== data.list 
      if (result) {
        if (type == "string") {
          this.model[name] = (result as Array<any>)
            .filter(u => { return u.Selected == true })
            .map(u => {
              return u.Data;
            })
            .join(this.dataConnectorService.globalSeperator);
          this.onChange(name);
        }else if(type=="list"){
          this.model[name] = (result as Array<any>)
            .filter(u => { return u.Selected == true })
            .map(u => {
              return u.Data;
            })
          this.onChange(name);
        }
      }
    });
  }
  setContent() {
    if (this.modeltype) {
      this.dynProperties = this.dataConnectorService.getDynProperties(this.modeltype);
    }

    if (this.model && this.dynProperties) {
      let options = {};
      let qs = [];
      this.dynProperties.forEach(p => {
        if (p.Control == "singleselect" || p.Control == "multiselect") {
          qs.push(this.dataConnectorService.getOptions(p.Name, this.model).then(retoptions => {
            options[p.Name] = retoptions
          }));
      }
      })
      Promise.all(qs).then(() => {
        this.options = null;
        this.options = options;
      })

    }

    // 
  }

}
