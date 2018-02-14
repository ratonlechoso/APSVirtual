import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { Experiencia } from '../experiencia';
import { Router } from '@angular/router';
import { AuthService } from './../../../auth.service';
import { ExpService } from '../exp.service';
import { Subscription } from 'rxjs/Subscription';
import { matchOtherValidator } from './../../tools/match-other-validator';

import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

const now = new Date();

@Component({
  selector: 'app-experiencias-update',
  templateUrl: './experiencias-update.component.html',
  styleUrls: ['./experiencias-update.component.css']
})
export class ExperienciasUpdateComponent implements OnInit {
  @Input() exp: Experiencia;

  myForm: FormGroup
  subscriptionToVerify: Subscription

  model: NgbDateStruct;

  rForm: FormGroup
  subscriptionToGetRoles: Subscription
  updateExp: Experiencia
  roles
  ambitos
  especialidades
  universidades
  updateExpAmbito //Selected value para el select
  updateExpEspecialidad //Selected value para el select
  updateExpUniversidad //Selected value para el select
  filesToUpload: Array<File>
  idExp
  message: string = ''
  advert1: string
  advert2: string
  advert3: string


  /*CONSTRUCTOR*/
  constructor(
    private authService: AuthService,
    private _expService: ExpService,
    private router: Router,
    private _location: Location,
    private _fb: FormBuilder

  ) {

    //this.updateExp = {} as Experiencia //Esta es la forma correcta de inicializar un objeto basado en una Interface cuando no se requieren valores iniciales.
    this.updateExp = <Experiencia>JSON.parse(JSON.stringify(this._expService.exp))
    this.idExp = this.updateExp.id
    _expService.getAmbitos().subscribe((ambitosList) => {
      this.ambitos = ambitosList
      this.ambitos.forEach(element => {
        if (element.nombre == this.updateExp.ambito)
          this.updateExpAmbito = element
      })
      console.log("ambito en subscribe : ", this.updateExpAmbito)
      _expService.getEspecialidades(this.updateExpAmbito.id).subscribe((especialidadesList) => {
        this.especialidades = especialidadesList
        this.especialidades.forEach(element => {
          if (element.nombre == this.updateExp.especialidad) {
            this.updateExpEspecialidad = element
            console.log("element: ", element)
          }
        })
      })
    })
    _expService.getUniversidades().subscribe((universidadesList) => {
      this.universidades = universidadesList
      this.universidades.forEach(element => {
        if (element.nombre == this.updateExp.universidad)
          this.updateExpUniversidad = element
      })
    })

    console.log("fecha: ", this.updateExp.fecha)
    this.model = {
      year: moment(this.updateExp.fecha.toString(), "DD/MM/YYYY").year(),
      month: moment(this.updateExp.fecha.toString(), "DD/MM/YYYY").month() + 1, //Month is zero based!!!!
      day: moment(this.updateExp.fecha.toString(), "DD/MM/YYYY").date()
    }
    console.log("fecha en Model: ", this.model)

    this.filesToUpload = [];

    this.myForm = _fb.group({
      'nombre': ['', Validators.required],
      'coordinadores': this._fb.array([
        this.initCoordinador(),
      ]),
      'destinatario': ['', Validators.required],
      'descripcion': ['', Validators.required],
      'fecha': ['', Validators.required],
      'ambito': [this.updateExpAmbito, Validators.required],
      'especialidad': ['', Validators.required],
      'universidad': ['', Validators.required],
      'multimedias': this._fb.array([
        this.initMultimedia(),
      ]),
      //FORMATEAR FECHA A UN SOLO CAMPO
    });

    this.subscriptionToVerify = _expService.exp$.subscribe((exp) => {
      console.log("pasa por subscribe user")
      this.updateExp = <Experiencia>JSON.parse(JSON.stringify(exp))
      console.log(this.updateExp)
    })

  } //CONSTRUCTOR

  ngOnInit() {
  }

  selectToday() {
    this.model = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
  }

  initCoordinador() {
    return this._fb.group({
      'nombre': ['', Validators.required],
      'email': ['', Validators.email]
    })
  }

  initMultimedia() {
    return this._fb.group({
      'nombre_archivo': [''],
      'texto': ['']
    })
  }

  onChangeAmbito(value) {
    console.log("pasa por change con indice ", parseInt(value))
    let idx = parseInt(value)
    //if (idx == 0) return
    this._expService.getEspecialidades(idx + 1).subscribe((especialidadesList) => {
      console.log("Reload Especialidades")
      this.especialidades = especialidadesList
      this.updateExpEspecialidad = ""
    })
  }

  addCoordinador() {
    //console.log("Despues de borrar el cordinador: ", JSON.stringify(this.updateExp.coordinadores))
    const control = <FormArray>this.myForm.controls['coordinadores'];
    this.updateExp.coordinadores.push({ id: 0, nombre: '', email: '' })
    control.push(this.initCoordinador());
    console.log("Despues de añadir el cordinador: ", JSON.stringify(this.updateExp.coordinadores))
  }

  addMultimedia() {
    const control = <FormArray>this.myForm.controls['multimedias'];
    control.push(this.initMultimedia());
  }

  removeCoordinador(i: number, email) {
    console.log("Antes de borrar el cordinador: ", JSON.stringify(this.updateExp.coordinadores))
    console.log("Email del coordinador a borrar: ", email.value)
    const control = <FormArray>this.myForm.controls['coordinadores'];
    control.removeAt(i);
    this.updateExp.coordinadores = this.updateExp.coordinadores.filter(function (el) {
      return el.email !== email.value;
    });
    console.log("Despues de borrar el cordinador: ", JSON.stringify(this.updateExp.coordinadores))
  }

  removeMultimedia(i: number) {
    const control = <FormArray>this.myForm.controls['multimedias'];
    control.removeAt(i);
  }

  goback() {
    this._location.back();
  }

  update(model: Experiencia) {
    console.log("salvando ...")
    let ngbDate = this.myForm.controls['fecha'].value;
    let formatDate = (ngbDate.day + '-' + ngbDate.month + '-' + ngbDate.year)

    this.updateExp = this.myForm.value
    this.updateExp.id = this.idExp
    this.updateExp.fecha = formatDate


    //this.newExp.fecha = 
    console.log("experiencia: ", JSON.stringify(this.updateExp))
    console.log("Modelo: ", model);
    this._expService.updateExperiencia(this.updateExp).subscribe((res) => {
      if (res['success'] == true) console.log("Actualizado correctamente")
      else {
        console.log(res['message'])
        this.message = res['message']
      }
    })
  }

}
