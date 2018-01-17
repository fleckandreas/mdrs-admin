import { Component, OnInit,Inject,ViewChild } from '@angular/core';
import {MatDialog, MAT_DIALOG_DATA,MatDialogRef,MatSelectionList} from '@angular/material';

@Component({
  selector: 'app-dialog-list-select',
  templateUrl: './dialog-list-select.component.html',
  styleUrls: ['./dialog-list-select.component.css']
})
export class DialogListSelectComponent implements OnInit {
  @ViewChild('list')list:MatSelectionList;
  constructor(public dialogRef: MatDialogRef<DialogListSelectComponent>,@Inject(MAT_DIALOG_DATA) public data: any) {}

  filteredList;
  ngOnInit() {
    this.filteredList=[];
  }
  closeDialog() {
    this.dialogRef.close((this.data.List));
  }

}
