import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { User } from '../user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css']
})
export class UserListComponent implements OnInit {
  @Input() users;
  @Output() destroyUserEvent = new EventEmitter();
  @Output() actualizarUserEvent = new EventEmitter();
  constructor() { }

  ngOnInit() {
  }

  destroy(user: User){
    const response = confirm('delete?')
    if(response) {
      this.destroyUserEvent.emit(user);      
    }
  }

  actualizar(user) {
    console.log("emito user desde actualizar de user-list")
    this.actualizarUserEvent.emit(user);
  }
}
