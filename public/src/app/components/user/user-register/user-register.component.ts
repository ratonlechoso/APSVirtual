import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
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

  ngOnDestroy() {
    this.subscriptionToVerify.unsubscribe();
  }

  registerUser(user) {
    let rol = this.rForm.controls['rol'].value

    let rolNombre = rol.nombre
    user.roles = rol.id


    //Llamada al servicio
    this.authService.registerUser(user).subscribe( (res) => {
      if( res['success'] == true ) {
        res['user'].roles = rol.nombre
        this.authService.setUser(res['user']);
        this.router.navigate(['']);
      } else {
        this.message = res['message'];
      }
    })
  }
}
 