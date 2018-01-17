import { Injectable } from '@angular/core';
import { Headers, Http, RequestOptions } from '@angular/http';
import { LogService } from './log.service';
import { DataModelController,ModelController,DBModel, CatalogController, Settings, Catalog, WebSite, User, Metadata, Scope, ScopeGroup, Property, Value, DynProperty, ChangeType } from '../classes/class-definitions';
import { FileUploader } from 'ng2-file-upload';
import * as xml2js from 'xml2js';
import { TranslateService } from '@ngx-translate/core';
import { MetadataComponent } from '../controls/metadata/metadata.component';
import { Local } from 'protractor/built/driverProviders';
import { CatalogComponent } from '../catalog/catalog/catalog.component';
@Injectable()
export class DataConnectorService {

  constructor(private http: Http, private logService: LogService, private translate: TranslateService) { 
    let user = localStorage.getItem("currentUser");
    if(user){
      try{
        this.user = JSON.parse(user) as User;
        this.customRequestOptions.headers.append("X-AppToken",this.user.UID);
        console.log("Loggedin by cache");
        this.init();
      }catch(e){
        console.log(e);
        this.logout()
      }
      this.customRequestOptions.headers.append( 'Content-Type','application/json; charset=utf-8' );
      
    }
  }
  public AppState:{
    Tabs:{}
  }={
    Tabs:{}
  }
  private init(){
    this.getSettings()
  }
  public _Changes=[];
  private customRequestOptions:RequestOptions=new RequestOptions({headers:new Headers()})
  private URL = "";
  public uploader: FileUploader = new FileUploader({ url: this.URL });
  //private __dataurlprefix = "http://localhost/mdrs-server/";
  //private serverUrl = "http://localhost/mdrs-server/dataconnector.php/";
  private __dataurlprefix = "mdrs-server/";
  private serverUrl = "mdrs-server/dataconnector.php/";
  public globalSeperator = " ";
  public getDownloadUri(catalogid:string){
    return this.__dataurlprefix+"publicdataconnector.php/catalogxml/"+catalogid;
  }
  public getMetadataByLanguage(metadata: Array<Metadata>,fallback:string=null): Metadata {
    if(metadata.length==0 && fallback!=null){
      let m = new Metadata;
      m.Label = fallback;
      return m;
    }
    let m = metadata.find(metadata => { return metadata.Language == this.translate.currentLang });
    if (!m) {
      m = metadata[0];
    }
    if (!m) {
      m = new Metadata;
      m.Label = "undefiniert";
    }
    return m;
  }
  /** HELPER */
  public UUID(): string {
    if (typeof (window) !== "undefined" && typeof (window.crypto) !== "undefined" && typeof (window.crypto.getRandomValues) !== "undefined") {
      // If we have a cryptographically secure PRNG, use that
      // http://stackoverflow.com/questions/6906916/collisions-when-generating-uuids-in-javascript
      let buf: Uint16Array = new Uint16Array(8);
      window.crypto.getRandomValues(buf);
      return (this.pad4(buf[0]) + this.pad4(buf[1]) + "-" + this.pad4(buf[2]) + "-" + this.pad4(buf[3]) + "-" + this.pad4(buf[4]) + "-" + this.pad4(buf[5]) + this.pad4(buf[6]) + this.pad4(buf[7]));
    } else {
      // Otherwise, just use Math.random
      // https://stackoverflow.com/questions/105034/create-guid-uuid-in-javascript
      // https://stackoverflow.com/questions/11605068/why-does-jshint-argue-against-bitwise-operators-how-should-i-express-this-code
      return this.random4() + this.random4() + "-" + this.random4() + "-" + this.random4() + "-" +
        this.random4() + "-" + this.random4() + this.random4() + this.random4();
    }
  }

  private pad4(num: number): string {
    let ret: string = num.toString(16);
    while (ret.length < 4) {
      ret = "0" + ret;
    }
    return ret;
  }

  private random4(): string {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
//DYNProperties

  public getDynProperties(type:string):Array<DynProperty>{
    if (type=="User"){
      return [
        {Type:"string",Name:"Name",Control:"string"},
        {Type:"email",Name:"EMail",Control:"string"},
        {Type:"boolean",Name:"isAdmin",Control:"checkbox"},
      ];
    }
    if (type=="Website"){
      return [
        {Type:"string",Name:"Label",Control:"string"},
        {Type:"email",Name:"Language",Control:"singleselect"},
        {Type:"html",Name:"Html",Control:"html"},
      ];
    }
    if (type=="EmailSettings"){
      return [
        {Type:"email",Name:"From",Control:"string"},
        {Type:"string",Name:"Title",Control:"string"},
        {Type:"string",Name:"Text",Control:"string_multiline"},
      ];
    }
    if (type=="AppSettings"){
      return [
        {Type:"string",Name:"UIDPattern",Control:"string"},
        {Type:"boolean",Name:"NewCatalogNeedPermission",Control:"checkbox"},        
      ];
    }
    if(type=="Metadata"){
      return [
        {Type:"string",Name:"Language",Control:"singleselect"},
        {Type:"string",Name:"Label",Control:"string"},
        {Type:"string",Name:"Description",Control:"string_multiline"},        
      ];
    }
    if(type=="CatalogSettings"){
      return [
        {Type:"string",Name:"_dbuid",Control:"string_ro"},
        {Type:"string",Name:"Owner",Control:"string"},
        {Type:"boolean",Name:"Public",Control:"checkbox"},
        {Type:"list",Name:"AdministratedBy",Control:"multiselect"},
        {Type:"list",Name:"EditedBy",Control:"multiselect"},
      ];
    }
    if(type=="CatalogMetadata"){
      return [
        {Type:"string",Name:"UID",Control:"string"},
        {Type:"string",Name:"MainLanguage",Control:"string"},
        {Type:"string",Name:"OptionalLanguages",Control:"string"},
        {Type:"list",Name:"Metadata",Control:"metadata"},
      ];
    }
    if(type=="ScopeGroup"){
      return [
        {Type:"string",Name:"Key",Control:"string"},
        {Type:"list",Name:"Metadata",Control:"metadata"},
      ];
    }
    if(type=="Scope"){
      return [
        {Type:"string",Name:"Key",Control:"string"},
        {Type:"string",Name:"Group",Control:"singleselect"},
        {Type:"list",Name:"Metadata",Control:"metadata"}        
      ];
    }
    if(type=="PropertyM"){
      return [
        {Type:"string",Name:"Key",Control:"string"},
        {Type:"list",Name:"Metadata",Control:"metadata"},
        
      ];
    }
    if(type=="PropertyA"){
      return [
        {Type:"string",Name:"Type",Control:"singleselect"},
        {Type:"string",Name:"ScopeRef",Control:"multiselect"},
        {Type:"boolean",Name:"Public",Control:"checkbox"},
        {Type:"boolean",Name:"Deprecated",Control:"checkbox"},
      ];
    }
    if(type=="Value"){
      return [
        {Type:"boolean",Name:"Deprecated",Control:"checkbox"},
        {Type:"string",Name:"Key",Control:"string"},        
        {Type:"list",Name:"Metadata",Control:"metadata"},
        
      ];
    }
    
    
  }
  public getOptions(name:string,refElement:any):Promise<Array<{key,value}>>{
    return new Promise((resolve,reject)=>{
    let ret =[];
    console.log(name)
    if (name == "Language"){
       this.getLanguages().then(languages=>{
        ret = languages.map(l=>{return {value:l.Code,label:l.Label}});
        resolve(ret);
       });
    }
    if (name == "Group"){
        //need the catalog
        let dataModelController =this.__datacache.find(dmC=>{return dmC.DBUID == refElement._dbuid});
        if(dataModelController){
          let catalogController = this.__catalogcache.find(cmC=>{return cmC.DBUID == dataModelController.catalogDBUID});
          if (catalogController){
            ret = catalogController.Children.filter(dmC=>{return dmC.Type =="ScopeGroup"}).sort((a,b)=>this.defaultDataModelControllerSort(a,b)).map(dmC=>{return {value:dmC.Data.Key,label:this.getDataModelControllerLabel(dmC)}});
          }
        }
        resolve(ret);
    }
    if (name=="AdministratedBy" || name =="EditedBy"){
       this.getUser().then(user=>{
          ret = user.map(umC=>{return {value:umC.Data.UID,label:umC.Data.Name}});
         resolve(ret)
       })
    }
    if (name=="ScopeRef"){
     //need the catalog
     let dataModelController =this.__datacache.find(dmC=>{return dmC.DBUID == refElement._dbuid});
     if(dataModelController){
       let catalogController = this.__catalogcache.find(cmC=>{return cmC.DBUID == dataModelController.catalogDBUID});
       if (catalogController){
         ret = catalogController.Children.filter(dmC=>{return dmC.Type =="Scope"}).sort((a,b)=>this.defaultDataModelControllerSort(a,b)).map(dmC=>{return {value:dmC.Data.Key,label:this.getDataModelControllerLabel(dmC)}});
       }
     }
     resolve(ret);
   }
   if(name=="Type"){
    this.getPropertyTypes().then(propertyTypes=>{
      ret = propertyTypes.map(pt=>{return {value:pt,label:pt}});
      console.log(ret)
     resolve(ret)
   })
   }
    
    
  })
  }

  /** END DYNProperties */

  /**Languages */
  public getLanguages(): Promise<any> {
    return new Promise((resolve, reject) => {
      resolve([{ Code: "de", Label: "Deutsch" }, { Code: "en", Label: "English" }]);
    })
  }
  public getPropertyTypes(): Promise<Array<string>> {
    return new Promise((resolve, reject) => {
      this.getSettings().then(settings => {
        resolve(settings.Data.PropertyTypes);
      }).catch(e => {
        reject(e)
      })
    })
  }
  /**
   * 
   */

  /**Website */
  private _websiteController:ModelController=null;
  public getWebsite(): Promise<ModelController> {
    if(this._websiteController && this._websiteController.Changed){
      return new Promise((resolve,reject)=>{
        resolve(this._websiteController);
      })
    }
    return this.http.get(this.serverUrl + "website").toPromise().then(data => {
      if (data.text() != "") {
        let website = data.json() as WebSite;
        this._websiteController = new ModelController("website");        
        this._websiteController.Type ="Website";
        this._websiteController.Data = website;
        return this._websiteController;
      } else {
        //Ceate basic structure
        let website = new WebSite();;
        this.logService.log('create new website');
        this._websiteController = new ModelController("website");        
        this._websiteController.Type ="Website";
        this._websiteController.Data = website;
        return this._websiteController;
      }
    })
  }
  public saveWebsite(): Promise<any> {
    let data = this._websiteController.Data;
    return this.http.post(this.serverUrl + "website", data).toPromise().then(data => {
      if (data) {
        this._websiteController.Changed=false;
        this.logService.inform("Action:save Website->successful");
      }
    }).catch(e => {
      this.logService.inform("Action:save Website->error: " + e);
    })
  }
  /**Settings */
  private _settingsController:ModelController=null;
  public getSettings(): Promise<ModelController> {
    return this.http.get(this.serverUrl + "settings").toPromise().then(data => {
      if (data.text() != "") {
        let settings = data.json() as Settings;
        this._settingsController = new ModelController("settings");        
        this._settingsController.Type ="Settings";
        this._settingsController.Data = settings;
        return this._settingsController;;        
      } else {
        //Ceate basic structure
        this.logService.log('create new Settings');
        let settings = new Settings();
        this._settingsController = new ModelController("settings");        
        this._settingsController.Type ="Settings";
        this._settingsController.Data = settings;
        return this._settingsController;;        
      }
    })
  }
  public saveSettings(): Promise<any> {
    let data = this._settingsController.Data;
    return this.http.post(this.serverUrl + "settings", data).toPromise().then(data => {
      if (data) {
        this._settingsController.Changed=false;
        this.logService.inform("Action:save Settings->successful");
      }
    }).catch(e => {
      this.logService.inform("Action:save Settings->error: " + e);
    })
  }
  /**USER */
  private _user:Array<ModelController>=[];
  public addUser():ModelController{
    let newUser = new User();
    newUser.UID=this.UUID();
    let newUserController  = new ModelController(newUser.UID);
    newUserController.Data = newUser;
    newUserController.Type="User";
     this._user.push(newUserController)
     newUserController.wasChanged(ChangeType.AddUser,newUser.UID)
     return newUserController;
  }
  public getUser(): Promise<Array<ModelController>> {
    return this.http.get(this.serverUrl + "user").toPromise().then((data) => {

      ( data.json() as Array<User>).forEach(element => {
        if(!this._user.find(userModel=>{return userModel.DBUID == element.UID})){
          let newUserModel = new ModelController(element.UID);
          newUserModel.Data = element;
          newUserModel.Type="User";
          this._user.push(newUserModel)
        }
      });
      return this._user;
    });
  }
  public saveUser(userM: ModelController): Promise<any> {
    let user = userM.Data;
    if (user.UID != "") {
      return this.http.post(this.serverUrl + "user", user).toPromise().then(data => {
        if (data) {
          userM.Changed=false;
          this.logService.log(data);
          this.logService.inform("Action:save User->successful");
        }
      }).catch(e => {
        this.logService.inform("Action:save User->error: " + e);
      })
    }
  }
  //CATALOGs
  
  private __catalogcache: Array<CatalogController> = [];
  private __datacache: Array<DataModelController> = [];

  addCatalog():CatalogController{
      let newCatalog = new Catalog();
      newCatalog._dbuid=this.UUID();
      newCatalog.AdministratedBy.push(this.user.UID);
      newCatalog.CatalogMetadata.UID = this._settingsController.Data.AppSettings.UIDPattern
      let catalogController = new CatalogController(newCatalog);
      catalogController.Data = newCatalog;
      catalogController.Online=false;
      catalogController.isComplete=true;
      catalogController.AccessControl={isAdmin:true,isEditor:true};
      catalogController.wasChanged(ChangeType.AddCatalog)
      this.__catalogcache.push(catalogController);
      return catalogController;
    
  }
  public addChild(child:DBModel,catalogController:CatalogController):DataModelController{
    if (!child._dbuid){
      child._dbuid = this.UUID();
    }
    let childModelController = new DataModelController(child._dbuid,catalogController.DBUID)
    childModelController.Online=false;
    childModelController.wasChanged(ChangeType["Add"+child._type],child._dbuid);
    childModelController.Data = child;
    childModelController.Type=child._type;
    childModelController.AccessControl=catalogController.AccessControl;
    catalogController.Children.push(childModelController);
    this.__datacache.push(childModelController);
    return childModelController;
  }
  public removeChild(child:DataModelController,catalogController:CatalogController){
    let index = catalogController.Children.findIndex(item => { return item == child })
    catalogController.Children.splice(index, 1);
    if(child.Online){
      child.Trashed=true;
      child.wasChanged(ChangeType["Delete"+child.Type],child.DBUID+"@"+child.catalogDBUID)
    }else{
      //just local
      let index = this.__datacache.findIndex(item => { return item == child })
      this.__datacache.splice(index, 1);
    }
    
  }
  

  /**CatalogContainer */
  private generateAC(catalogController:CatalogController){
    let isEditor = catalogController.Data.EditedBy.find(uid=>uid == this.user.UID)!=null;
    let isAdmin = catalogController.Data.AdministratedBy.find(uid=>uid == this.user.UID)!=null;
    if (this.user.isAdmin == true){
      isAdmin = true;
    }
      catalogController.AccessControl={
        isAdmin:isAdmin,
        isEditor:isAdmin || isEditor
      }
  }
  private flatCatalogStructure(catalogData:{Catalog:Catalog,Children:Array<any>}):CatalogController{
    let catalogController = this.__catalogcache.find(cc=>catalogData.Catalog._dbuid == cc.DBUID);
    if(!catalogController){
      catalogController = new CatalogController(catalogData.Catalog);
      this.__catalogcache.push(catalogController);
    }
    this.generateAC(catalogController)
    catalogController.Online=true;
      catalogController.isComplete=true;
      
      catalogData.Children.forEach((element:DBModel) => {
        let dm = new DataModelController(element._dbuid,catalogData.Catalog._dbuid);
        dm.Data = element;
        dm.isComplete=true;
        dm.Online=true;
        dm.AccessControl=catalogController.AccessControl;
        this.__datacache.push(dm);
        dm.Type = element._type;
        catalogController.Children.push(dm);
      });

     
      return catalogController;
  
  }
  public unsaved(): number {
  return this.__datacache.filter(c => {
      return c.Changed;
    }).length + this.__catalogcache.filter(c=>c.Changed).length + this._user.filter(u=>{return u.Changed}).length + (this._websiteController && this._websiteController.Changed ? 1:0) +  + (this._settingsController && this._settingsController.Changed ? 1:0);
  }
  public saveCatalogs() {
    let cats=[];
    this._user.forEach(userController=>{
      if (userController.Changed){
        this.saveUser(userController);
      }
    })
    if(this._websiteController && this._websiteController.Changed){
      this.saveWebsite();
    }
    if(this._settingsController && this._settingsController.Changed){
      this.saveSettings();
    }
    this.__catalogcache.forEach(catalogController=>{
      console.log("save",catalogController);
      //Scopes,ScopeGroups & Properties will save independ
      if(catalogController.Changed){
      let cp= this.http.post(this.serverUrl + "catalog" ,{Data:catalogController.Data,Changes:catalogController.Changes},this.customRequestOptions).toPromise().then(response=>{
        catalogController.Online=true;
        catalogController.Changed=false;
        catalogController.Changes=[];
      }).catch(e=>{

      })
      cats.push(cp);
      }
    })
    Promise.all(cats).then(()=>{
      console.log("start sync")
    this.__datacache.forEach(dataModelController=>{
      if(dataModelController.Changed && !dataModelController.Trashed){

        let url =this.serverUrl + "data/"+dataModelController.catalogDBUID;
        this.http.post( url,{Data:dataModelController.Data,Changes:dataModelController.Changes},this.customRequestOptions).toPromise().then(response=>{
          console.log(response.json())
          dataModelController.Online=true;
          dataModelController.Changed=false;
          dataModelController.Changes=[];
        }).catch(e=>{
  
        })
      }
      if(dataModelController.Trashed){

        let url =this.serverUrl + "data/"+dataModelController.catalogDBUID +"/" + dataModelController.Type +"/"+dataModelController.DBUID;
        this.http.delete( url,this.customRequestOptions).toPromise().then(response=>{
          console.log(response.json())          
          let index = this.__datacache.findIndex(item => { return item == dataModelController })
          this.__datacache.splice(index, 1);
        }).catch(e=>{
  
        })
      }
    })
  })
  };
   
  public getCatalogControllerList(): Promise<Array<CatalogController>> {
    return new Promise((resolve, reject) => {
      let p = [];
      this.getCatalogs().then(catalogs => {
        catalogs.forEach(catalog => {
          console.log(catalog);
          if (this.__catalogcache.find(cc=>{return cc.DBUID == catalog._dbuid;})==null){
            let newCatalogController = new CatalogController(catalog);
            newCatalogController.Online = true;
            newCatalogController.isComplete=false;
            this.generateAC(newCatalogController)
            this.__catalogcache.push(newCatalogController);
          }else{
            console.log("use cache")
          } 
        });
        resolve(this.__catalogcache);
    });
  })
 };
  public getCatalogController(uid: string): Promise<CatalogController> {
    return new Promise((resolve, reject) => {
    console.log("get controller for " + uid);
    let cachedCatalogController = this.__catalogcache.find(cc=>{return cc.DBUID == uid;})
    if (cachedCatalogController && cachedCatalogController.isComplete){
      resolve(cachedCatalogController);
    }else{
      console.log("get online controller for " + uid);
      this.getCatalog(uid).then(responseData => {

          

          let newCatalogController = this.flatCatalogStructure(responseData);
          /*newCatalogController.Online=true;
          newCatalogController.isComplete=true;
          console.log(newCatalogController);
          this.__catalogcache.push(newCatalogController);*/
          resolve(newCatalogController);
        }).catch((e) => {
          this.logService.log(e)
          this.logService.inform(e)
          reject();
        });
      }  
    })

  };


  private getCatalogs(): Promise<Array<Catalog>> {
    return this.http.get(this.serverUrl + "catalogs",this.customRequestOptions).toPromise().then((data) => {
      return data.json() as Array<Catalog>;
    });
  }
  private getCatalog(dbuid:string): Promise<{Catalog:Catalog,Children:Array<any>}>{
    return this.http.get(this.serverUrl + "catalog/"+dbuid,this.customRequestOptions).toPromise().then((data) => {
      return data.json() as {Catalog:Catalog,Children:Array<any>};
    });
  }
  
  private saveCatalog(catalog: Catalog): Promise<any> {
    if (catalog._dbuid != "") {
      return this.http.post(this.serverUrl + "catalogcontainer", catalog,this.customRequestOptions).toPromise().then(data => {
        if (data) {
          this.logService.log(data);
          this.logService.inform("Action:save Catalog->successful");
        }
      }).catch(e => {
        this.logService.inform("Action:save Catalog->error: " + e);
      })
    }
  }
  public validateCatalog(catalog:CatalogController):Promise<any>{
    return this.http.get(this.serverUrl+"validatecatalog/" + catalog.DBUID).toPromise().then(response=>{
      console.log(response.text());
      return response.json()
    })
  }

  /**Catalog */

  /*private getCatalogByUID(uid: string): Promise<Catalog> {
    return this.http.get(this.serverUrl + "catalogbyuid/" + uid).toPromise().then((data) => {
      if (data.text() != "") {
        let catalog: Catalog = data.json() as Catalog;
        return catalog;
      }
      return null;
    }).catch((e) => {
      this.logService.inform("Action:getCatalogByUID->error: " + e);
      return null;
    });
  }
  private saveCatalog(UID: string, catalog: Catalog): Promise<any> {
    return this.http.post(this.serverUrl + "catalog/" + UID, catalog).toPromise().then(data => {
      if (data) {
        this.logService.log(data);
        this.logService.inform("Action:save Catalog->successful");
      }
    }).catch(e => {
      this.logService.inform("Action:save Catalog->error: " + e);
      this.logService.log(e);
    })

  }
  */

  //AUTH
  public user:User;
  public login(username:string,password:string):Promise<User>{
   return this.http.post(this.__dataurlprefix+"authentification.php/login",{username:username,password:password}).toPromise().then(response=>{
     if(response.text()!=""){
      this.user = response.json() as User;
      localStorage.setItem("currentUser",JSON.stringify(this.user));
      this.customRequestOptions.headers.delete("X-AppToken");
      this.customRequestOptions.headers.append("X-AppToken",this.user.UID);
      this.init();
      return this.user;
     }else{
       return null;
     }
      
    }).catch(e=>{
      console.log(e);
      return null;
    })
  }
  public logout(){
    this.customRequestOptions.headers.delete("X-AppToken");
    localStorage.removeItem("currentUser");
    this.user=null;
  }
  public changePassword(oldpassword,newpassword):Promise<boolean>{
    return this.http.post(this.serverUrl+"changepassword",{oldPassword:oldpassword,newPassword:newpassword},this.customRequestOptions).toPromise().then(response=>{
      if(response.text()=="changed"){
        return true;
      }else{
        console.log(response.text());
        return false;
      }
      
    });
  }

  public token = "";
  postChunked(url: string, part: any, fileitem: any): Promise<any> {
    return new Promise((resolve, reject) => {
      let formData: FormData = new FormData();
      formData.append('file', part.data, fileitem.File.name);
      let xhr: XMLHttpRequest = new XMLHttpRequest();

      xhr.onreadystatechange = () => {
        if (xhr.readyState === 4) {
          if (xhr.status === 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      };

      xhr.upload.onprogress = (event) => {
        part.Progress = (Math.round(event.loaded / event.total * 100));
        fileitem.calcProgress()
      };
      console.log('load file  chunks:' + url + '####' + this.token);
      xhr.open('POST', url, true);
      xhr.setRequestHeader("X-AppToken", this.token);
      xhr.send(formData);


    });//END PROMISE
  }

  uploadFile(url: string, fileitem: any): Promise<any> {

    let BYTES_PER_CHUNK = 1024 * 1024;

    let t = this;
    let file = fileitem.File;
    let promises = [];
    return new Promise((resolve, reject) => {
      let size = file.size;
      if (size > BYTES_PER_CHUNK) {
        var start = 0;
        var end = BYTES_PER_CHUNK;
        while (start < size) {
          var chunk = file.slice(start, end);
          fileitem.Chunks.push({ data: chunk, Progress: 0 })
          start = end;
          if (size - start < BYTES_PER_CHUNK) {
            end = start + size - start;
          } else {
            end = start + BYTES_PER_CHUNK;
          }
        }
      } else {
        fileitem.Chunks.push({ data: file, Progress: 0 });
      }

      let totalchunks = fileitem.Chunks.length;
      console.log('load file with chunks:' + totalchunks)
      fileitem.Chunks.forEach(function (item, index) {
        promises.push(t.postChunked(t.__dataurlprefix + "upload.php/" + url + "&chunknr=" + index + "&totalchunks=" + totalchunks, item, fileitem))
      })

      Promise.all(promises).then(p => {
        console.log("ALL Chunks ok")
        console.log(p)
        fileitem.isSuccess = true;
        let last = p.find(a => a.answer === "ok")
        resolve(last)
      }).catch(e => {
        console.log("error in uploadmodule")
        console.log(e)
      })

    })


  }

  public parseXml: any;
  public getXML() {
    if (this.parseXml == null) {
      let currentWindow: any = window;
      if (currentWindow.DOMParser) {
        this.parseXml = function (xmlStr) {
          return (new currentWindow.DOMParser()).parseFromString(xmlStr, "text/xml");
        };
      } else if (typeof currentWindow.ActiveXObject != "undefined" && new currentWindow.ActiveXObject("Microsoft.XMLDOM")) {
        this.parseXml = function (xmlStr) {
          var xmlDoc = new currentWindow.ActiveXObject("Microsoft.XMLDOM");
          xmlDoc.async = "false";
          xmlDoc.loadXML(xmlStr);
          return xmlDoc;
        };
      } else {
        this.parseXml = function () { return null; }
      }
    }
    return this.parseXml;
  }
  private buildMetadata(arr: Array<any>): Array<Metadata> {
    let returnArr: Array<Metadata> = [];
    let hlp = {};
    let labels = arr[0].Label;
    let descriptions = arr[0].Description;
    if (labels) {
      labels.forEach(element => {
        let lang = element.$["xml:lang"]
        let val = element._
        if (val) {
          if (hlp[lang]) {
            hlp[lang].Label = val;
          } else {
            let newMetadata = new Metadata();
            newMetadata.Label = val;
            newMetadata.Language = lang;
            returnArr.push(newMetadata);
            hlp[lang] = newMetadata;
          }
        }

      });
    }
    if (descriptions) {
      descriptions.forEach(element => {
        let lang = element.$["xml:lang"]
        let val = element._
        if (val) {
          if (hlp[lang]) {
            hlp[lang].Description = val;
          } else {
            let newMetadata = new Metadata();
            newMetadata.Description = val;
            newMetadata.Language = lang;
            returnArr.push(newMetadata);
            hlp[lang] = newMetadata;
          }
        }

      });
    }
    return returnArr;
  }

  public convertXmlToCatalog(xml: string): Promise<CatalogController> {


    return new Promise((resolve, reject) => {
      try {
        let catalog = new Catalog();
        catalog._dbuid = this.UUID();
        catalog.AdministratedBy.push(this.user.UID);
        let children = [];
        let t = this;
        xml2js.parseString(xml, (err, result) => {
          console.dir(result); // Prints JSON object!
          let xmlCatalog: any = result.Catalog;

          catalog.CatalogMetadata.UID = xmlCatalog.CatalogMetadata[0].UID[0];
          catalog.CatalogMetadata.MainLanguage = xmlCatalog.CatalogMetadata[0].MainLanguage[0];
          catalog.CatalogMetadata.OptionalLanguages = xmlCatalog.CatalogMetadata[0].OptionalLanguages[0];
          catalog.CatalogMetadata.Metadata = t.buildMetadata(xmlCatalog.CatalogMetadata[0].Metadata);
          xmlCatalog.ScopeGroups[0].ScopeGroup.forEach(element => {
            let xmlScopegroup = element;
            let newScopeGroups = new ScopeGroup();
            newScopeGroups._dbuid = this.UUID();
            newScopeGroups.Key = xmlScopegroup.$['key'];
            newScopeGroups.Metadata = t.buildMetadata(xmlScopegroup.Metadata)
           children.push(newScopeGroups);
          });
          xmlCatalog.Scopes[0].Scope.forEach(element => {
            let xmlScope = element;
            let newScope = new Scope();
            newScope._dbuid = this.UUID();
            newScope.Key = xmlScope.$['key'];
            newScope.Group = xmlScope.$['group'];
            newScope.Metadata = t.buildMetadata(xmlScope.Metadata)
            children.push(newScope);
          });
          xmlCatalog.Properties[0].Property.forEach(element => {
            let xmlProperty = element;

            let newProperty = new Property();
            newProperty._dbuid = this.UUID();
            newProperty.Key = xmlProperty.$['key'];

            newProperty.Public = (xmlProperty.$['public'] as string).toLowerCase() == "true";
            newProperty.Deprecated = (xmlProperty.$['deprecated'] as string).toLowerCase() == "true";
            newProperty.ScopeRef = xmlProperty.ScopeRef[0];
            newProperty.Type = (xmlProperty.$['type'] as string);
            newProperty.Metadata = t.buildMetadata(xmlProperty.Metadata)
            if (newProperty.Key == "p1") {
              console.log(element);
            }
            if (xmlProperty.Values[0]) {
              xmlProperty.Values[0].Value.forEach(value => {
                let newValue = new Value();
                newValue._dbuid = this.UUID();                
                newValue.Deprecated = (value.$['deprecated'] as string).toLowerCase() == "true";
                newValue.Key = value.$['key'];
                newValue.Metadata = t.buildMetadata(value.Metadata);
                newProperty.Values.push(newValue);
              });
            } else {
              // console.log("Value error ",xmlProperty)
            }
          children.push(newProperty);
            // console.log(newProperty);
          });
          
          let controller = this.flatCatalogStructure({Catalog:catalog,Children:children}) ;
          console.log(controller);
          controller.Changed=true;
          controller.Children.forEach(e=>{e.Changed=true;})
          resolve(controller)
        });
        /*let xmlCatalog= xml.childNodes[0] as HTMLElement;
        let xmlMetadata = xmlCatalog.getElementsByTagName("Metadata");
        console.log(xmlCatalog)
        console.log(xmlMetadata)
        return Catalog;*/
      } catch (e) {
        resolve(null);
        this.logService.log(e);
        this.logService.inform("convertXmlToCatalog-->error: " + e)
      }

    });

  }
  public getDataModelControllerLabel(controller:DataModelController):string{
    let l =this.getMetadataByLanguage(controller.Data.Metadata,controller.DBUID).Label;
    return l;
  }
  public getCatalogControllerLabel(controller:CatalogController):string{
    let l =this.getMetadataByLanguage(controller.Data.CatalogMetadata.Metadata,controller.DBUID).Label;
    return l;
  }
  public  defaultCatalogControllerSort (a:CatalogController,b:CatalogController):number{

    let la = this.getCatalogControllerLabel(a);
    let lb = this.getCatalogControllerLabel(b);
    return la.localeCompare(lb);
  }
  public defaultDataModelControllerSort(a:DataModelController,b:DataModelController):number{
    let la = this.getDataModelControllerLabel(a);
    let lb = this.getDataModelControllerLabel(b);
    return la.localeCompare(lb);
  }
  public sort = function naturalSort(options) {
    'use strict';
    if (!options) options = { direction: "asc" };

    return function (a, b) {
      var EQUAL = 0;
      var GREATER = (options.direction == 'desc' ?
        -1 :
        1
      );

      var SMALLER = -GREATER;

      var re = /(^-?[0-9]+(\.?[0-9]*)[df]?e?[0-9]?$|^0x[0-9a-f]+$|[0-9]+)/gi;
      var sre = /(^[ ]*|[ ]*$)/g;
      var dre = /(^([\w ]+,?[\w ]+)?[\w ]+,?[\w ]+\d+:\d+(:\d+)?[\w ]?|^\d{1,4}[\/\-]\d{1,4}[\/\-]\d{1,4}|^\w+, \w+ \d+, \d{4})/;
      var hre = /^0x[0-9a-f]+$/i;
      var ore = /^0/;

      var normalize = function normalize(value) {
        var string = '' + value;
        return (options.caseSensitive ?
          string :
          string.toLowerCase()
        );
      };

      // Normalize values to strings
      var x = normalize(a).replace(sre, '') || '';
      var y = normalize(b).replace(sre, '') || '';

      // chunk/tokenize
      var xN = x.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0');
      var yN = y.replace(re, '\0$1\0').replace(/\0$/, '').replace(/^\0/, '').split('\0');

      // Return immediately if at least one of the values is empty.
      if (!x && !y) return EQUAL;
      if (!x && y) return GREATER;
      if (x && !y) return SMALLER;

      // numeric, hex or date detection
      //console.log(x.match(hre));
      var xD = null// parseInt(x.match(hre).toString()) || (xN.length != 1 && x.match(dre) && Date.parse(x));
      var yD = null// parseInt(y.match(hre).toString()) || xD && y.match(dre) && Date.parse(y) || null;
      var oFxNcL, oFyNcL;

      // first try and sort Hex codes or Dates
      if (yD) {
        if (xD < yD) return SMALLER;
        else if (xD > yD) return GREATER;
      }

      // natural sorting through split numeric strings and default strings
      for (var cLoc = 0, numS = Math.max(xN.length, yN.length); cLoc < numS; cLoc++) {

        // find floats not starting with '0', string or 0 if not defined (Clint Priest)
        oFxNcL = !(xN[cLoc] || '').match(ore) && parseFloat(xN[cLoc]) || xN[cLoc] || 0;
        oFyNcL = !(yN[cLoc] || '').match(ore) && parseFloat(yN[cLoc]) || yN[cLoc] || 0;

        // handle numeric vs string comparison - number < string - (Kyle Adams)
        if (isNaN(oFxNcL) !== isNaN(oFyNcL)) return (isNaN(oFxNcL)) ? GREATER : SMALLER;

        // rely on string comparison if different types - i.e. '02' < 2 != '02' < '2'
        else if (typeof oFxNcL !== typeof oFyNcL) {
          oFxNcL += '';
          oFyNcL += '';
        }

        if (oFxNcL < oFyNcL) return SMALLER;
        if (oFxNcL > oFyNcL) return GREATER;
      }

      return EQUAL;
    };
  };


}
