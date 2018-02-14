import { Router, ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnDestroy, EventEmitter, ViewChild  } from '@angular/core';
import { ExpService } from '../exp.service';
import { Experiencia }  from '../experiencia'
import { Subscription }   from 'rxjs/Subscription'; 
import { AuthService } from './../../../auth.service';
import { User } from './../../user/user';
import { BsModalComponent, BsModalService } from 'ng2-bs3-modal';

@Component({
  selector: 'app-experiencias-list',
  templateUrl: './experiencias-list.component.html',
  styleUrls: ['./experiencias-list.component.css']
})
export class ExperienciasListComponent implements OnInit, OnDestroy {
  @ViewChild('modal')
  modalDelete: BsModalComponent;

  experiencias: Experiencia[]
  expId: String
  user: User 
  ambitoId: number
  listarExperiencias:boolean
  subscriptionToGetExp: Subscription
  subscriptionToDeleteExp: Subscription
  p:number = 1;

  page: number
  itemsPerPage: number = 25
  postsPerPage: number[] = [25, 50, 100]
  nombreLista: String

  constructor(
    private expService: ExpService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    authService: AuthService
  ) { 
    this.user = authService.user;
    this.listarExperiencias = false;
    authService.user$.subscribe( (user) => {
      this.user = user;
     });
  }

  ngOnInit() {
    // subscribe to router event
    //this.ambitoId = this.activatedRoute.snapshot.queryParams["ambito_id"];
    this.experiencias = []
    this.ambitoId = 0;
    this.activatedRoute.params.subscribe((params: Params) => {
        this.ambitoId = params['ambito_id'];
        this.open()
    });
    
  }

  ngOnDestroy() {
    if (this.subscriptionToGetExp != null)
      this.subscriptionToGetExp.unsubscribe()
    if (this.subscriptionToDeleteExp != null)
      this.subscriptionToDeleteExp.unsubscribe()

  }

  pageChanged(event) {
    this.page = event.page;
    this.itemsPerPage = event.itemsPerPage
    //this.loadStudentsByPage(this.page, this.itemsPerPage);
  }

  open() {
    this.listarExperiencias = true;
    console.log("open recibe el ambito: ", this.ambitoId)
    this.subscriptionToGetExp = this.expService.getExperiencias(this.ambitoId).subscribe( (res) => {
      console.log("respuesta de getExperiencias: ", res)
      if (res['success'] == true) {
        this.experiencias = res['exp']
        console.log("Experiencias: ", this.experiencias)
      }
    })

    switch (this.ambitoId) {
      case 1:
        this.nombreLista = "Artes y Humanidades"
        break;
      case 2:
        this.nombreLista = "Ciencias"
        break;
      case 3:
        this.nombreLista = "Ciencias de la Salud"
        break;
      case 4:
        this.nombreLista = "Ciencias Sociales y Políticas"
        break;
      case 5:
        this.nombreLista = "Arquitectura e Ingeniería"
        break;                  
      default:
        break;
    }
  }
  borrar (expId){
    this.expId = expId
    console.log("El id de exp es:  ", expId)
    this.modalDelete.open(expId)
  } 
  update (expId){
    this.expId = expId 
    let experiencia: Experiencia
    //Obtener experiencia con id expId
    this.subscriptionToGetExp = this.expService.getExperiencia(expId).subscribe( (res) => {
//      console.log("respuesta de getExperiencias: ", res)
      if (res['success'] == true) {
        experiencia = res['exp']
        this.expService.setExp(experiencia)
        //console.log("Probando geter para la experiencia seteada en el servicio:  ", expId)
        let expFromService = <Experiencia>JSON.parse(JSON.stringify(this.expService.exp))
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
    this.subscriptionToDeleteExp = this.expService.deleteExperiencia(this.expId).subscribe( (res) => {
      if (res['success'] == true) {
        for (var i = this.experiencias.length - 1; i >= 0; i--) {
          if (this.experiencias[i].id == this.expId) {
              this.experiencias.splice(i, 1);
          }
        }
      }
    })
  }

}
