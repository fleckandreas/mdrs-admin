
import {EventEmitter, Injectable} from '@angular/core';
import { KeyValueDiffer } from '@angular/core';
export enum ChangeType{
    Key = 0,
    Metadata = 1,
    Property = 2,
    
    PropertyType = 4,
    
    AddCatalog = 5,
    DeleteCatalog=6,


    AddScopeGroup = 10,
    AddScope = 11,
    AddProperty = 12,
    AddValue = 13,

    DeleteScopeGroup = 14,
    DeleteScope = 15,
    DeleteProperty = 16,
    DeleteValue = 17,

    MainLanguage = 20,
    OptionalLanguages = 21,
    UID =22,
    AdministratedBy=23,
    EditedBy=24,

    AddPropertyType =80,
    AddWebsite =81,
    AddUser=82,
    DeletePropertyType=83,
    DeleteWebsite=84,
    DeleteUser=85,
    Unspecific=99,
}
export class DynProperty{
    Type:string;
    Name:string;
    Control:string;
}

export class Change{
    constructor(type:string,description:string){
        this.Type = type;
        this.Description=description;
    }
   readonly Type:string;
   readonly Description:string;
}
export class Settings{
    PropertyTypes:Array<string>=[];
    EmailSettings:{
        Title:"",
        Text:""
        From:""
    }
    AppSettings:{
        UIDPattern:"",
        NewCatalogNeedPermission:false,
    }
}
export class Metadata {
    Label:string="";
    Description:string="";
    Language:string="";    
}
export interface DBModel{
    _dbuid:string;
    _type:string;
}
export class ScopeGroup implements DBModel{
    _dbuid:string;
    _type:string="ScopeGroup";
    Key:string;
    Metadata:Array<Metadata>=[];
}
export class Scope implements DBModel{
    _dbuid:string;
    _type:string="Scope";
    Key:string;
    Metadata:Array<Metadata>=[];
    Group:string;
}
export class Value{
    _dbuid:string;
    _type:string="Value";
    Key:string;
    Metadata:Array<Metadata>=[];
    Deprecated:boolean=false;
}
export class Property implements DBModel{
    _dbuid:string;
    _type:string="Property";
    Key:string;
    Metadata:Array<Metadata>=[];
    Public:boolean=true;
    Deprecated:boolean=false;
    Type:string="";
    ScopeRef:string="";
    Values:Array<Value>=[];
}

export class Catalog  implements DBModel {
    _dbuid:string;
    _type:string="Catalog";
    CatalogMetadata:{
        UID:string,
        Metadata:Array<Metadata>,
        MainLanguage:string,
        OptionalLanguages:string,
    }={
        UID:"",
        Metadata:[],
        MainLanguage:"",
        OptionalLanguages:"",
    }
    //We use this in a more generic way in the controller--> ChildrenByScope
    /*
    Scopes:Array<Scope>=[];
    ScopeGroups:Array<ScopeGroup>=[];
    Properties:Array<Property>=[];
    */
    //ManagementInfo
    Public:boolean=false;
    Owner:string="";
    AdministratedBy:Array<string>=[];
    EditedBy:Array<string>=[];
    
    //serverside property
    readonly LastChange:string;
}    
export class User{
    UID:string;
    Name:string="";
    EMail:string="";
    isAdmin:boolean=false;
}

export class ModelController{
    constructor(dbuid:string){
        this._dbuid = dbuid;
    }
    private _dbuid;
    get DBUID(){
        return this._dbuid;
    }
    Children:Array<DataModelController>=[]
    ViewSettings:{};
    
    Type:string="";
    Changes:Array<Change>=[];
    AccessControl:{};
    Data:any=null;
    
    //CacheInformation    
    Online:boolean=false;
    isComplete:boolean=true;
    Trashed:boolean=false;
    lastSync:Date;
    Changed:boolean=false;
    public wasChanged(change:ChangeType,ident:string=""){
      //  console.log("CHANGE DETECT");
        this.Changed=true;
        this.AddChange(change.toString(),ident);
    }
    public AddChange(type:string,description:string){
        this.Changes.push(new Change(type,description))
        //this.wasChanged(type);
    }
}

export class CatalogController extends ModelController{
    constructor(catalog:Catalog){
        super(catalog._dbuid);
        this.Type ="Catalog";
        this.Data = catalog;
    }
}

export class DataModelController extends ModelController{
    constructor(dbuid:string,_catalogDBUID:string){
        super(dbuid);
        this.catalogDBUID = _catalogDBUID;
    }
    readonly catalogDBUID;
        
}

export class Content{
    Label:string="";
    Language:string="";
    Html:string="";
}
export class WebSite{
    Content:Array<Content>=[];
    SubPages:Array<WebSite>=[]
}