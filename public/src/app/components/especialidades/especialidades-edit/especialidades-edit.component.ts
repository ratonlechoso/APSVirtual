import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ExpService } from './../../experiencias/exp.service';


@Component({
  selector: 'app-especialidades-edit',
  templateUrl: './especialidades-edit.component.html',
  styleUrls: ['./especialidades-edit.component.css']
})
export class EspecialidadesEditComponent implements OnInit {
  @Input() especialidad: any; 
  @Output() 
  updated: EventEmitter<any> = new EventEmitter<any>();

  updateEspecAmbito //Selected value para el select
  myForm: FormGroup

  editEspec: any
  ambitos: any
  message: String


  constructor (
   private _expService: ExpService,
    private _fb: FormBuilder
) {
  _expService.getAmbitos().subscribe((ambitosList) => {
    this.ambitos = ambitosList
    this.ambitos.forEach(element => {
      if (element.nombre == this.especialidad.ambito_nombre)
        this.updateEspecAmbito = element
    })

  })

  this.myForm = _fb.group({
    'nombre': ['', Validators.required],
    'ambito': [null, Validators.required],
  });
 }

  ngOnInit() {
    this.editEspec = <any>JSON.parse(JSON.stringify(this.especialidad))
  }
  edit () {
    this.editEspec.ambito_id = this.myForm.controls.ambito.value.id
    this.editEspec.ambito_nombre = this.myForm.controls.ambito.value.nombre
    if (this.editEspec.ambito_id == null || this.editEspec.nombre == "") 
      return
    this._expService.updateEspecialidad(this.editEspec).subscribe((res) => {
      if (res['success'] == true) { 
        console.log("Grabado correctamente")
        this.especialidad = this.editEspec
        console.log("Emito: ", this.especialidad)
        this.updated.emit(this.especialidad)
      } else {
        console.log("Mensaje de error: ", res['message'])
        this.message = res['message']
        this.updated.emit(this.especialidad)
      }
    })
  }

  cancel () {
    console.log("pasa1")
    this.updated.emit(false)
  }

}
