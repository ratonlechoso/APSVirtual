import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BsModalComponent, BsModalService } from 'ng2-bs3-modal';
import { ProyectosService } from '../proyectos.service';
import { Proyecto } from '../proyecto'
import { Subscription } from 'rxjs/Subscription';
import { User } from './../../user/user';
import { AuthService } from './../../../auth.service';


@Component({
  selector: 'app-proyectos-detail',
  templateUrl: './proyectos-detail.component.html',
  styleUrls: ['./proyectos-detail.component.css']
})
export class ProyectosDetailComponent implements OnInit, OnDestroy {

  @ViewChild('modalDelete')
  modalDelete: BsModalComponent;
  // modalDelete: BsModalComponent;
  // modalApadrinar: BsModalComponent;
  subscriptionToGetProj: Subscription
  subscriptionToDeleteProj: Subscription
  subscriptionToApadrinarProj: Subscription

  updAction: number = 0

  user: User
  proyecto: Proyecto
  projId: String

  constructor(
    private _projService: ProyectosService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _location: Location,
    private authService: AuthService
  ) { }

  ngOnInit() {
    try {
      this.proyecto = <Proyecto>JSON.parse(JSON.stringify(this._projService.proyecto))
    } catch (err) {
      this.router.navigate(['proyectos']);
      return
    }
    console.log("proyecto ", this.proyecto)
    this.user = this.authService.user;
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });
    window.scrollTo(0, 0)
  }

  ngOnDestroy() {
    if (this.subscriptionToGetProj != null)
      this.subscriptionToGetProj.unsubscribe();
    if (this.subscriptionToDeleteProj != null)
      this.subscriptionToDeleteProj.unsubscribe();
  }

  goback() {
    this._location.back();
  }

  borrar() {
    console.log("El id de exp es:  ", this.proyecto.id)
    this.modalDelete.open()
  }

  update(projId) {
    this.projId = projId
    let proyecto: Proyecto
    //Obtener experiencia con id expId 
    this.router.navigate(['proyectos-update']);
  }

  apadrinar(projId) {
    console.log("Apadrinando ...");
    (this.updAction != 1) ? this.updAction = 1 : this.updAction = 0
  }

  apadrinarReceiver(event) {
    console.log("datos del evento 'apadrinar': ", event);
    this.proyecto = <Proyecto>event;
    (this.updAction != 1) ? this.updAction = 1 : this.updAction = 0
  }

  iniciar_reclutamiento(projId) {
    console.log("Iniciar reclutamiento ...");
    (this.updAction != 2) ? this.updAction = 2 : this.updAction = 0
  }

  iniciar_reclutamientoReceiver(event) {
    console.log("datos del evento 'iniciar_reclutamiento': ", event);
    this.proyecto = <Proyecto>event;
    (this.updAction != 2) ? this.updAction = 2 : this.updAction = 0
  }

  alistar(projId) {
    console.log("Alistar ...");
    (this.updAction != 3) ? this.updAction = 3 : this.updAction = 0
  }

  alistarReceiver(event) {
    (this.updAction != 3) ? this.updAction = 3 : this.updAction = 0
    if (event == false) return
    this.proyecto = <Proyecto>event;
    console.log("Proyecto despues de alistar': ", this.proyecto);
  }

  arrancar(prokId) {
    console.log("Arrancar ...");
    (this.updAction != 4) ? this.updAction = 4 : this.updAction = 0
  }
  arrancarReceiver(event) {
    (this.updAction != 4) ? this.updAction = 4 : this.updAction = 0
    if (event == false) return
    this.proyecto = <Proyecto>event;
    console.log("Proyecto despues de arrancar': ", this.proyecto);
  }

  finalizar(prokId) {
    console.log("finalizar ...");
    (this.updAction != 5) ? this.updAction = 5 : this.updAction = 0
  }
  finalizarReceiver(event) {
    (this.updAction != 5) ? this.updAction = 5 : this.updAction = 0
    if (event == false) return
    this.proyecto = <Proyecto>event;
    console.log("Proyecto despues de finalizar': ", this.proyecto);
  }

  reactivar(prokId) {
    console.log("Reactivar ...");
    (this.updAction != 6) ? this.updAction = 6 : this.updAction = 0
  }
  
  reactivarReceiver(event) {
    (this.updAction != 6) ? this.updAction = 6 : this.updAction = 0
    if (event == false) return
    this.proyecto = <Proyecto>event;
    console.log("Proyecto despues de reactivar': ", this.proyecto);
  }



  /*** MODALS ***/
  modalDeleteDismissed() {
    console.log("Modal cerrado sin acción")
  }

  modalDeleteOpened() {
    /**No hacer nada*/
  }

  modalDeleteClosed() {
    this.subscriptionToDeleteProj = this._projService.deleteProyecto(this.proyecto.id).subscribe((res) => {
      if (res['success'] == true) {
        this._location.back();
      }
    })
  }

}
