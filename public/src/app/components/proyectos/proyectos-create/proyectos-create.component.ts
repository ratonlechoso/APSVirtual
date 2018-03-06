import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Proyecto } from '../proyecto';
import { Entidad } from '../proyecto';
import { Router } from '@angular/router';
import { ExpService } from './../../experiencias/exp.service';
import { ProyectosService } from './../proyectos.service';
import { Subscription } from 'rxjs/Subscription';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import { FileUploader } from 'ng2-file-upload';
import * as moment from 'moment';

const now = new Date();
//const URL = 'http://localhost:3567/api/exp/upload';
const URL = 'api/exp/upload';

@Component({
  selector: 'app-proyectos-create',
  templateUrl: './proyectos-create.component.html',
  styleUrls: ['./proyectos-create.component.css']
})
export class ProyectosCreateComponent implements OnInit {

  public uploader: FileUploader = new FileUploader({ url: URL });

  myForm: FormGroup
  subscriptionToVerify: Subscription

  model: NgbDateStruct;
  newProj: Proyecto
  ambitos: any
  provincias: any
  filesToUpload: Array<any>

  message: String

  constructor(
    private _projService: ProyectosService,
    private _expService: ExpService,
    private _router: Router,
    private _location: Location,
    private _fb: FormBuilder
  ) { 
    _expService.getAmbitos().subscribe((ambitosList) => {
      this.ambitos = ambitosList
    })

    _projService.getProvincias().subscribe((provinciasList) => {
      this.provincias = provinciasList
    })


    let campos = { nombre_local: String, nombre_server: String }
    this.filesToUpload = []
    this.newProj = {} as Proyecto //Esta es la forma correcta de inicializar un objeto basado en una Interface cuando no se requieren valores iniciales.
    this.myForm = _fb.group({
      'nombre': ['', Validators.required],
      'nombre_entidad': ['', Validators.required],
      'email_entidad': ['', Validators.required],
      'provincia_entidad': ['', Validators.required],
      'municipio_entidad': ['', Validators.required],
      'descripcion': ['', Validators.required],
      'ambito': [null, Validators.required],
      'adjuntos': this._fb.array([
        this.initAdjuntos(),
      ]),
      //FORMATEAR FECHA A UN SOLO CAMPO
    });
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
  initAdjuntos() {
    return this._fb.group({
      'nombre_archivo': [''],
      'texto': ['']
    })
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

  save(model: Proyecto) {
    console.log("salvando ...")

    this.newProj = this.myForm.value
    this.newProj.adjuntos = this.filesToUpload
    console.log("proyecto: ", JSON.stringify(this.newProj))
    console.log("Modelo: ", model);
    this._projService.createProyecto(this.newProj).subscribe((res) => {
      if (res['success'] == true) { 
        console.log("Grabado correctamente")
        alert("Grabado correctamente")
        this._router.navigate(['/proyectos'])
        
      }
      else {
        console.log(res['message'])
        this.message = res['message']
      }
    })
  }





}
