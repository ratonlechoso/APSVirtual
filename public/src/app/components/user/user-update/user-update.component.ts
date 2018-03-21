import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { User } from '../user';
import { Router } from '@angular/router';
import { AuthService } from './../../../auth.service';
import { UserService } from '../user.service';
import { Subscription } from 'rxjs/Subscription';
import { matchOtherValidator } from './../../tools/match-other-validator';

@Component({
  selector: 'app-user-update',
  templateUrl: './user-update.component.html',
  styleUrls: ['./user-update.component.css']
})

export class UserUpdateComponent implements OnInit, OnDestroy {
  //permite crear un evento de usuario
  //@Output() createNewUserEvent = new EventEmitter(); //quitar

  rForm: FormGroup
  subscriptionToGetRoles: Subscription
  updateUser: User
  user: User
  roles
  updateUserRol
  idUser 
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
    _userService.getRoles().subscribe((rolesList) => {
      this.roles = rolesList
      this.roles.forEach(element => {
        if (element.nombre == this.updateUser.roles) 
          this.updateUserRol = element
      })

    })

    this.updateUser = new User();
    this.rForm = fb.group({
      'first_name': ['', Validators.required],
      'last_name': ['', Validators.required],
      'email': ['', Validators.email],
      'rol': ['', Validators.required],
      'password': ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
      'confirm-password': ['', Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15), matchOtherValidator('password')])],
    });

    
    this.rForm.valueChanges.subscribe(data => {
      this.message = ""
    })

    console.log("constructor de view-profile")
    this.user = this.authService.getLocalUser();
    this.idUser = this.user.id
    console.log("user en update", this.user)
    if (authService.user != null) {
      //IMPORTANTE: COMO LO VOY A EDITAR HAY QUE DUPLICAR (COPIAR) EL OBJETO USUARIO. NO VALE CON ASIGNARLO PORQUE SE TRATARIA DEL MISMO OBJETO
      this.updateUser = <User>JSON.parse(JSON.stringify(this.user))
      console.log("updateUser->roles", this.updateUser.roles)
      this.updateUser.password = ""
      // this.updateUser.first_name = this.authService.user.first_name;
      // this.updateUser.last_name = this.authService.user.first_name;
    } else
      console.log("user-view-profile: Error. No se ha cargado el usuario")

    // this.subscriptionToUser = authService.user$.subscribe( (user) => {
    //   console.log("pasa")
    //   this.updateUser = user
    // })
  }

  ngOnInit() {
    this.advert1 = "Email incorrecto."
    this.advert2 = "La contraseña debe tener entre 6 y 15 caracteres."
    this.advert3 = "Campo obligatorio"
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    if (this.subscriptionToGetRoles)
      this.subscriptionToGetRoles.unsubscribe();
  }

  update() {
    let rol = this.rForm.controls['rol'].value
    console.log("userID: ", this.idUser)

    this.updateUser.roles = rol.id
    this.updateUser.rol_id = rol.id
    this._userService.update(this.updateUser).subscribe((res) => {
      if (res['success'] == true) {
        console.log("actualizado: ", JSON.stringify(res['user']))
        res['user'].roles = rol.nombre
        this.authService.setUser(res['user']);

        this._location.back(); 
      } else {
        this.message = res['message'];
      }
    })
  }

  goback() {
    this._location.back();
  }

  isFieldValid(field: string) {
    return !this.rForm.get(field).valid && this.rForm.get(field).touched;
  }

}
