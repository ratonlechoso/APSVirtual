import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BsModalComponent, BsModalService } from 'ng2-bs3-modal';
import { ProyectosService } from './../../proyectos.service';
import { AuthService } from './../../../../auth.service';
import { User } from './../../../user/user';
import { Proyecto } from '../../proyecto';


@Component({
  selector: 'app-proyectos-iniciar-reclutamiento',
  templateUrl: './proyectos-iniciar-reclutamiento.component.html',
  styleUrls: ['./proyectos-iniciar-reclutamiento.component.css']
})
export class ProyectosIniciarReclutamientoComponent implements OnInit {
  @ViewChild('modalIniciarReclutamiento')
  modalIniciarReclutamiento: BsModalComponent;

  @Input() proyecto: any;
  @Output()
  iniciar_reclutamiento: EventEmitter<any> = new EventEmitter<any>();

  myForm: FormGroup

  subscriptionToIniciarReclutamiento: Subscription

  updateProj: any
  user: User
  message: String


  constructor(
    private _projService: ProyectosService,
    private _fb: FormBuilder,
    private authService: AuthService
  ) {
    this.updateProj = <Proyecto>JSON.parse(JSON.stringify(this._projService.proyecto))
    this.user = this.authService.user;
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
    this.updateProj.cupo_estudiantes = 0
    console.log("updateProj: ", this.updateProj)

    this.myForm = _fb.group({
      'cupo_estudiantes': [null, [Validators.required, Validators.min(1), Validators.max(100)]],
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.subscriptionToIniciarReclutamiento != null)
      this.subscriptionToIniciarReclutamiento.unsubscribe();
  }

  cancel () {
    this.iniciar_reclutamiento.emit(false) //Emitter
  }

  update (form) {
    console.log("Formulario ", form)
    this.modalIniciarReclutamiento.open()
  }

  modalIniciarReclutamientoDismissed() {
    console.log("Modal cerrado sin acción")
  }

  modalIniciarReclutamientoOpened() {
    /**No hacer nada*/
  }
  modalIniciarReclutamientoClosed() {
    console.log("Iniciar Reclutamiento", this.updateProj)
    console.log("Proyecto en Detail", this.proyecto)

     this.subscriptionToIniciarReclutamiento = this._projService.updateProyecto(this.updateProj, 2).subscribe((res) => {
      if (res['success'] == true) {
        this.updateProj.estado = {id: 3, nombre: "Fase de reclutamiento"}
        this.iniciar_reclutamiento.emit(this.updateProj) //Emitter
        alert("Iniciado reclutamiento en el proyecto")
      } else {
        this.iniciar_reclutamiento.emit(false) //Emitter
        alert("Algo ha ido mal")
      }
    })
  }




}
