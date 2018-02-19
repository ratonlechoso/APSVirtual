import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ExpService } from './../../experiencias/exp.service';

@Component({
  selector: 'app-universidades-add',
  templateUrl: './universidades-add.component.html',
  styleUrls: ['./universidades-add.component.css']
})
export class UniversidadesAddComponent implements OnInit {
  @Output() 
  added: EventEmitter<Boolean> = new EventEmitter<Boolean>()

  myForm: FormGroup

  newUniv: any
  message: String

  constructor(
    private _expService: ExpService,
    private _fb: FormBuilder
  ) { 
    this.myForm = _fb.group({
      'nombre': ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  add() {
    console.log("salvando ...")
    this.newUniv = this.myForm.value
    if (this.newUniv.nombre == "") 
      return
    this._expService.addUniversidad(this.newUniv).subscribe((res) => {
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
