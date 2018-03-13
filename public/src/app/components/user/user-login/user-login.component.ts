import { Component, OnInit, Output, OnDestroy, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../user';
import { AuthService } from '../../../auth.service';
import { Subscription } from 'rxjs/Subscription';


@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.css']
})

export class UserLoginComponent implements OnInit, OnDestroy {
  //@Output() loginUserEvent = new EventEmitter(); //quitar
  rForm: FormGroup;
  subscriptionToVerify: Subscription;

  loginUser: User;
  message: String;
  user_status: boolean;
  advert1: string
  advert2: string;
  email: string;
  password: string;
  alerta: string;

  constructor(
    private authService: AuthService,
    private router: Router,
    private _location: Location,
    private fb: FormBuilder
  ) {
    this.loginUser = new User();
    this.rForm = fb.group({
      'email': ['', Validators.email],
      'password': [null, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
    });
    this.rForm.valueChanges.subscribe(data => {
      this.message = ""
    })
  }

  ngOnInit() {
    this.advert1 = "Formato de email incorrecto."
    this.advert2 = "La contraseña debe tener entre 6 y 15 caracteres."
    this.subscriptionToVerify = this.authService.verify().subscribe((res) => {
      if (res['success'] == true) {
        console.log("Ya estás logeado. Redireccionando a home...")
        this.router.navigate(['home']);
      }
    })
  }

  ngOnDestroy() {
    // prevent memory leak when component destroyed
    this.subscriptionToVerify.unsubscribe();
  }


  login(user) {
    this.loginUser.email = this.rForm.controls['email'].value
    this.loginUser.password = this.rForm.controls['password'].value

    this.authService.loginUser(user).subscribe(res => {
      this.user_status = res['success'];
      console.log("res: ", res)
      if (res['success'] == true) {
        console.log("Pendientes: ", res['pendientes'])
        if (res['pendientes'].success == true && res['user'].pendiente == 0 && res['user'].bloqueado == 0) {//Se logea el admin y tiene usuarios pendientes de aprobar
          console.log("pendientes: ", res['pendientes'])
          alert("Hay usuarios pendientes de aprobar. Consular en la seccion de gestión de usuarios")
        }
        this.authService.setUser(res['user']);
        this.router.navigate(['home']);
      } else {
        this.alerta = "alert alert-danger";
        this.message = res['message'];
      }
    });
  }

  goback() {
    this._location.back();
  }

  forgotPwd(user) {
    this.loginUser.email = this.rForm.controls['email'].value
    let emailValido = this.rForm.controls['email'].valid
    if (!emailValido) {
      this.rForm.reset();
      this.alerta = "alert alert-info";
      this.message = "Por favor, introduzca su email. Le enviaremos un enlace para cambiar su contraseña"
      return;
    }
    this.authService.forgotPwd(user).subscribe(res => {
      this.user_status = res['success'];
      if (res['success'] == true) {
        this.alerta = "alert alert-info"
        this.message = "en un minuto te llegará un email con un enlace, haz click para cambiar tu contraseña. Los emails pueden llegar a la bandeja de spam"
        this.authService.setUser(res['user']);

        //        this.router.navigate(['reset-pass']);
      } else {
        this.message = res['message'];
      }
    });
  }

}
