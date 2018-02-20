import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { ExpService } from './../../experiencias/exp.service';


@Component({
  selector: 'app-biblio-recursos-externos-edit',
  templateUrl: './biblio-recursos-externos-edit.component.html',
  styleUrls: ['./biblio-recursos-externos-edit.component.css']
})
export class BiblioRecursosExternosEditComponent implements OnInit {
  @Input() bibliografia: any;
  @Output()
  updated: EventEmitter<any> = new EventEmitter<any>();

  myForm: FormGroup

  editBib: any
  message: String


  constructor(
    private _expService: ExpService,
    private _fb: FormBuilder
  ) {
    this.myForm = _fb.group({
      'titulo': ['', Validators.required],
      'descripcion': ['', Validators.required],
    });
  }

  ngOnInit() {
    this.editBib = <any>JSON.parse(JSON.stringify(this.bibliografia))
  }

  edit () {
    if (this.editBib.titulo == "") 
      return
    this._expService.updateBibliografiaExt(this.editBib).subscribe((res) => {
      if (res['success'] == true) { 
        console.log("Grabado correctamente")
        this.bibliografia = this.editBib
        console.log("Emito: ", this.bibliografia)
      } else {
        console.log("Mensaje de error: ", res['message'])
        this.message = res['message']
      }
      this.updated.emit(this.bibliografia)
    })
  }

  cancel () {
    this.updated.emit(false)
  }



}
