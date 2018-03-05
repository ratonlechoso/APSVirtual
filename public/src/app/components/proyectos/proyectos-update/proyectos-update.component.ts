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
const URL = 'http://localhost:3567/api/exp/upload';



@Component({
  selector: 'app-proyectos-update',
  templateUrl: './proyectos-update.component.html',
  styleUrls: ['./proyectos-update.component.css']
})
export class ProyectosUpdateComponent implements OnInit {
  @Input() proj: Proyecto;

  public uploader: FileUploader = new FileUploader({ url: URL });

  myForm: FormGroup
  subscriptionToVerify: Subscription

  model_ini: NgbDateStruct;
  model_fin: NgbDateStruct;

  rForm: FormGroup
  subscriptionToGetRoles: Subscription
  updateProj: Proyecto
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
  message: string = ''
  advert1: string
  advert2: string
  advert3: string


  /*CONSTRUCTOR*/
  constructor(
    private authService: AuthService,
    private _expService: ExpService,
    private _projService: ProyectosService,
    private router: Router,
    private _location: Location,
    private _fb: FormBuilder
  ) {
    this.updateProj = <Proyecto>JSON.parse(JSON.stringify(this._projService.proyecto))
    console.log("updateProj: ", this.updateProj)
    this.idProj = this.updateProj.id
    this.adjuntos = this.updateProj.adjuntos
    console.log("adjuntos: ", this.adjuntos)
    this.filesToUpload = []
    _projService.getEstados().subscribe((estadosList) => {
      console.log("obteniendo estados")
      this.estados = estadosList
      this.estados.forEach(element => {
        if (element.id == this.updateProj.estado.id)
          this.updateProjEstado = element
      })
    })
    _projService.getProvincias().subscribe((provinciasList) => {
      this.provincias = provinciasList
      console.log("Provincias: ", this.provincias)
      this.provincias.forEach(element => {
        if (element.id == this.updateProj.entidad.provincia_id) {
          console.log("provincia SELECCIONADA: ", element)
          this.updateProjEntidadProvincia = element
        }
      })
    })

    _expService.getAmbitos().subscribe((ambitosList) => {
      this.ambitos = ambitosList
      this.ambitos.forEach(element => {
        if (element.nombre == this.updateProj.ambito) {
          console.log("ambito SELECCIONADO: ", element)
          this.updateProjAmbito = element
        }
      })
      _expService.getEspecialidades(this.updateProjAmbito.id).subscribe((especialidadesList) => {
        this.especialidades = especialidadesList
        this.especialidades.forEach(element => {
          if (element.nombre == this.updateProj.especialidad) {
            this.updateProjEspecialidad = element
            console.log("element: ", element)
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
      console.log("fecha: ", this.updateProj.fecha_inicio)
      this.model_ini = {
        year: moment(this.updateProj.fecha_inicio.toString(), "DD/MM/YYYY").year(),
        month: moment(this.updateProj.fecha_inicio.toString(), "DD/MM/YYYY").month() + 1, //Month is zero based!!!!
        day: moment(this.updateProj.fecha_inicio.toString(), "DD/MM/YYYY").date()
      }
      console.log("fecha en Model: ", this.model_ini)
    }
    if (this.updateProj.fecha_fin != null) {
      console.log("fecha: ", this.updateProj.fecha_fin)
      this.model_ini = {
        year: moment(this.updateProj.fecha_fin.toString(), "DD/MM/YYYY").year(),
        month: moment(this.updateProj.fecha_fin.toString(), "DD/MM/YYYY").month() + 1, //Month is zero based!!!!
        day: moment(this.updateProj.fecha_fin.toString(), "DD/MM/YYYY").date()
      }
      console.log("fecha en Model: ", this.model_fin)
    }


    this.myForm = _fb.group({
      'nombre': ['', Validators.required],
      'descripcion': ['', Validators.required],
      'ambito': [this.updateProjAmbito, Validators.required],
      'coordinadores': this._fb.array([
        this.initCoordinador(),
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
  }

  ngOnInit() {
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      var jsonResponse = JSON.parse(response);
      let campos = { nombre_local: item.file.name, nombre_server: jsonResponse.file }
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

  addCoordinador() {
    //console.log("Despues de borrar el cordinador: ", JSON.stringify(this.updateExp.coordinadores))
    const control = <FormArray>this.myForm.controls['coordinadores'];
    this.updateProj.coordinadores.push({ id: 0, nombre: '', email: '' })
    control.push(this.initCoordinador());
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


  removeCoordinador(i: number, email) {
    const control = <FormArray>this.myForm.controls['coordinadores'];
    control.removeAt(i);
    this.updateProj.coordinadores = this.updateProj.coordinadores.filter(function (el) {
      return el.email !== email.value;
    });
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
    this.updateProj = this.myForm.value
    this.updateProj.adjuntos = []
    for (var i = this.updateProj.coordinadores.length - 1; i >= 0; i--) {
      if (this.updateProj.coordinadores[i].nombre == null) {
        this.updateProj.coordinadores.splice(i, 1);
        break
      }
    }
    this.adjuntos.forEach(element => {
      this.updateProj.adjuntos.push(element)
    });
    this.filesToUpload.forEach(element => {
      let campos = {
        id: -1,
        nombre_server: <string>element.nombre_server,
        descripcion: <string>null,
        proyecto_id: <number>this.idProj
      }
      this.updateProj.adjuntos.push(campos)
    });
    this.updateProj.id = this.idProj

    let formatDate = null
    let ngbDate = this.myForm.controls['fecha_inicio'].value;
    console.log("ngbDate: ", ngbDate);
    (ngbDate != null) ? formatDate = ngbDate.day + '-' + ngbDate.month + '-' + ngbDate.year : formatDate = null;
    this.updateProj.fecha_inicio = formatDate

    ngbDate = this.myForm.controls['fecha_fin'].value;
    console.log("ngbDate para fin: ", ngbDate);
    (ngbDate != null) ? formatDate = ngbDate.day + '-' + ngbDate.month + '-' + ngbDate.year : formatDate = null;
    this.updateProj.fecha_fin = formatDate
    /***QUITAR ESTO CUANDO SE CONTROLE EL ESTADO y el */
    this.updateProj.estado = {id : 1, nombre:'', descripcion: ''}

    /******************************************/



    //this.newExp.fecha = 
    console.log("proyecto: ", JSON.stringify(this.updateProj))
    console.log("Modelo: ", model);

    this._projService.updateProyecto(this.updateProj).subscribe((res) => {
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
      } else {
        console.log(res['message'])
        this.message = res['message']
      }
    })
  }

}
