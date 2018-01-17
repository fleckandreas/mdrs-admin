import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-administration',
  templateUrl: './administration.component.html',
  styleUrls: ['./administration.component.css']
})
export class AdministrationComponent implements OnInit {

  constructor() { }
  selectedTabIndex=0;
  tabChange(event) {
    this.selectedTabIndex = event.index;
   // this.dataConnectorService.AppState.Tabs[this.propertyController.DBUID]=event.index
  }
  ngOnInit() {
  }

}
