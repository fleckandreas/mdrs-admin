import { Component, OnInit,Input,OnChanges,SimpleChanges } from '@angular/core';
import {LogService} from '../../service/log.service';
import {DataConnectorService} from '../../service/data-connector.service';
import {CatalogController,DataModelController,Property} from '../../classes/class-definitions';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogListSelectComponent } from '../../controls/dialog-list-select/dialog-list-select.component';
import { DynamicMenuService } from '../../service/dynamic-menu.service';
import { Router,ActivatedRoute } from '@angular/router';
import {Observable,BehaviorSubject,} from 'rxjs/Rx';
import {startWith} from 'rxjs/operators/startWith';
import {map} from 'rxjs/operators/map';
@Component({
  selector: 'app-properties',
  templateUrl: './properties.component.html',
  styleUrls: ['./properties.component.css']
})
export class PropertiesComponent implements OnInit {
  @Input() catalogController:CatalogController;
  properties:Array<DataModelController>;
  propertiesView:Array<any>;
  scopes:Array<DataModelController>;
  public types:Array<any>=[];
  sortOptions=[{Key:"Label",Label:"Name"},{Key:"Key",Label:"Key"}]
  public selectedTabIndex=0;
  
  //empty list
  
  public _observableList: BehaviorSubject<any[]> = new BehaviorSubject([]); 
  public filteredProperties=[];// (): Observable<any[]>{return this._observableList.asObservable()};
  filterDataFn={sort:null,searchstr:null} 
  
  constructor(public dialog: MatDialog,private route:ActivatedRoute,private router:Router ,private dataConnectorService:DataConnectorService,private dynamicMenuService:DynamicMenuService) { }
  ngOnChanges(change:SimpleChanges){
    this.setContent();
  }
  ngOnInit() {       
   /* this.filteredProperties.subscribe(f=>{
      console.log("SUBSCRIBE")
      console.log(f)
      
    
    })*/
  }
  
  setContent(){
    if(this.catalogController){
      this.properties  = this.catalogController.Children.filter(dm=>{return dm.Type =="Property"})
       this.propertiesView = this.properties.map(p=>{
        let l = this.dataConnectorService.getMetadataByLanguage(p.Data.Metadata,p.Data.Key);
        return {
          data:p,
          Label:l.Label,
          Key:p.Data.Key,            
          searchText:l.Label.toLowerCase() + " " + l.Description.toLowerCase()
        }
      });
    }    
  }
  
  trackFn(i,e:any){
    return e.data.DBUID;
  }
  addProperty(){
    let newProperty = new Property()
    newProperty.Key ="new property"
    let newItemController = this.dataConnectorService.addChild(newProperty,this.catalogController);
    this.router.navigate(['property/',newItemController.DBUID],{relativeTo: this.route});
   }
  deleteProperty(){
     let dialogRef = this.dialog.open(DialogListSelectComponent, {
      data: {
        Title: "Remove Property", List: this.filteredProperties.map((item: any) => {
          return {
            Label: item.Label,
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
          let property = u.Data.data;
          /*let index = this.properties.findIndex(item => { return item == property })
          this.properties.splice(index, 1);*/
          this.dataConnectorService.removeChild(property,this.catalogController);
          this.setContent();
        }
      });

    });
  }


}
