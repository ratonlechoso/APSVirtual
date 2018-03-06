import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { Experiencia } from '../experiencia';
import { Router } from '@angular/router';
import { AuthService } from './../../../auth.service';
import { ExpService } from '../exp.service';
import { Subscription } from 'rxjs/Subscription';
import { matchOtherValidator } from './../../tools/match-other-validator';
import { FileUploader } from 'ng2-file-upload';

import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { forEach } from '@angular/router/src/utils/collection';

const now = new Date();
//const URL = 'http://localhost:3567/api/exp/upload';
const URL = 'api/exp/upload';

@Component({
  selector: 'app-experiencias-update',
  templateUrl: './experiencias-update.component.html',
  styleUrls: ['./experiencias-update.component.css']
})
export class ExperienciasUpdateComponent implements OnInit {
  @Input() exp: Experiencia;

  public uploader: FileUploader = new FileUploader({ url: URL });

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
  adjuntos: Array<any>
  filesToUpload: Array<any>
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
    this.adjuntos = this.updateExp.adjuntos
    console.log("adjuntos: ", this.adjuntos)
    this.filesToUpload = []
    _expService.getAmbitos().subscribe((ambitosList) => {
      this.ambitos = ambitosList
      this.ambitos.forEach(element => {
        if (element.nombre == this.updateExp.ambito)
          this.updateExpAmbito = element
      })
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
      //FORMATEAR FECHA A UN SOLO CAMPO
    });

    // this.subscriptionToVerify = _expService.exp$.subscribe((exp) => {
    //   console.log("pasa por subscribe user")
    //   this.updateExp = <Experiencia>JSON.parse(JSON.stringify(exp))
    //   console.log(this.updateExp)
    // })

  } //CONSTRUCTOR

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      var jsonResponse = JSON.parse(response);
      let campos = { nombre_local: item.file.name, nombre_server: jsonResponse.file }
      this.filesToUpload.push(campos)
      console.log("RESPUESTA: ", jsonResponse.file)
      console.log("ITEM: ", item.file.name)
    };
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

  removeAdjunto(i: number, nombre_fichero) {
    console.log("Adjuntos antes: ", this.adjuntos)
    this.adjuntos = this.adjuntos.filter(function (el) {
      return el.nombre_fichero !== nombre_fichero;
    });
    console.log("Adjuntos despues: ", this.adjuntos)
  }

  subir(item: any) {
    console.log("item: ", item)
    item.upload()
  }

  eliminar(item: any) {
    console.log("eliminando: ", item)
    for (var i = this.filesToUpload.length - 1; i >= 0; i--) {
      if (this.filesToUpload[i].nombre_local === item.file.name) {
        console.log("Eliminando del array ...")
        this.filesToUpload.splice(i, 1);
        break
      }
    }
    item.remove()
    console.log("Lista de ficheros: ", this.filesToUpload)
  }

  goback() {
    this._location.back();
  }

  update(model: Experiencia) {
    console.log("salvando ...")
    let ngbDate = this.myForm.controls['fecha'].value;
    let formatDate = (ngbDate.day + '-' + ngbDate.month + '-' + ngbDate.year)
    this.updateExp = this.myForm.value
    this.updateExp.adjuntos = []
    this.adjuntos.forEach(element => {
      this.updateExp.adjuntos.push(element)
    });
    this.filesToUpload.forEach(element => {
      let campos = {
        id: -1,
        nombre_fichero: <string>element.nombre_server,
        descripcion: <string>null,
        experiencia_id: <number>this.idExp
      }
      this.updateExp.adjuntos.push(campos)
    });
    this.updateExp.id = this.idExp
    this.updateExp.fecha = formatDate


    //this.newExp.fecha = 
    console.log("experiencia: ", JSON.stringify(this.updateExp))
    console.log("Modelo: ", model);
    this._expService.updateExperiencia(this.updateExp).subscribe((res) => {
      if (res['success'] == true) {
        this._expService.getExperiencia(this.updateExp.id).subscribe((res) => {
          //      console.log("respuesta de getExperiencias: ", res)
          if (res['success'] == true) {
            let experiencia = res['exp']
            this._expService.setExp(experiencia)
            //console.log("Probando geter para la experiencia seteada en el servicio:  ", expId)
            let expFromService = <Experiencia>JSON.parse(JSON.stringify(this._expService.exp))
            console.log("Experiencia del servicio: ", expFromService)
          }
          alert("Grabado correctamente")
          this._location.back();
        })
      } else {
        console.log(res['message'])
        this.message = res['message']
      }
    })
  }


}
