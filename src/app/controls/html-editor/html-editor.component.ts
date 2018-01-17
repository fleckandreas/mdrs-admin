import { Component, OnInit,Input } from '@angular/core';
import { ModelController,  ChangeType } from '../../classes/class-definitions';

@Component({
  selector: 'app-html-editor',
  template: `<quill-editor (onContentChanged)="onChange($event)" [modules]="formats" [(ngModel)]="content.Html" [style]="{height: '250px'}" placeholder=""></quill-editor>`
 
})
export class HtmlEditorComponent implements OnInit {
  @Input()content:{Html}
  @Input()modelController:ModelController
  constructor() { }
  
  onChange(event){
    if(event.source =="user" && this.modelController){
      this.modelController.wasChanged(ChangeType.Property,"HTML");
    }
  }
  public formats={
    toolbar: [
      ['bold', 'italic', 'underline'],        // toggled buttons
      ['blockquote', 'code-block','text-block'],
  
      [{ 'header': 1 }, { 'header': 2 }],               // custom button values
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      [{ 'script': 'sub'}, { 'script': 'super' }],      // superscript/subscript
      [{ 'indent': '-1'}, { 'indent': '+1' }],          // outdent/indent
      
      [{ 'size': ['small', false, 'large', 'huge'] }],  // custom dropdown
      [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
  
      [{ 'color': [] }, { 'background': [] }],          // dropdown with defaults from theme
      [{ 'font': [] }],
      [{ 'align': [] }],
  
      ['clean'],                                         // remove formatting button
  
      ['link', 'image']                         // link and image, video
    ]
  };
  ngOnInit() {
  }

}
