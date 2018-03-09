import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { AuthService } from './../../auth.service';
import { UserService } from './../user/user.service';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { User } from './../user/user';
import * as moment from 'moment';
import { BsModalComponent, BsModalService } from 'ng2-bs3-modal';

//import {GlobalEventsManager} from "../../GlobalEventsManager";

@Component({
  selector: 'app-menu-bar',
  templateUrl: './menu-bar.component.html',
  styleUrls: ['./menu-bar.component.css']
})
export class MenuBarComponent implements OnInit, OnDestroy {
  @ViewChild('modal')
  modal: BsModalComponent;

  userRegistered: boolean = false  //quitar
  user: User = new User()
  message: String
  navStatus: String
  subscriptionToVerify: Subscription
  subscriptionToGetUser: Subscription
  ahora: moment.Moment
  ahoraFormatted: string
  constructor(
    private authService: AuthService,
    private router: Router,
    private _userService: UserService
    //  private globalEventsManager: GlobalEventsManager //quitar
  ) {
    authService.user$.subscribe((user) => {
      if (user)
        console.log("disparado escucha de setUser. Email: ", user.email)
      this.user = user
      this.message = "cargando user en navbar"
    });
  }

  ngOnInit() {
    //Verificación de usuario
    this.subscriptionToVerify = this.authService.verify().subscribe((res) => {
      //HAY QUE RECIBIR EL STATUS EN RES PARA DECIDIR QUE TIPO DE MENU SE MUESTRA
      if (res['success'] == false) {
        this.user = null
        //this.authService.setUser(this.user)
        return
      }
      this.message = res['message']
      //VERIFICADO... Cargo usuario
      let currUser = JSON.parse(localStorage.getItem('currentUser'))
      let id = (currUser && 'id' in currUser) ? currUser.id : ""
      if (id != "") {
        this.subscriptionToGetUser = this._userService.getUser(id).subscribe((res) => {
          if (res['success'] == false) {
            this.user = null
            localStorage.removeItem('currentUser');
            this.authService.setUser(this.user)
            return
          }
          console.log("idUser: ", res['user'].id)
          this.authService.setUser(res['user'])
          this.user = res['user']
        })
      }
    });
  }

  changeRoute(routeValue) {
    //    this._LoaderService.show(); 
    //this will start the loader service.
    this.router.navigate([routeValue]);
    // you have to check this out by passing required route value.
    // this line will redirect you to your destination. By reaching to destination you can close your loader service.
    // please note this implementation may vary according to your routing code.
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    if (this.subscriptionToVerify != null)
      this.subscriptionToVerify.unsubscribe();
    if (this.subscriptionToGetUser != null)
      this.subscriptionToGetUser.unsubscribe();
  }

  modalDismissed() {
    console.log("Modal cerrado sin acción")
  }
  modalOpened() {
    /**No hacer nada*/
  }
  modalClosed() {
    console.log("LoginOut")
    this.logout();
  }

  logout() {
    this.authService.logout();
    this.user = null;
    this.router.navigate(['/home']);
  }
}


