import { Injectable } from '@angular/core';
import {MatSnackBar} from '@angular/material';
@Injectable()
export class LogService {

  constructor(public snackBar: MatSnackBar) {
    console.log("initialize LogService");
   }
  public log(message:any){
    console.log(message)
  }
  public inform(message:string){
    this.snackBar.open(message,null,{duration:2000})
  }
}
