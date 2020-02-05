import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
    providedIn: 'root'
})
export class ToDoService{
    constructor(private http: HttpClient){}

    addToList(title: string){
        return this.http.post('https://to-do-list-7a49f.firebaseio.com/listData.json', title);
    }

    viewList(){
        return this.http.get('https://to-do-list-7a49f.firebaseio.com/listData.json');
    }

    updateList(newData){
        return this.http.put('https://to-do-list-7a49f.firebaseio.com/listData.json', newData);
    }
}