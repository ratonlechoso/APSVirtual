import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ExpService } from './../../experiencias/exp.service';


@Component({
  selector: 'app-biblio-recursos-externos-add',
  templateUrl: './biblio-recursos-externos-add.component.html',
  styleUrls: ['./biblio-recursos-externos-add.component.css']
})
export class BiblioRecursosExternosAddComponent implements OnInit {
  @Output()
  added: EventEmitter<Boolean> = new EventEmitter<Boolean>()

  myForm: FormGroup

  newBib: any
  message: String

  constructor(
    private _expService: ExpService,
    private _fb: FormBuilder
  ) {
    this.myForm = _fb.group({
      'titulo': ['', Validators.required],
      'descripcion': ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  add() {
    console.log("salvando ...")
    this.newBib = this.myForm.value
    if (this.newBib.titulo == "" || this.newBib.decripcion == "") 
      return
    this._expService.addBibliografiaExt(this.newBib).subscribe((res) => {
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
