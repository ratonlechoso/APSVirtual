import { Component, OnInit, OnDestroy, ViewChild  } from '@angular/core';
import { Location } from '@angular/common';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { BsModalComponent, BsModalService } from 'ng2-bs3-modal';
import { ExpService } from '../exp.service';
import { Experiencia }  from '../experiencia'
import { Subscription }   from 'rxjs/Subscription'; 
import { User } from './../../user/user';
import { AuthService } from './../../../auth.service';


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
  ambito_id
  constructor(
    private _expService: ExpService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _location: Location,
    authService: AuthService
  ) { 
    this.experiencia = <Experiencia>JSON.parse(JSON.stringify(this._expService.exp))
    _expService.getAmbitos().subscribe((ambitosList) => {
      let ambitos: any
      ambitos = ambitosList
      ambitos.forEach(element => {
        if (element.nombre == this.experiencia.ambito)
        this.ambito_id = element.id
      })
    })
    this.user = authService.user;    
    authService.user$.subscribe( (user) => {
      this.user = user;
     });
  }

  ngOnInit() {
    window.scrollTo(0, 0)
  }

  goback() {
    this._location.back();
  }

  borrar (){
    console.log("El id de exp es:  ", this.experiencia.id)
    this.modalDelete.open()
  } 
  update (expId){
    this.expId = expId 
    let experiencia: Experiencia
    //Obtener experiencia con id expId
    this.subscriptionToGetExp = this._expService.getExperiencia(expId).subscribe( (res) => {
//      console.log("respuesta de getExperiencias: ", res)
      if (res['success'] == true) {
        experiencia = res['exp']
        this._expService.setExp(experiencia)
        //console.log("Probando geter para la experiencia seteada en el servicio:  ", expId)
        let expFromService = <Experiencia>JSON.parse(JSON.stringify(this._expService.exp))
        console.log("Experiencia del servicio: ", expFromService)
        this.router.navigate(['experiencias-update']);
      } 
    })
  }
  
  modalDeleteDismissed() {
    console.log("Modal cerrado sin acción")
  }
  modalDeleteOpened() {
    /**No hacer nada*/
  }
  modalDeleteClosed() {
    this.subscriptionToDeleteExp = this._expService.deleteExperiencia(this.experiencia.id).subscribe( (res) => {
      if (res['success'] == true) {
        this._location.back();
      }
    })
  }




}
