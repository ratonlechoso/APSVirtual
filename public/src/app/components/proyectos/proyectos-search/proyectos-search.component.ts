import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { Proyecto } from '../proyecto';
import { User } from './../../user/user';
import { Router } from '@angular/router';
import { ProyectosService } from './../proyectos.service';
import { ExpService } from './../../experiencias/exp.service';
import { AuthService } from './../../../auth.service';
import { Subscription } from 'rxjs/Subscription';
import { NgbDateStruct } from '@ng-bootstrap/ng-bootstrap';
import * as moment from 'moment';
import { forEach } from '@angular/router/src/utils/collection';


const now = new Date();

@Component({
  selector: 'app-proyectos-search',
  templateUrl: './proyectos-search.component.html',
  styleUrls: ['./proyectos-search.component.css']
})
export class ProyectosSearchComponent implements OnInit {
  myForm: FormGroup
  subscriptionToVerify: Subscription
  user: User

  model: NgbDateStruct;


  newProj: Proyecto
  ambitos: any
  estados: any
  especialidades: any
  universidades: any
  filesToUpload: Array<any>

  message: String


  constructor(
    private _expService: ExpService,
    private _projService: ProyectosService,
    private _authService: AuthService,
    private _router: Router,
    private _location: Location,
    private _fb: FormBuilder
  ) {
    _expService.getUniversidades().subscribe((universidadesList) => {
      this.universidades = universidadesList
    })

    _expService.getAmbitos().subscribe((ambitosList) => {
      this.ambitos = ambitosList
    })
    this.user = _authService.getLocalUser()
    this.getEstados()
    _authService.user$.subscribe((user) => {
      this.user = user;
      console.log("local User: ", this.user)
      this.getEstados()
    });

    this.newProj = {} as Proyecto //Esta es la forma correcta de inicializar un objeto basado en una Interface cuando no se requieren valores iniciales.
    this.myForm = _fb.group({
      'nombre': '',
      'fecha': '',
      'ambito': null,
      'estado': [null, Validators.required],
      'especialidad': '',
      'universidad': '',
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
    this._router.navigate(['/proyectos']);
  }

  search(model: Proyecto) {

    let sCriteria = ""
    this.newProj = this.myForm.value

    if (this.newProj.nombre != "") sCriteria += "nombre: '" + this.newProj.nombre + "'; "

    if (this.newProj.ambito == "0" || this.newProj.ambito == null) this.newProj.ambito = ""
    else sCriteria += "ambito: '" + this.getNombre(this.ambitos, this.newProj.ambito) + "'; "

    if (this.newProj.estado == null) { 
      this.newProj.estado = { id: 0, nombre: "no state", descripcion: "" }
    }  else {
      let estado = +this.newProj.estado //El simbolo + parsea a entero
      this.newProj.estado = null
      this.newProj.estado = { id: estado, nombre: "", descripcion: "" }
      sCriteria += "estado: '" + this.getNombre(this.estados, estado) + "'; "
    }


    if (this.newProj.especialidad == "") this.newProj.especialidad = ""
    else sCriteria += "especialidad: '" + this.getNombre(this.especialidades, this.newProj.especialidad) + "'; "

    if (this.newProj.universidad == "") this.newProj.universidad = ""
    else sCriteria += "universidad: '" + this.getNombre(this.universidades, this.newProj.universidad) + "'; "

    if (this.myForm.controls['fecha'].value != "") {
      let ngbDate = this.myForm.controls['fecha'].value;
      let formatDate = (ngbDate.day + '-' + ngbDate.month + '-' + ngbDate.year)
      sCriteria += "fecha: " + formatDate + "; "
    }
    this._projService.sCriteria = sCriteria

    this._projService.searchProyectos(this.newProj).subscribe((res) => {
      if (res['success'] == true) {
        console.log("Proyectos: ", res['proj'])
        this._projService.proyectos = res['proj']

        this._router.navigate(['/proyectos-list'])
      } else {
        console.log(res['message'])
        this.message = res['message']
      }
    })
  }

  getEstados() {
    this._projService.getEstados().subscribe((estadosList) => {
      this.estados = []
      let estadosAll = estadosList
      console.log("todos los estados: ", estadosList)
      for (let estado in estadosList) {
        if (this.user != null) {
          console.log ("rol: ", this.user.rol_id)
          switch (estado) {
            case "0":  //solicitado
              if (this.user.rol_id > 2) this.estados.push(estadosList[estado])
              break;
            case "1":  //Apadrinado
              if (this.user.rol_id > 2) this.estados.push(estadosList[estado])
              break;
            case "2":  //reclutando
              this.estados.push(estadosList[estado])
              break;
            case "3":  //running
              this.estados.push(estadosList[estado])
              break;
            case "4":  //finalizado
              this.estados.push(estadosList[estado])
              break;
            case "5":  //cancelado
              if (this.user.rol_id > 3) this.estados.push(estadosList[estado])
              break;
            default:
              break;
          }
        }  else if (+(estado) + 1 > 2 && +(estado) + 1 < 6) this.estados.push(estadosList[estado])
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
