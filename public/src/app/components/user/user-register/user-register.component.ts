import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../user';
import { Router } from '@angular/router';
import { AuthService} from './../../../auth.service';
import { UserService } from '../user.service';
import { Subscription }   from 'rxjs/Subscription';
import { matchOtherValidator } from './../../tools/match-other-validator';

@Component({
  selector: 'app-user-register',
  templateUrl: './user-register.component.html',
  styleUrls: ['./user-register.component.css']
})

export class UserRegisterComponent implements OnInit, OnDestroy {
  //permite crear un evento de usuario
  //@Output() createNewUserEvent = new EventEmitter(); //quitar
  rForm: FormGroup
  subscriptionToVerify: Subscription
  roles
  newUser: User
  confirmPassword: string
  message: string = ''
  advert1: string
  advert2: string
  advert3: string
  
  constructor(
    private authService: AuthService, 
    private _userService: UserService,
    private router: Router,
    private _location: Location,
    private fb: FormBuilder
  ) {
    this.newUser = new User();

    _userService.getRoles().subscribe((rolesList) => {
      this.roles = rolesList
    })


    this.rForm = fb.group({
      'first_name' : ['', Validators.required],
      'last_name' : ['', Validators.required],
      'email' : ['', Validators.email],
      'rol': ['', Validators.required],
      'password' : ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
      'confirm-password' : ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15), matchOtherValidator('password') ])],
    });
    this.rForm.valueChanges.subscribe(data => {
      this.message = ""
    })
  }

  ngOnInit() {
    this.advert1= "Email incorrecto."
    this.advert2= "La contraseña debe tener entre 6 y 15 caracteres."
    this.advert3= "Campo obligatorio."
    this.subscriptionToVerify = this.authService.verify().subscribe( (res) => {
      if (res['success'] == true) {
        console.log("Ya estás logeado. Redireccionando a home...")
        this.router.navigate(['home']);
      }
    })
  }

  goback() {
    this._location.back();
  }

  ngOnDestroy() {
    this.subscriptionToVerify.unsubscribe();
  }

  registerUser(user) {
    let rol = this.rForm.controls['rol'].value
    let rolNombre = rol.nombre
    user.roles = rol.id
    user.pendiente = 0
    if (user.roles > 2) {
      this.message = "Se enviará una petición al administrador para que valide su alta en el sistema. Cuando esto suceda recibirá una notificación en su dirección de corréo electrónico: "+ user.email
      user.pendiente = 1
    }


//    Llamada al servicio
    this.authService.registerUser(user).subscribe( (res) => {
      if( res['success'] == true ) {
        res['user'].roles = rol.nombre
        res['user'].rol_id = rol.id
        this.authService.setUser(res['user']);
        alert("Bienvenido " + user.first_name  + " " + user.last_name + ". Se ha registrado satisfactoriamente en la aplicación con el rol de '"+ rolNombre + "'. A continuación se le redigirá a la página principal")
        this.router.navigate(['home']);
      } else {
        this.message = res['message'];
      }
    })
  }
}
 