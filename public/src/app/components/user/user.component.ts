import { Component, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from './../../auth.service';
import { UserService } from './../user/user.service';
import { Router } from '@angular/router';
import { Subscription }   from 'rxjs/Subscription';
import { User } from './../user/user';
import * as moment from 'moment';


@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  userRegistered: boolean = false  //quitar
  user: User = new User();
  message: String;
  navStatus: String;
  subscriptionToVerify: Subscription;
  subscriptionToGetUser: Subscription;
  ahora:moment.Moment;
  ahoraFormatted: string;
  constructor(
    private authService: AuthService,
    private router: Router,
    private _userService: UserService,
  //  private globalEventsManager: GlobalEventsManager //quitar
  ) {
    this.ahora = moment();
    console.log("hora", this.ahora.format('MMMM Do YYYY, h:mm:ss a'))
    this.ahoraFormatted = this.ahora.format('MMMM Do YYYY, h:mm:ss a');

    authService.user$.subscribe( (user) => {
      console.log("disparado escucha de setUser. Email: ", user.email)
      this.user = user;
      this.message = "cargando user en navbar"
     });
  }

  ngOnInit() {
        //Verificación de usuario
        this.subscriptionToVerify = this.authService.verify().subscribe( (res) => {

          if (res['success'] == false) {
            this.user = null
            this.changeRoute('home')
          }
          this.message = res['message']
          //VERIFICADO... Cargo usuario
          let currUser = JSON.parse(localStorage.getItem('currentUser'));
          let id = ( currUser && 'id' in currUser) ? currUser.id : "";
          console.log("ID es", id)
          if (id != "") {
            this.subscriptionToGetUser =  this._userService.getUser(id).subscribe( (res) => {
              if (res['success'] == false) {
                this.user = null
                this.changeRoute('home')
              }
           this.user = res['user'];
           console.log("el segundo apellido es ", this.user.last_name)
            })
          }
        });
  }

  changeRoute(routeValue) {
    console.log("cambiando de ruta...")
//    this._LoaderService.show(); 
    //this will start the loader service.
     this.router.navigate([routeValue]); 
    // you have to check this out by passing required route value.
    // this line will redirect you to your destination. By reaching to destination you can close your loader service.
    // please note this implementation may vary according to your routing code.
 }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscriptionToVerify.unsubscribe();
    this.subscriptionToGetUser.unsubscribe();
  }

}
