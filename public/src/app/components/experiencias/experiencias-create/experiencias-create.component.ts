import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Experiencia } from '../experiencia';
import { Coordinador } from '../experiencia';
import { Router } from '@angular/router';
import { ExpService } from './../exp.service';
import { Subscription } from 'rxjs/Subscription';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';

const now = new Date();
const URL = 'http://localhost:3567/api/experiencia/uploadMM'; //QUITAR

@Component({
  selector: 'app-experiencias-create',
  templateUrl: './experiencias-create.component.html',
  styleUrls: ['./experiencias-create.component.css']
})

export class ExperienciasCreateComponent implements OnInit {

  myForm: FormGroup
  subscriptionToVerify: Subscription

  model: NgbDateStruct;
  //ambitos = ['Artes y Humanidades', 'Ciencias', 'Ciencias de la Salud', 'Ciencias Sociales y Politicas', 'Arquitectura e Ingenieria'];

  newExp: Experiencia
  ambitos
  especialidades
  universidades
  filesToUpload: Array<File>;

  message: String

  constructor(
    private _expService: ExpService,
    private _router: Router,
    private _fb: FormBuilder
  ) {
    _expService.getAmbitos().subscribe((ambitosList) => {
      this.ambitos = ambitosList
    })

    _expService.getUniversidades().subscribe((universidadesList) => {
      this.universidades = universidadesList
    })

    this.filesToUpload = [];
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
      'multimedias': this._fb.array([
        this.initMultimedia(),
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
    let idx = parseInt(value)
    if (idx == 0) return
    this._expService.getEspecialidades(idx).subscribe((especialidadesList) => {
      this.especialidades = especialidadesList
    })
  }

  ngOnInit() {
  }

  addCoordinador() {
    const control = <FormArray>this.myForm.controls['coordinadores'];
    control.push(this.initCoordinador());
  }

  addMultimedia() {
    const control = <FormArray>this.myForm.controls['multimedias'];
    control.push(this.initMultimedia());
  }

  removeCoordinador(i: number) {
    const control = <FormArray>this.myForm.controls['coordinadores'];
    control.removeAt(i);
  }

  removeMultimedia(i: number) {
    const control = <FormArray>this.myForm.controls['multimedias'];
    control.removeAt(i);
  }

  upload() {
    this.makeFileRequest(URL, [], this.filesToUpload).then((result) => {
      console.log(result);
    }, (error) => {
      console.error(error);
    });
  }

  fileChangeEvent(fileInput: any, i: number) {
    console.log(fileInput.target.files[0])
    if (fileInput.target.files[0] == undefined) {
      return
    }
    // this.filesToUpload = <Array<File>>fileInput.target.files;

    this.filesToUpload.push(fileInput.target.files[0]);
    const control = <FormArray>this.myForm.controls['multimedias'];
    control.controls[i].get('nombre_archivo').setValue(this.filesToUpload[i].name)


    for (var j = 0; j < this.filesToUpload.length; j++)
      console.log(this.filesToUpload[j].name)

  }

  makeFileRequest(url: string, params: Array<string>, files: Array<File>) {
    return new Promise((resolve, reject) => {
      var formData: any = new FormData();
      var xhr = new XMLHttpRequest();
      for (var i = 0; i < files.length; i++) {
        formData.append("uploads[]", files[i], files[i].name);
      }
      xhr.onreadystatechange = function () {
        if (xhr.readyState == 4) {
          if (xhr.status == 200) {
            resolve(JSON.parse(xhr.response));
          } else {
            reject(xhr.response);
          }
        }
      }
      xhr.open("POST", url, true);
      xhr.send(formData);
    });
  }

  save(model: Experiencia) {
    console.log("salvando ...")
    let ngbDate = this.myForm.controls['fecha'].value;
    let formatDate = (ngbDate.day + '-' + ngbDate.month + '-' + ngbDate.year)

    this.newExp = this.myForm.value
    this.newExp.fecha = formatDate
    console.log("experiencia: ", JSON.stringify(this.newExp))
    console.log("Modelo: ", model);
     this._expService.createExperiencia(this.newExp).subscribe( (res) => {
       if (res['success'] == true) console.log("Grabado correctamente")
       else  {
         console.log(res['message'])
         this.message = res['message']
       }
     })
  }
}

