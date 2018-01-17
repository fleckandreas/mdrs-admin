import { Component, OnInit } from '@angular/core';
import {DataConnectorService} from '../../service/data-connector.service';
import {LogService} from '../../service/log.service';
import {WebSite,Content,ModelController,ChangeType} from '../../classes/class-definitions';
@Component({
  selector: 'app-web-manager',
  templateUrl: './web-manager.component.html',
  styleUrls: ['./web-manager.component.css']
})
export class WebManagerComponent implements OnInit {

  constructor(private dataConnector:DataConnectorService,private logService:LogService) { }

  public webSiteController:ModelController;
  public languages:Array<any>;
  ngOnInit() {
    
    this.dataConnector.getWebsite().then(data=>{
      this.logService.log(data);
      this.webSiteController=data;
    })
  }
  public addContent(){
    (this.webSiteController.Data as WebSite).Content.push(new Content());
    this.webSiteController.wasChanged(ChangeType.AddWebsite);
  }
  public deleteContent(content){
    (this.webSiteController.Data as WebSite).Content = (this.webSiteController.Data as WebSite).Content.filter(c=>{return c!=content});
    this.webSiteController.wasChanged(ChangeType.DeleteWebsite);
  }
  
}
