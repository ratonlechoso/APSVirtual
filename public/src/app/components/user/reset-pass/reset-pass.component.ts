import { Router, ActivatedRoute, Params} from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { User } from '../user';
import { AuthService} from './../../../auth.service';
import { matchOtherValidator } from './../../tools/match-other-validator';


@Component({
  selector: 'app-reset-pass',
  templateUrl: './reset-pass.component.html',
  styleUrls: ['./reset-pass.component.css']
})
export class ResetPassComponent implements OnInit {
  rForm: FormGroup
  post:any                     // A property for our submitted form
  oldPassword:string =''
  newPassword:string = ''
  confirmPassword:string = ''
  user = new User
  titleAlert: string
  advert1: string
  token: string
  message: string = ''

  constructor(
    private fb: FormBuilder,
    private authService: AuthService, 
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) { 
    
    this.rForm = fb.group({
      'newPassword' : [null, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15)])],
      'confirmPassword' : [null, Validators.compose([Validators.required, Validators.minLength(6), Validators.maxLength(15), matchOtherValidator('newPassword') ])],
      'validate' : ''
    })
    this.rForm.valueChanges.subscribe(data => {
      this.message = ""
    })

  }

  ngOnInit() {
    this.advert1= "La contraseña debe tener entre 6 y 15 caracteres."
    this.rForm.get('validate').valueChanges.subscribe(
      (validate) => {

          if (validate == '1') {
              this.rForm.get('name').setValidators([Validators.required, Validators.minLength(3)]);
              this.titleAlert = 'You need to specify at least 3 characters';
          } else {
              this.rForm.get('name').setValidators(Validators.required);
          }
          this.rForm.get('name').updateValueAndValidity();
    });
    // subscribe to router event
    this.token = this.activatedRoute.snapshot.queryParams["token"];
    this.activatedRoute.params.subscribe((params: Params) => {
        let token = params['token'];
        console.log(token);
    });
  }            
  

  resetPass(user) {
    //Llamada al servicio
    this.user.password =   this.rForm.controls['newPassword'].value
    console.log(this.token)
    console.log(JSON.stringify(this.user))
    this.authService.resetPwd(this.token, this.user).subscribe( (res) => {
      console.log("modificando contraseña ...")
      if( res['success'] == true ) {
        console.log("contraseña modificada")
        this.router.navigate(['/login']);
      } else {
        this.message = res['message'];
      }
    })
  }

}
