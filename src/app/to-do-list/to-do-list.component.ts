import { Component, OnInit } from '@angular/core';
import { ToDoService } from './to-do.service';
import { NgForm } from '@angular/forms';
import {map} from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';
import { retry, catchError } from 'rxjs/operators';
import { Title } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog/confirmation-dialog.component';
import { error } from 'protractor';

@Component({
  selector: 'app-to-do-list',
  templateUrl: './to-do-list.component.html',
  styleUrls: ['./to-do-list.component.css']
})
export class ToDoListComponent implements OnInit {
  listTitles:string[] = [];
  isLoading = false;
  error:any;
  constructor(private todo: ToDoService, public dialog: MatDialog) { }

  ngOnInit() {
    this.viewList();
  }
  
  addList(title:NgForm){
    this.todo.addToList(title.value).pipe(retry(1),catchError(this.handleError)).subscribe(_=>{
      this.viewList()
    },error=>{
      this.error = error
    });
    title.reset();
  }

  viewList(){
    this.isLoading = true;
    this.todo.viewList().pipe(map(respData=>{
      let listVal = [];
      for(let key in respData){
        if(respData.hasOwnProperty(key)){
          listVal.push(respData[key]);
        }
      }
      return listVal;
    }
    ),catchError(this.handleError)
    ).subscribe((data)=>{
      this.isLoading=false;
      this.listTitles = data;
    },error=>{
      this.error = error;
    });
  }

  delList(index){
    const dialogRef = this.dialog.open(ConfirmationDialogComponent,{
      width: '350px',
      data: "Do you want to delete this ToDolist?"
    });
    dialogRef.afterClosed().subscribe(result=>{
      if(result){
        this.listTitles.splice(index,1);
        let updatedList = this.listTitles;
        this.todo.updateList(updatedList).pipe(retry(1),catchError(this.handleError)).subscribe(resp=>{},error=>{
          this.error = error;
        });
      }
    })
  }

  handleError(error) {
    let errorMessage = '';
    if (error.error instanceof ErrorEvent) {
        // client-side error
        errorMessage = error.error.message;
    } else {
        // server-side error
        errorMessage = error.message;
    }
    console.log(errorMessage);
    return throwError(errorMessage);
  }
}
