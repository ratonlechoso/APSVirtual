import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { BsModalComponent, BsModalService } from 'ng2-bs3-modal';
import { ProyectosService } from './../../proyectos.service';
import { AuthService } from './../../../../auth.service';
import { User } from './../../../user/user';
import { Proyecto } from '../../proyecto';


@Component({
  selector: 'app-proyectos-alistar',
  templateUrl: './proyectos-alistar.component.html',
  styleUrls: ['./proyectos-alistar.component.css']
})
export class ProyectosAlistarComponent implements OnInit {

  @ViewChild('modalAlistar')
  modalAlistar: BsModalComponent;

  
  @Input() proyecto: any;
  @Output()
  alistar: EventEmitter<any> = new EventEmitter<any>();


  subscriptionToAlistar: Subscription

  updateProj: any
  user: User
  accionMsg: String
  accion: Number
  messageHead: String
  modalMsg: String
  inscritos: Number
  typeAlert: String
  
  constructor(
    private _projService: ProyectosService,
    private authService: AuthService
  ) { 
    this.accionMsg = "Subscribir"
    this.accion = 0 //Subscribir
    this.typeAlert = "alert-info"
    this.modalMsg="Está a punto alistarse para este proyecto. ¿Desea continuar?"
    this.messageHead= "Mediante la siguiente acción, usted como alumno, podrá alistarse en el proyecto de ApS. Se podrán subscribir al proyecto "+
    "un número de alumnos no superior al estipulado en el campo de cupo de estudiantes. Este fase se concluye cuando el equipo " + 
    "docente estime pasar a la fase de 'Proyecto arrancado'. "

    this.updateProj = <Proyecto>JSON.parse(JSON.stringify(this._projService.proyecto))
    this.user = this.authService.user;
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
//    console.log("get proj: ", this.updateProj)

    /**Comprobar si el alumno ya está alistado a este proyecto */
    this.updateProj.alumnos.forEach(element => {
      if (this.user.email == element.email)  {
        this.accionMsg = "Cancelar subscripción"
        this.accion = 1  //Cancelar subscripcion
        this.typeAlert = "alert-warning"
        this.modalMsg="Está a punto cancelar su subscripción para este proyecto. ¿Desea continuar?"
        this.messageHead = " Usted ya se encuentra subscrito como alumno al presente proyecto de ApS. Mediante el siguiente formulario podrá,  si así lo desea,  cancelar su subscripción."
      }
    });
    let alumno = {
      nombre: this.user.first_name + " " + this.user.last_name,
      email: this.user.email
    }
    this.inscritos = this.updateProj.cupo_estudiantes - this.updateProj.plazas    
    if (this.accion == 0 && this.updateProj.cupo_estudiantes == this.inscritos) {
      this.typeAlert = "alert-danger"
      this.accion = 2 //No acción
      this.messageHead = "El cupo de alumnos para este proyecto está completo"
    }
      
//    console.log("updateProj: ", this.updateProj)
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.subscriptionToAlistar != null)
      this.subscriptionToAlistar.unsubscribe();
  }

  cancel () {
    this.alistar.emit(false) //Emitter
  }

  update (form) {
    console.log("Formulario ", form)
    this.modalAlistar.open()
  }

  modalAlistarDismissed() {
    console.log("Modal cerrado sin acción")
  }

  modalAlistarOpened() {
    /**No hacer nada*/
  }
  modalAlistarClosed() {
    let email = this.user.email

    if (this.accion == 0) { //Subscribir. Se añade el usuario a la lista de alumnos del proyecto
      this.updateProj.alumnos.push({  nombre: this.user.first_name + '' + this.user.last_name, email: this.user.email })
      this.updateProj.plazas --
    } else if (this.accion = 1) { //cancelar subscripcion. Se elimina el usuario de la lista de alumnos del proyecto
      this.updateProj.alumnos = this.updateProj.alumnos.filter(function (el) { 
         return el.email != email;
      });
      this.updateProj.plazas ++
    }
    this.inscritos = this.updateProj.cupo_estudiantes - this.updateProj.plazas    
    // console.log("Iniciar Reclutamiento", this.updateProj.alumnos)
    // console.log("Proyecto en Detail", this.proyecto.alumnos)

     this.subscriptionToAlistar = this._projService.updateProyecto(this.updateProj, 3).subscribe((res) => {
      if (res['success'] == true) {
        this.updateProj.estado = {id: 3, nombre: "Fase de reclutamiento"}
        this._projService.setProj(this.updateProj)
        this.alistar.emit(this.updateProj) //Emitter
        if (this.accion == 0)
          alert("Alistado en el proyecto con éxito")
        else if (this.accion = 1)  
          alert("Subscripcion cancelada con éxito")
      } else {
        this.alistar.emit(false) //Emitter
        alert("Algo ha ido mal")
      }
    })
  }
}
