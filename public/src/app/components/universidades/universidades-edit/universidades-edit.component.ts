import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ExpService } from './../../experiencias/exp.service';


@Component({
  selector: 'app-universidades-edit',
  templateUrl: './universidades-edit.component.html',
  styleUrls: ['./universidades-edit.component.css']
})
export class UniversidadesEditComponent implements OnInit {
  @Input() universidad: any; 
  @Output() 
  updated: EventEmitter<any> = new EventEmitter<any>();

  myForm: FormGroup

  editUniv: any
  message: String

  constructor(
    private _expService: ExpService,
    private _fb: FormBuilder
  ) { 
    this.myForm = _fb.group({
      'nombre': ['', Validators.required],
      'ambito': [null, Validators.required],
    });
  
  }

  ngOnInit() {
    this.editUniv = <any>JSON.parse(JSON.stringify(this.universidad))
  }
  edit () {
    if (this.editUniv.nombre == "") 
      return
    this._expService.updateUniversidad(this.editUniv).subscribe((res) => {
      if (res['success'] == true) { 
        console.log("Grabado correctamente")
        this.universidad = this.editUniv
        console.log("Emito: ", this.universidad)
      } else {
        console.log("Mensaje de error: ", res['message'])
        this.message = res['message']
      }
      this.updated.emit(this.universidad)
    })
  }

  cancel () {
    console.log("pasa1")
    this.updated.emit(false)
  }


}
