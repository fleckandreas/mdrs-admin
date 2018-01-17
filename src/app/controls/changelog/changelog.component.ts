import { Component, OnInit,Input } from '@angular/core';
import { CatalogController } from '../../classes/class-definitions';

@Component({
  selector: 'app-changelog',
  templateUrl: './changelog.component.html',
  styleUrls: ['./changelog.component.css']
})
export class ChangelogComponent implements OnInit {
@Input() catalogController:CatalogController
  constructor() { }

  log:Array<any>=[];
  ngOnInit() {
    this.log = this.catalogController.Changes.map(c=>{
      return {
        Text:c.Description
      }
    })
    console.log(this.log)
  
  }

}
