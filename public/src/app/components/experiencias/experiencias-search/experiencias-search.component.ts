import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Experiencia } from '../experiencia';
import { Router } from '@angular/router';
import { ExpService } from './../exp.service';
import { Subscription } from 'rxjs/Subscription';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { forEach } from '@angular/router/src/utils/collection';

const now = new Date();

@Component({
  selector: 'app-experiencias-search',
  templateUrl: './experiencias-search.component.html',
  styleUrls: ['./experiencias-search.component.css']
})
export class ExperienciasSearchComponent implements OnInit {
  myForm: FormGroup
  subscriptionToVerify: Subscription

  model: NgbDateStruct;


  newExp: Experiencia
  ambitos: any
  especialidades: any
  universidades: any
  filesToUpload: Array<any>

  message: String

  constructor(
    private _expService: ExpService,
    private _router: Router,
    private _location: Location,
    private _fb: FormBuilder
  ) {
    _expService.getAmbitos().subscribe((ambitosList) => {
      this.ambitos = ambitosList
    })

    _expService.getUniversidades().subscribe((universidadesList) => {
      this.universidades = universidadesList
    })
    this.newExp = {} as Experiencia //Esta es la forma correcta de inicializar un objeto basado en una Interface cuando no se requieren valores iniciales.
    this.myForm = _fb.group({
      'nombre': ['', Validators.required],
      'destinatario': ['', Validators.required],
      'descripcion': ['', Validators.required],
      'fecha': ['', Validators.required],
      'ambito': [null, Validators.required],
      'especialidad': ['', Validators.required],
      'universidad': ['', Validators.required],
      //FORMATEAR FECHA A UN SOLO CAMPO
    });

    this.myForm.valueChanges.subscribe(data => {
      const fecha = this.myForm.controls['fecha']
      if (fecha.value != '') {
        this.message = null
        //this.myForm.controls.get['fecha']).setValue("12/12/2001")
        //console.log(fecha.value)  
      }
    })
  }

  ngOnInit() {
  }

  selectToday() {
    this.model = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
  }

  onChangeAmbito(value) {
    let idx = parseInt(value)
    if (idx == 0) return
    this._expService.getEspecialidades(idx).subscribe((especialidadesList) => {
      this.especialidades = especialidadesList
    })
  }

  goback() {
    this._router.navigate(['/experiencias']);
  }

  search(model: Experiencia) {

    let sCriteria = ""
    this.newExp = this.myForm.value

    if (this.newExp.nombre != "") sCriteria += "nombre: " + this.newExp.nombre + "; "

    if (this.newExp.ambito == "0" || this.newExp.ambito == null) this.newExp.ambito = ""
    else sCriteria += "ambito: '" + this.getNombre(this.ambitos, this.newExp.ambito) + "'; "

    if (this.newExp.especialidad == "") this.newExp.especialidad = ""
    else sCriteria += "especialidad: '" + this.getNombre(this.especialidades, this.newExp.especialidad) + "'; "

    if (this.newExp.universidad == "") this.newExp.universidad = ""
    else sCriteria += "universidad: '" + this.getNombre(this.universidades, this.newExp.universidad) + "'; "

    if (this.myForm.controls['fecha'].value != "") {
      let ngbDate = this.myForm.controls['fecha'].value;
      let formatDate = (ngbDate.day + '-' + ngbDate.month + '-' + ngbDate.year)
      sCriteria += "fecha: " + formatDate + "; "
    }
    this._expService.sCriteria = sCriteria

    this._expService.searchExperiencias(this.newExp).subscribe((res) => {
      if (res['success'] == true) {
        this._expService.experiencias = res['exp']
        this._router.navigate(['/experiencias-list'])
      } else {
        console.log(res['message'])
        this.message = res['message']
      }
    })
  }

  getNombre(lista, idx): String {
    for (var key = 0; key < lista.length; key++)
      if ((lista[key].id) == idx) 
        return lista[key].nombre
    return ""
  }

}
