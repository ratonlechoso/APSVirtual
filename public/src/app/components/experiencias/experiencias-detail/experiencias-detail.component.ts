import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';

import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BsModalComponent, BsModalService } from 'ng2-bs3-modal';
import { ExpService } from '../exp.service';
import { Experiencia } from '../experiencia'
import { Subscription } from 'rxjs/Subscription';
import { User } from './../../user/user';
import { AuthService } from './../../../auth.service';
import { PairsPipe} from './../../tools/pairs-pipe';


@Component({
  selector: 'app-experiencias-detail',
  templateUrl: './experiencias-detail.component.html',
  styleUrls: ['./experiencias-detail.component.css']
})

export class ExperienciasDetailComponent implements OnInit {
  @ViewChild('modal')
  modalDelete: BsModalComponent;
  subscriptionToGetExp: Subscription
  subscriptionToDeleteExp: Subscription
  user: User
  experiencia: Experiencia
  expId: String
  constructor(
    private _expService: ExpService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _location: Location,
    private authService: AuthService
  ) {
  }

  ngOnInit() {
    try {
      this.experiencia = <Experiencia>JSON.parse(JSON.stringify(this._expService.exp))
    } catch (err) {
      console.log("EXP: ", this.experiencia)      
      this.router.navigate(['experiencias']);
      return
    }
    this.user = this.authService.user;
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });

    window.scrollTo(0, 0)
  }

  goback() {
    this._location.back();
  }

  borrar() {
    console.log("El id de exp es:  ", this.experiencia.id)
    this.modalDelete.open()
  }
  update(expId) {
    this.expId = expId
    let experiencia: Experiencia
    //Obtener experiencia con id expId
    this.router.navigate(['experiencias-update']);
    // this.subscriptionToGetExp = this._expService.getExperiencia(expId).subscribe((res) => {
    //   //      console.log("respuesta de getExperiencias: ", res)
    //   if (res['success'] == true) {
    //     experiencia = res['exp']
    //     this._expService.setExp(experiencia)
    //     //console.log("Probando geter para la experiencia seteada en el servicio:  ", expId)
    //     let expFromService = <Experiencia>JSON.parse(JSON.stringify(this._expService.exp))
    //     console.log("Experiencia del servicio: ", expFromService)

    //   }
    // })
  }

  modalDeleteDismissed() {
    console.log("Modal cerrado sin acción")
  }
  modalDeleteOpened() {
    /**No hacer nada*/
  }
  modalDeleteClosed() {
    this.subscriptionToDeleteExp = this._expService.deleteExperiencia(this.experiencia.id).subscribe((res) => {
      if (res['success'] == true) {
        this._location.back();
      }
    })
  }




}
