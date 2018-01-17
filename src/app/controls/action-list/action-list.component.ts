import { Component, OnInit,Input,Output,OnChanges,SimpleChanges } from '@angular/core';
import {DataConnectorService} from '../../service/data-connector.service';
import {Observable,BehaviorSubject,} from 'rxjs/Rx';
 @Component({
  selector: 'app-action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.css']
})
export class ActionListComponent implements OnInit,OnChanges {
  @Input() rawData:Array<any>;
  @Input() sortOptions=[{Key:"Label",Label:"Name"}];
  @Input() filteredData=[];//BehaviorSubject<any[]> 
  private filter=[];
  public direction="asc";
  public selectedOption="";

  constructor(private dataConnectorService:DataConnectorService) { }

  ngOnInit() {
  }
  ngOnChanges(change:SimpleChanges){
    if(change.rawData){

      console.log("change raw")
      this.filterList("");
      this.sort();
    }
    if(change.dataFn){
      this.filterList("");
      this.sort();
    }
    if(change.sortOptions){
      if(change.sortOptions.currentValue && change.sortOptions.currentValue.length>0){
        this.selectedOption = change.sortOptions.currentValue[0].Key;
      }      
    }
  }
  public sort(){
      let tmp=this.filteredData.slice();
      this.sortList(tmp);
      this.filteredData.length=0;
      tmp.forEach(e=>{this.filteredData.push(e)});
  }
  private sortList(list:Array<any>){
    if(this.selectedOption && this.selectedOption!=""){
      return list.sort((a,b)=>{
        return this.dataConnectorService.sort({direction:this.direction})(a[this.selectedOption] ,b[this.selectedOption])      
    });
    }else{
      return list.sort((a,b)=>{
        return this.dataConnectorService.sort({direction:this.direction})(a.Label ,b.Label)      
    });
    }
    
  
  }
   filterList(val){
    this.filteredData.length=0;
    let tmp=[]
    if (val==""){
        tmp = this.rawData.slice() ;
    }else{
      let searchstr = val.toLowerCase();
      tmp = this.rawData.filter(p=>{

        let str = p.searchText ? p.searchText :p.Label.toLowerCase();
        /*console.log(p);
        console.log(str)*/
        return str.search(searchstr)>-1;
      })
      
    }
    this.sortList(tmp);   
    setTimeout(() => {
      tmp.forEach(e=>{this.filteredData.push(e)});
    }, 0);
    
    //console.log(this.filter)
    //this.filteredData.next(this.filter);
  }
  
}
