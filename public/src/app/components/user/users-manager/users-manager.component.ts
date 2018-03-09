import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from './../user.service';
import { BsModalComponent, BsModalService } from 'ng2-bs3-modal';
import { User } from './../user'

@Component({
  selector: 'app-users-manager',
  templateUrl: './users-manager.component.html',
  styleUrls: ['./users-manager.component.css']
})
export class UsersManagerComponent implements OnInit {
  @ViewChild('modal')
  modalDelete: BsModalComponent;

  p: number = 1;
  page: number
  itemsPerPage: number = 25
  postsPerPage: number[] = [25, 50, 100]

  users: any
  user: any

  addMode: boolean
  sortingField: string
  ascending: boolean
  nombreAsc: boolean
  nombreDesc: boolean
  query:string

  constructor(
    private _userService: UserService
  ) {     
    this.addMode = false
    console.log("cargar usuarios ...")
    this.sortingField="nombre"
    this.ascending = true
    this.nombreAsc = true
    this.query=""
    this.loadUsers()
  }

  ngOnInit() {
  }

  loadUsers() {
    this._userService.getUsers().subscribe((usersList) => {
      this.users = usersList['usuarios']
    })
  }

  bloquear(user) {
    alert("en desarrollo...")
  }

  activar(user) {
    alert("en desarrollo...")
  }


}
