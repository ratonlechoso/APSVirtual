import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Component, OnInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { ExpService } from '../exp.service';
import { Experiencia } from '../experiencia'
import { Subscription } from 'rxjs/Subscription';
import { AuthService } from './../../../auth.service';

@Component({
  selector: 'app-experiencias-list',
  templateUrl: './experiencias-list.component.html',
  styleUrls: ['./experiencias-list.component.css']
})
export class ExperienciasListComponent implements OnInit, OnDestroy {

  experiencias: Experiencia[]
  expId: String
  ambitoId
  listarExperiencias: boolean
  subscriptionToGetExp: Subscription
  subscriptionToDeleteExp: Subscription
  p: number = 1;
  total: number

  page: number
  itemsPerPage: number = 25
  postsPerPage: number[] = [25, 50, 100]
  nombreLista: String
  sCriteria: String //Criterios de búsqueda cuando se accede desde la pantalla de búsqueda
  titulo: String

  constructor(
    private expService: ExpService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _location: Location,
    authService: AuthService
  ) {
    this.experiencias = []
    this.total = 0;

  }

  ngOnInit() {
    // subscribe to router event
    //this.ambitoId = this.activatedRoute.snapshot.queryParams["ambito_id"];
    this.experiencias = []
    //this.ambitoId = 0;
    this.activatedRoute.params.subscribe((params: Params) => {
      this.ambitoId = params['ambito_id']
      if (this.ambitoId != undefined)
        this.open()
      else {
        console.log("experiencias en list: " + JSON.stringify(this.expService.experiencias))
        this.experiencias = this.expService.experiencias
        this.titulo = "Resultados de busqueda de Experiencias en ApS"
        this.sCriteria = this.expService.sCriteria
      }
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
    this.subscriptionToGetExp = this.expService.getExperiencias(this.ambitoId).subscribe((res) => {
      console.log("respuesta de getExperiencias: ", res)
      if (res['success'] == true) {
        this.experiencias = res['exp']
        console.log("Experiencias: ", this.experiencias)
      }
    })

    this.titulo = "Experiencias de ApS desarrolladas - "
    switch (this.ambitoId.toString()) {
      case "1":
        this.titulo += "Artes y Humanidades"
        break;
      case "2":
        this.titulo += "Ciencias"
        break;
      case "3":
        this.titulo += "Ciencias de la Salud"
        break;
      case "4":
        this.titulo += "Ciencias Sociales y Políticas"
        break;
      case "5":
        this.titulo += "Arquitectura e Ingeniería"
        break;
      default:
        break;
    }
  }

  goback() {
    this._location.back();
  }

  showDetail(expId) {
    this.expId = expId
    let experiencia: Experiencia
    //Obtener experiencia con id expId
    this.subscriptionToGetExp = this.expService.getExperiencia(expId).subscribe((res) => {
      //      console.log("respuesta de getExperiencias: ", res)
      if (res['success'] == true) {
        experiencia = res['exp']
        this.expService.setExp(experiencia)
        //console.log("Probando geter para la experiencia seteada en el servicio:  ", expId)
        let expFromService = <Experiencia>JSON.parse(JSON.stringify(this.expService.exp))
        console.log("Experiencia del servicio: ", expFromService)
        this.router.navigate(['experiencias-detail']);
      }
    })
  }
}
