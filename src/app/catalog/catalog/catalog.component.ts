import { Component, OnInit } from '@angular/core';
import {CatalogController,Catalog,User, Property} from '../../classes/class-definitions';
import {DataConnectorService} from '../../service/data-connector.service';
import {LogService} from '../../service/log.service';
import {ActivatedRoute} from '@angular/router';
import { error } from 'util';


@Component({
  selector: 'app-catalog',
  templateUrl: './catalog.component.html',
  styleUrls: ['./catalog.component.css']
})

export class CatalogComponent implements OnInit {

  constructor(private route:ActivatedRoute,private  dataConnector:DataConnectorService,private logService:LogService) {

    
   }
   
   
  catalog:Catalog;
  catalogController:CatalogController;
  selectedTabIndex=0;
  tabChange(event) {
    this.selectedTabIndex = event.index;
    this.dataConnector.AppState.Tabs[this.catalogController.DBUID]=event.index
  }
  
  errors=[];
  validate(){
    this.dataConnector.validateCatalog(this.catalogController).then(errors=>{
      this.errors = errors;
    })
  }
  dwnldUri:string;
  ngOnInit() {
    this.route.params.subscribe(params=>{
      if (params.catalogid){
        this.dataConnector.getCatalogController(params.catalogid).then(catalogController=>{
          console.log(catalogController)
            this.catalog=catalogController.Data;
            this.catalogController=catalogController;                      
            this.dwnldUri = this.dataConnector.getDownloadUri(catalogController.DBUID)
            //old TAB
            if (this.dataConnector.AppState.Tabs[this.catalogController.DBUID]){
              this.selectedTabIndex =  this.dataConnector.AppState.Tabs[this.catalogController.DBUID]              
            }
        });
      }      
    });    
  }
  validateintern(){
    let log:Array<string>=[];
    this.catalogController.Children.filter(c=>{return c.Type =="Property"}).forEach(p=>{
      if ((p.Data as Property).Key == ""){
        log.push("Property key fails" + p.DBUID)
      }
      if ((p.Data as Property).Type == ""){
        log.push("Property type fails, key:" + p.Data.Key)
      }
    })
  }
  
   
}
