import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { CommonService } from '../../common.service';

@Component({
  selector: 'app-contacto',
  templateUrl: './contacto.component.html',
  styleUrls: ['./contacto.component.css']
})
export class ContactoComponent implements OnInit {
  rForm: FormGroup
  message: String
  alerta: String
  constructor(
    private fb: FormBuilder,
    private commonService: CommonService,
  ) {
    this.rForm = fb.group({
      'name': ['', Validators.required],
      'email': ['', Validators.email],
      'message': ['', Validators.required],
    });
    this.rForm.valueChanges.subscribe(data => {
      if (data.name != null || data.email != null || data.message != null) 
        this.message = ""
    })
  }

  ngOnInit() {
  }

  enviar() {
    let params = {
      name: this.rForm.controls['name'].value,
      email: this.rForm.controls['email'].value,
      message: this.rForm.controls['message'].value
    };
    this.commonService.contactEmail(params).subscribe(res => { 
      if (res['success'] == false) {
        this.alerta = "alert alert-danger"
        this.rForm.reset();
        this.message = "Se ha producido un error al enviar el correo."
      } else {
        this.alerta = "alert alert-info"
        this.rForm.reset();
        this.message = "Mensaje enviado"
      }
    });
  }
}
