import { Component, OnInit } from '@angular/core';
import {Catalog,CatalogController,User} from '../../classes/class-definitions';
import {DataConnectorService} from '../../service/data-connector.service';
import {LogService} from '../../service/log.service';
import { DynamicMenuService } from '../../service/dynamic-menu.service';
import { retry } from 'rxjs/operator/retry';

@Component({
  selector: 'app-catalog-manager',
  templateUrl: './catalog-manager.component.html',
  styleUrls: ['./catalog-manager.component.css']
})
export class CatalogManagerComponent implements OnInit {

  constructor(private dataConnector:DataConnectorService,private logService:LogService,private dynamicMenuService: DynamicMenuService) { }
  

  public catalogControllerList:Array<CatalogController>=[];
  public currentCatalogController:CatalogController;

  
  ngOnInit() {
    this.dataConnector.getCatalogControllerList().then(catalogController=>{
      this.catalogControllerList = catalogController;
    });    
  }
  trackFn(i,e:CatalogController){
    return e.DBUID;
  }
  private setcurrentCatalogContainer(catalogController:CatalogController){
    this.currentCatalogController = catalogController;
    
  }
  public clickCallback(menuItem:any){
    this.setcurrentCatalogContainer( menuItem.CatalogContainer);
  }
  
  addCatalogContainer(){
    try{
      let newCatalogController = this.dataConnector.addCatalog();
      //this.catalogControllerList.push(newCatalogController)
      this.setcurrentCatalogContainer(newCatalogController);
      
    console.log(newCatalogController);
    }catch(e){
      this.logService.inform("Action:addCatalogContainer-->error: " + e);
    }
    
    
  }
  deleteCatalogContainer(Catalog:any){
 //   this.catalogContainer = this.catalogContainer.filter(c=>{return c!=Catalog});
  }
  save(){
  /*  this.catalogContainerViews.forEach(c=>{
      if (c.catalogContainer.UID!=""){
        c.catalogContainer.LastChange = new Date().toLocaleDateString();
        this.dataConnector.saveCatalogContainer(c.catalogContainer)
        this.dataConnector.saveCatalogContainer(c.catalogContainer).then(()=>{
          this.dataConnector.saveCatalog(c.catalogContainer.UID,c.catalog).then(()=>{
            
          })
        })
      }
    })*/
  }
  
  

}
