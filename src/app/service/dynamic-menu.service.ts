import { Injectable } from '@angular/core';
import {Observable,BehaviorSubject,} from 'rxjs/Rx';
import {RouterModule,Router,NavigationEnd} from '@angular/router';
import {LogService} from './log.service';
@Injectable()
export class DynamicMenuService {

  constructor(private router:Router,private logservice: LogService,private route:RouterModule) { 
    logservice.log("initialize DynamicMenuService");
    /*router.events.subscribe((event)=>{
      if (event instanceof NavigationEnd){
        logservice.log("router change DynamicMenuService");
        logservice.log (event);
        this.buildDynamicMenu(event.url);
      }
      
    })*/
  }
  private buildDynamicMenu(path:string){
    let list:Array<any>=[];
   
    list.push({route:"catalogs",text:"Common.Catalogs"})
    list.push({route:"admin",text:"Common.Admin"})
    if (path == "/"){
      
    }
    if (path.search("admin")>-1){
      list.push({route:"/admin/user",text:"Admin.UserManager"})
    //  list.push({route:"/admin/catalog",text:"Admin.CatalogManager"})
      list.push({route:"/admin/web",text:"Admin.WebManager"})
      list.push({route:"/admin/settings",text:"Admin.SettingsManager"})
    }
    
    if (list.length==0){
      list=null;
    }
    this._CurrentMenuItems.next(list);
    this._CurrentModuleMenuItems.next({Label:"",menuList:null,clickCallback:null})
  }
  //private _filteredjobsdata:any[]=[];
  private _CurrentMenuItems: BehaviorSubject<any[]> = new BehaviorSubject([]);
  public get CurrentMenuItems():Observable<any[]>{return this._CurrentMenuItems;}; 
  
  private _CurrentModuleMenuItems: BehaviorSubject<{Label:string,menuList:Array<any>,clickCallback:any}> = new BehaviorSubject({Label:"",menuList:[],clickCallback:null});
  public get CurrentModuleMenuItems():Observable<{Label:string,menuList:Array<any>,clickCallback:any}>{return this._CurrentModuleMenuItems;}; 

  public setCurrentModuleMenuItems(Label:string,menuList:Array<any>,clickCallback){
      this._CurrentModuleMenuItems.next({Label:Label,menuList:menuList,clickCallback:clickCallback})
  }
}
