import { Component, OnInit, Input,EventEmitter,Output } from '@angular/core';
import { LogService } from '../../service/log.service';
import { Metadata,ModelController, ChangeType } from '../../classes/class-definitions';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogListSelectComponent } from '../../controls/dialog-list-select/dialog-list-select.component';
@Component({
  selector: 'app-metadata',
  templateUrl: './metadata.component.html',
  styleUrls: ['./metadata.component.css']
})
export class MetadataComponent implements OnInit {
  @Input() metadata: Array<Metadata>;
  @Input() modelController: ModelController;
  @Input() isreadonly:boolean=true;
  //@Output() onChange:EventEmitter<any> = new EventEmitter();
  constructor(public dialog: MatDialog,  private logService: LogService) { }

  
  ngOnInit() {
    
  }
  public addMetadata() {
    this.metadata.push(new Metadata());
    this.onValueChange();
  }
  onValueChange(){
    console.log("CHANGE METADATA");
    if(this.modelController){
      this.modelController.wasChanged(ChangeType.Metadata);
    }
    
  }
  public deleteMetadata() {
    let dialogRef = this.dialog.open(DialogListSelectComponent, {
      data: {
        Title: "Remove_Metadata", List: this.metadata.map((item: Metadata) => {
          return {
            Label: item.Label,
            Selected: false,
            Data: item
          }
        })
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      //result <== data.list 

      (result as Array<any>).forEach(u => {
        if (u.Selected == true) {
          let metadata = u.Data;
          let index = this.metadata.findIndex(item => { return item == metadata })
          this.metadata.splice(index, 1);
          this.onValueChange();
        }
      });

    });
  }

}
