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
    (this.updAction != 1) ? this.updAction = 1 : this.updAction = 0
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
