import { Component, Input, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators, FormControl } from '@angular/forms';
import { Proyecto } from '../proyecto';
import { Router } from '@angular/router';
import { AuthService } from './../../../auth.service';
import { ProyectosService } from '../proyectos.service';
import { ExpService } from '../../experiencias/exp.service'
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
  selector: 'app-proyectos-update',
  templateUrl: './proyectos-update.component.html',
  styleUrls: ['./proyectos-update.component.css']
})
export class ProyectosUpdateComponent implements OnInit {

  public uploader: FileUploader = new FileUploader({ url: URL });

  myForm: FormGroup
  subscriptionToVerify: Subscription

  model_ini: NgbDateStruct;
  model_fin: NgbDateStruct;

  rForm: FormGroup
  subscriptionToGetRoles: Subscription
  updateProj
  proj: Proyecto
  roles
  estados
  provincias
  ambitos
  especialidades
  universidades
  updateProjEstado
  updateProjAmbito //Selected value para el select
  updateProjEspecialidad //Selected value para el select
  updateProjUniversidad //Selected value para el select
  updateProjEntidadProvincia //Selected value para el select
  adjuntos: Array<any>
  filesToUpload: Array<any>
  idProj
  nombreProyecto: string
  message: string = ''
  advert1: string
  advert2: string
  advert3: string


  /*CONSTRUCTOR*/
  constructor(
    private authService: AuthService,
    private _expService: ExpService,
    private _projService: ProyectosService,
    private _router: Router,
    private _location: Location,
    private _fb: FormBuilder
  ) {
    this.updateProj = <Proyecto>JSON.parse(JSON.stringify(this._projService.proyecto))
    this.nombreProyecto = this.updateProj.nombre
    this.idProj = this.updateProj.id
    this.adjuntos = this.updateProj.adjuntos
    this.filesToUpload = []
    _projService.getEstados().subscribe((estadosList) => {
      this.estados = estadosList
      this.estados.forEach(element => {
        if (element.id == this.updateProj.estado.id)
          this.updateProjEstado = element
      })
    })
    _projService.getProvincias().subscribe((provinciasList) => {
      this.provincias = provinciasList
      this.provincias.forEach(element => {
        if (element.id == this.updateProj.entidad.provincia_id) {
          this.updateProjEntidadProvincia = element
        }
      })
    })

    _expService.getAmbitos().subscribe((ambitosList) => {
      this.ambitos = ambitosList
      this.ambitos.forEach(element => {
        if (element.nombre == this.updateProj.ambito) {
          this.updateProjAmbito = element
        }
      })
      _expService.getEspecialidades(this.updateProjAmbito.id).subscribe((especialidadesList) => {
        this.especialidades = especialidadesList
        this.especialidades.forEach(element => {
          if (element.nombre == this.updateProj.especialidad) {
            this.updateProjEspecialidad = element
          }
        })
      })
    })
    _expService.getUniversidades().subscribe((universidadesList) => {
      this.universidades = universidadesList
      this.universidades.forEach(element => {
        if (element.nombre == this.updateProj.universidad)
          this.updateProjUniversidad = element
      })
    })

    if (this.updateProj.fecha_inicio != null) {
      this.model_ini = {
        year: moment(this.updateProj.fecha_inicio.toString(), "DD/MM/YYYY").year(),
        month: moment(this.updateProj.fecha_inicio.toString(), "DD/MM/YYYY").month() + 1, //Month is zero based!!!!
        day: moment(this.updateProj.fecha_inicio.toString(), "DD/MM/YYYY").date()
      }
    }
    if (this.updateProj.fecha_fin != null) {
      this.model_ini = {
        year: moment(this.updateProj.fecha_fin.toString(), "DD/MM/YYYY").year(),
        month: moment(this.updateProj.fecha_fin.toString(), "DD/MM/YYYY").month() + 1, //Month is zero based!!!!
        day: moment(this.updateProj.fecha_fin.toString(), "DD/MM/YYYY").date()
      }
    }


    this.myForm = _fb.group({
      'nombre': ['', Validators.required],
      'descripcion': ['', Validators.required],
      'ambito': [this.updateProjAmbito, Validators.required],
      'coordinadores': this._fb.array([
        this.initCoordinador(),
      ]),
      'alumnos': this._fb.array([
        this.initAlumno(),
      ]),
      'nombre_entidad': ['', Validators.required],
      'email_entidad': ['', Validators.required],
      'provincia_entidad': [''],
      'municipio_entidad': ['', Validators.required],
      'fecha_inicio': null,
      'fecha_fin': null,
      'especialidad': null,
      'universidad': null
      //FORMATEAR FECHA A UN SOLO CAMPO
    });
    this.cargarCoordinadores()
    this.cargarAlumnos()
  }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      var jsonResponse = JSON.parse(response);
      let campos = { nombre_local: item.file.name, nombre_fichero: jsonResponse.file }
      this.filesToUpload.push(campos)
    };
  }

  selectToday() {
    this.model_ini = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
    this.model_fin = { year: now.getFullYear(), month: now.getMonth() + 1, day: now.getDate() };
  }

  initCoordinador() {
    return this._fb.group({
      'nombre': null,
      'email': null
    })
  }
  cargarCoordinadores() {
    const control = <FormArray>this.myForm.controls['coordinadores'];
    for (let index = 0; index < this.updateProj.coordinadores.length-1; index++) {
      control.push(this.initCoordinador());        
    }
  }
  addCoordinador() {
    //console.log("Despues de borrar el cordinador: ", JSON.stringify(this.updateExp.coordinadores))
    const control = <FormArray>this.myForm.controls['coordinadores'];
    this.updateProj.coordinadores.push({ id: 0, nombre: '', email: '' })
    control.push(this.initCoordinador());
  }
  removeCoordinador(i: number, email) {
    const control = <FormArray>this.myForm.controls['coordinadores'];
    control.removeAt(i);
    this.updateProj.coordinadores = this.updateProj.coordinadores.filter(function (el) {
      return el.email !== email.value;
    });
  }

  initAlumno() {
    return this._fb.group({
      'nombre': null,
      'email': null
    })
  }
  cargarAlumnos() {
    const control = <FormArray>this.myForm.controls['alumnos'];
    for (let index = 0; index < this.updateProj.alumnos.length-1; index++) {
      control.push(this.initAlumno());        
    }
  }
  addAlumno() {
    //console.log("Despues de borrar el cordinador: ", JSON.stringify(this.updateExp.coordinadores))
    const control = <FormArray>this.myForm.controls['alumnos'];
    this.updateProj.alumnos.push({ id: 0, nombre: '', email: '' })
    control.push(this.initAlumno());
  }
  removeAlumno(i: number, email) {
    const control = <FormArray>this.myForm.controls['alumnos'];
    control.removeAt(i);
    this.updateProj.alumnos = this.updateProj.alumnos.filter(function (el) {
      return el.email !== email.value;
    });
  }

  onChangeAmbito(value) {
    console.log("pasa por change con indice ", parseInt(value))
    let idx = parseInt(value)
    //if (idx == 0) return
    this._expService.getEspecialidades(idx + 1).subscribe((especialidadesList) => {
      console.log("Reload Especialidades")
      this.especialidades = especialidadesList
      this.updateProjEspecialidad = ""
    })
  }

  removeAdjunto(i: number, nombre_fichero) {
    this.adjuntos = this.adjuntos.filter(function (el) {
      return el.nombre_fichero !== nombre_fichero;
    });
  }

  subir(item: any) {
    item.upload()
  }

  eliminar(item: any) {
    for (var i = this.filesToUpload.length - 1; i >= 0; i--) {
      if (this.filesToUpload[i].nombre_local === item.file.name) {
        this.filesToUpload.splice(i, 1);
        break
      }
    }
    item.remove()
  }

  goback() {
    this._location.back();
  }

  update(model: Proyecto) {
    console.log("salvando ...")

    this.proj = this.myForm.value
    this.proj.adjuntos = []
    for (var i = this.proj.coordinadores.length - 1; i >= 0; i--) {
      if (this.proj.coordinadores[i].nombre == null) {
        this.proj.coordinadores.splice(i, 1);
        break
      }
    }
    this.adjuntos.forEach(element => {
      this.proj.adjuntos.push(element)
    });
    this.filesToUpload.forEach(element => {
      let campos = {
        id: -1,
        nombre_fichero: <string>element.nombre_fichero,
        descripcion: <string>null,
        proyecto_id: <number>this.idProj
      }
      this.proj.adjuntos.push(campos)
    });
    this.proj.id = this.idProj

    let formatDate = null
    let ngbDate = this.myForm.controls['fecha_inicio'].value;
    console.log("ngbDate: ", ngbDate);
    (ngbDate != null) ? formatDate = ngbDate.day + '-' + ngbDate.month + '-' + ngbDate.year : formatDate = null;
    this.proj.fecha_inicio = formatDate

    ngbDate = this.myForm.controls['fecha_fin'].value;
    console.log("ngbDate para fin: ", ngbDate);
    (ngbDate != null) ? formatDate = ngbDate.day + '-' + ngbDate.month + '-' + ngbDate.year : formatDate = null;
    this.proj.fecha_fin = formatDate

    /***QUITAR ESTO CUANDO SE CONTROLE EL ESTADO y el */
    //this.proj.estado = {id : 1, nombre:'', descripcion: ''}
    this.proj.estado = this.updateProj.estado
    console.log("estado: ", this.proj.estado)
    /******************************************/
    console.log("entidad_id: ",this.updateProj.entidad.entidad_id)
    this.proj.entidad = {id:-1, nombre:"", descripcion:"", provincia_id:"", municipio:"", tfno:"", email:""} 
    this.proj.entidad.id = this.updateProj.entidad.entidad_id
    //this.newExp.fecha = 
    //console.log("proyecto: ", JSON.stringify(this.proj))
    //console.log("Modelo: ", model);

    this._projService.updateProyecto(this.proj, 0).subscribe((res) => {
      if (res['success'] == true) {
        this._projService.getProyecto(this.idProj).subscribe((res) => {
          console.log("respuesta de getProyectos: ", res)
          if (res['success'] == true) {
            let proyecto = res['proj']
            this._projService.setProj(proyecto)
            //console.log("Probando geter para la experiencia seteada en el servicio:  ", expId)
            let projFromService = <Proyecto>JSON.parse(JSON.stringify(this._projService.proyecto))
            console.log("Proyecto del servicio: ", projFromService)
          }
          //this._location.back();
        })
          console.log("Grabado correctamente")
          alert("Grabado correctamente")
          this._location.back();
  
      } else {
        console.log(res['message'])
        this.message = res['message']
      }
    })
  }

}
