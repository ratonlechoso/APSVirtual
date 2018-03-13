import { Component, OnInit, ViewChild } from '@angular/core';
import { UserService } from './../user.service';
import { AuthService } from './../../../auth.service';
import { BsModalComponent, BsModalService } from 'ng2-bs3-modal';
import { User } from './../user'

@Component({
  selector: 'app-users-manager',
  templateUrl: './users-manager.component.html',
  styleUrls: ['./users-manager.component.css']
})
export class UsersManagerComponent implements OnInit {
  @ViewChild('modal')
  modalUpdateFlags: BsModalComponent;

  p: number = 1;
  page: number
  itemsPerPage: number = 25
  postsPerPage: number[] = [25, 50, 100]

  users: any 
  user: any //Current user
  userToModify: any
  textoModal: String

  addMode: boolean
  query: string

  constructor(
    private _userService: UserService,
    private _authService: AuthService
  ) {
    this.addMode = false
    console.log("cargar usuarios ...")
    this.query = ""
    this.loadUsers()
  }

  ngOnInit() {
    this.user = this._authService.user;
    this._authService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  loadUsers() {
    this._userService.getUsers().subscribe((usersList) => {
      this.users = usersList['usuarios']
    })
  }

  bloquear(user) {
    if (this.user.email == user.email) {
      alert("Operación no permitida")
      return
    }
    user.password = ""
    this.userToModify = <User>JSON.parse(JSON.stringify(user))
    console.log("usertomodify: ", this.userToModify)
    this.userToModify.bloqueado = !this.userToModify.bloqueado;
    ((user.bloqueado) ? this.textoModal = "Desbloquear usuario?": this.textoModal = "¿Bloquear usuario?" )
    this.modalUpdateFlags.open()
  }

  activar(user) {
    if (this.user.email == user.email) {
      alert("Operación no permitida")
      return
    }
    user.password = ""
    this.userToModify = <User>JSON.parse(JSON.stringify(user))
    this.userToModify.pendiente = !this.userToModify.pendiente
    this.textoModal = "¿Activar usuario?"+
    this.modalUpdateFlags.open()
  }

  modalUpdateFlagsDismissed() {
    console.log("Modal cerrado sin acción")
  }
  modalUpdateFlagsOpened() {
    /**No hacer nada*/
  }
  modalUpdateFlagsClosed() {

    this._userService.update(this.userToModify).subscribe((res) => {
      if (res['success'] == true) {
        this.userToModify.bloqueado = res['user'].bloqueado
        this.users.forEach(element => {
          if (element.id == res['user'].id) {
            element.bloqueado = res['user'].bloqueado
            if (element.pendiente != res['user'].pendiente) {
              this._userService.notificarActivacion(this.userToModify).subscribe((res) => {
                element.pendiente = !element.pendiente
                alert("Usuario activado. Se ha enviado una notificación a su dirección de email")
              })
            }
          }
        });
      }
  })
}
}
