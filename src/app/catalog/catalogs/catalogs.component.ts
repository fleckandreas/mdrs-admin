import { Component, OnInit } from '@angular/core';
import {Catalog,CatalogController,User} from '../../classes/class-definitions';
import {DataConnectorService} from '../../service/data-connector.service';
import {LogService} from '../../service/log.service';
import { Router,ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-catalogs',
  templateUrl: './catalogs.component.html',
  styleUrls: ['./catalogs.component.css']
})
export class CatalogsComponent implements OnInit {

  constructor(private router:Router,private dataConnector:DataConnectorService,private logService:LogService) { }
  public catalogControllerList:Array<CatalogController>=[];
  catalogControllerViewList:Array<any>=[];
  filteredCatalogs:Array<any>=[];
  ngOnInit() {
    this.dataConnector.getCatalogControllerList().then(catalogControllerList=>{
      console.log(catalogControllerList);
      this.catalogControllerList = catalogControllerList;//.sort((a,b)=>this.dataConnector.defaultCatalogControllerSort(a,b));
      this.catalogControllerViewList= this.catalogControllerList.map(catalogController=>{
        let l =this.dataConnector.getCatalogControllerLabel(catalogController)
        return {
          data:catalogController,
          Label :l,
          searchtext:l.toLowerCase()
        }
      })
    });    
  }
  trackFn(i,e:CatalogController){
    return e.DBUID;
  }
  deleteCatalog(){
    alert("kommt noch")
  }
  addCatalog(){
    try{
      let newCatalogController = this.dataConnector.addCatalog();
      this.router.navigate(['catalog/',newCatalogController.DBUID]);
    }catch(e){
      this.logService.inform("Action:addCatalogContainer-->error: " + e);
    }
  }
  public file=null;
  onChange(event):void{
    console.log("add files")
      let eventObj: MSInputMethodContext = <MSInputMethodContext> event;
      let target: HTMLInputElement = <HTMLInputElement> eventObj.target;
      let t = this;
      this.file=null;
      if (target.files.length>0){
        this.file = {File:target.files[0]};
      }
      this.readThis(event.target);
  }
  readThis(inputValue:any){
    var file:File = inputValue.files[0]; 
    var myReader:FileReader = new FileReader();
    let t = this;
    myReader.onloadend = function(e){
      // you can perform an action with readed data here
      var data = myReader.result;
      /*let fn=t.dataConnector.getXML();
      if(fn){
        let xml = fn(data);
        console.log(xml); */
        t.dataConnector.convertXmlToCatalog(data).then(catalogController=>{
          console.log(catalogController)
          if (catalogController){
            
            //t.catalogController = catalogController
            //t.catalog = catalogController.Data;
          }
          
        });
        
      //}
      
    };
    myReader.readAsText(file,"utf-8");
  }

}
