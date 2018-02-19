import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ExpService } from './../../experiencias/exp.service';

@Component({
  selector: 'app-especialidades-add',
  templateUrl: './especialidades-add.component.html',
  styleUrls: ['./especialidades-add.component.css']
})

export class EspecialidadesAddComponent implements OnInit {
  @Output() 
  added: EventEmitter<Boolean> = new EventEmitter<Boolean>()

  myForm: FormGroup

  newEspec: any
  ambitos: any
  message: String

  constructor(
    private _expService: ExpService,
    private _fb: FormBuilder
  ) {
    _expService.getAmbitos().subscribe((ambitosList) => {
      this.ambitos = ambitosList
    })
    this.myForm = _fb.group({
      'nombre': ['', Validators.required],
      'ambito': [null, Validators.required],
    });

  }

  ngOnInit() {
  }

  add() {
    console.log("salvando ...")
    this.newEspec = this.myForm.value
    if (this.newEspec.ambito == null || this.newEspec.nombre == "") 
      return
    this._expService.addEspecialidad(this.newEspec).subscribe((res) => {
      let result = false
      if (res['success'] == true) { 
        console.log("Grabado correctamente")
        result = true
      } else {
        console.log("Mensaje de error: ", res['message'])
        this.message = res['message']
        result = false
      }
      this.added.emit(result)
    })
  }

  cancel() {
    this.added.emit(false)
  }

}
