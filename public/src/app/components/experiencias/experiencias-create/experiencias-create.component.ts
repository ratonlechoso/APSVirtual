import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Experiencia } from '../experiencia';
import { Coordinador } from '../experiencia';
import { Router } from '@angular/router';
import { ExpService } from './../exp.service';
import { Subscription } from 'rxjs/Subscription';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload';
import * as moment from 'moment';

const now = new Date();
//const URL = 'http://localhost:3567/api/exp/upload';
const URL = 'api/exp/upload';

@Component({
  selector: 'app-experiencias-create',
  templateUrl: './experiencias-create.component.html',
  styleUrls: ['./experiencias-create.component.css']
})

export class ExperienciasCreateComponent implements OnInit {

  public uploader: FileUploader = new FileUploader({ url: URL });

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

    let campos = { nombre_local: String, nombre_server: String }
    this.filesToUpload = []
    this.newExp = {} as Experiencia //Esta es la forma correcta de inicializar un objeto basado en una Interface cuando no se requieren valores iniciales.
    this.myForm = _fb.group({
      'nombre': ['', Validators.required],
      'coordinadores': this._fb.array([
        this.initCoordinador(),
      ]),
      'destinatario': ['', Validators.required],
      'descripcion': ['', Validators.required],
      'fecha': ['', Validators.required],
      'ambito': [null, Validators.required],
      'especialidad': ['', Validators.required],
      'universidad': ['', Validators.required],
      'adjuntos': this._fb.array([
        this.initAdjuntos(),
      ]),
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
    this.uploader.onAfterAddingFile = (file) => { file.withCredentials = false; };
    this.uploader.onCompleteItem = (item: any, response: any, status: any, headers: any) => {
      var jsonResponse = JSON.parse(response);
      let campos = { nombre_local: item.file.name, nombre_server: jsonResponse.file }
      this.filesToUpload.push(campos)
      console.log("RESPUESTA: ", jsonResponse.file);
      console.log("ITEM: ", item.file.name);
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

  initAdjuntos() {
    return this._fb.group({
      'nombre_archivo': [''],
      'texto': ['']
    })
  }

  onChangeAmbito(value) {
    let idx = parseInt(value)
    if (idx == 0) return
    this._expService.getEspecialidades(idx).subscribe((especialidadesList) => {
      this.especialidades = especialidadesList
    })
  }

  addCoordinador() {
    const control = <FormArray>this.myForm.controls['coordinadores'];
    control.push(this.initCoordinador());
  }

  addMultimedia() {
    const control = <FormArray>this.myForm.controls['adjuntos'];
    control.push(this.initAdjuntos());
  }

  removeCoordinador(i: number) {
    const control = <FormArray>this.myForm.controls['coordinadores'];
    control.removeAt(i);
  }

  removeADjunto(i: number) {
    const control = <FormArray>this.myForm.controls['adjuntos'];
    control.removeAt(i);
  }

  goback() {
    this._location.back();
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

  save(model: Experiencia) {
    console.log("salvando ...")
    let ngbDate = this.myForm.controls['fecha'].value;
    let formatDate = (ngbDate.day + '-' + ngbDate.month + '-' + ngbDate.year)

    this.newExp = this.myForm.value
    this.newExp.fecha = formatDate
    this.newExp.adjuntos = this.filesToUpload
    console.log("experiencia: ", JSON.stringify(this.newExp))
    console.log("Modelo: ", model);
    this._expService.createExperiencia(this.newExp).subscribe((res) => {
      if (res['success'] == true) console.log("Grabado correctamente")
      else {
        console.log(res['message'])
        this.message = res['message']
      }
    })
  }
}

