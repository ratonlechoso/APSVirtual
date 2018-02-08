import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { User } from '../user';

@Component({
  selector: 'app-user-edit',
  templateUrl: './user-edit.component.html',
  styleUrls: ['./user-edit.component.css']
})
export class UserEditComponent implements OnInit {
  @Input() user: User; 
  editUser: User = new User;
  @Output() updateUserEvent = new EventEmitter();
  constructor() { }

  ngOnInit() {
      Object.assign(this.editUser, this.user);
      // assign hace lo mismo que el código de abajo
      this.editUser.id = this.user.id
      this.editUser.editable = this.user.editable
      this.editUser.email = this.user.email
      this.editUser.first_name = this.user.first_name
      this.editUser.last_name = this.user.last_name
  }

  editar() {
    this.editUser.editable = false;
    console.log("emito user desde actualizar de user-edit")
    this.updateUserEvent.emit(this.editUser);    
  }
  
}
