import { Router, ActivatedRoute, Params } from '@angular/router';
import { Location } from '@angular/common';
import { Component, OnInit, OnDestroy, EventEmitter, ViewChild } from '@angular/core';
import { ProyectosService } from '../proyectos.service';
import { Proyecto } from '../proyecto'
import { Subscription } from 'rxjs/Subscription';
import { User } from './../../user/user';
import { AuthService } from './../../../auth.service';
import { forEach } from '@angular/router/src/utils/collection';


@Component({
  selector: 'app-proyectos-list',
  templateUrl: './proyectos-list.component.html',
  styleUrls: ['./proyectos-list.component.css']
})
export class ProyectosListComponent implements OnInit {

  proyectos: Proyecto[]
  proyectoId: String
  ambitoId: number
  estadoId: number
  user: User
  subscriptionToGetProj: Subscription
  subscriptionToDeleteProj: Subscription
  p: number = 1;

  page: number
  itemsPerPage: number = 25
  postsPerPage: number[] = [25, 50, 100]
  nombreLista: String
  sCriteria: String //Criterios de búsqueda cuando se accede desde la pantalla de búsqueda
  titulo: String


  constructor(
    private _proyectosService: ProyectosService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private _location: Location,
    authService: AuthService
  ) {
    this.proyectos = []
    this.sCriteria = ""
    this.user = authService.user;
    authService.user$.subscribe((user) => {
      this.user = user;
    });
  }

  ngOnInit() {
    // subscribe to router event
    //this.ambitoId = this.activatedRoute.snapshot.queryParams["ambito_id"];

    this.activatedRoute.params.subscribe((params: Params) => {
      this.ambitoId = params['ambito_id'];
      this.estadoId = params['estado_id'];
      console.log("ambito", this.ambitoId)
      if (this.ambitoId == undefined && this.estadoId == undefined) {
        this.titulo = "Resultados de busqueda de Proyectos en ApS"
        this.proyectos = this._proyectosService.proyectos
        this.sCriteria = this._proyectosService.sCriteria
      } else {
        ((this.ambitoId == null) ? this.ambitoId = 0 : this.estadoId = 0)
        this.open()
      }
    });

  }

  ngOnDestroy() {
    if (this.subscriptionToGetProj != null)
      this.subscriptionToGetProj.unsubscribe()
    if (this.subscriptionToDeleteProj != null)
      this.subscriptionToDeleteProj.unsubscribe()
  }

  pageChanged(event) {
    this.page = event.page;
    this.itemsPerPage = event.itemsPerPage
  }

  open() {
    let id = this.ambitoId + this.estadoId
    this.subscriptionToGetProj = this._proyectosService.getProyectos(id).subscribe((res) => {
      if (res['success'] == true) {
        //this.proyectos = res['proj']
        //Mostrar solo los proyectos con estado visible por el usuario actual
        if (this.estadoId > 0)
          this.proyectos = res['proj']
        else {
          res['proj'].forEach(element => {
            if (this.user == null) {
              if ((element.estado.id == 3 || element.estado.id == 4 || element.estado.id == 5) && this.ambitoId == element.ambito_id)
                this.proyectos.push(element)
            } else if ((this.user.rol_id == 1 && (this.estadoId == 3 || this.estadoId == 4 || this.estadoId == 5)) || //Usuario Alumno
              (this.user.rol_id == 2) || //Usuario Profesor
              (this.user.rol_id == 1 && (this.estadoId == 3 || this.estadoId == 4 || this.estadoId == 5)) || //Usuario Entidad
              (this.user.rol_id == 4) || //Usuario Universidad
              (this.user.rol_id == 5)) //Usuario Administrador
              this.proyectos.push(element)
          });
        }
        console.log("Proyectos: ", this.proyectos)
      }
    })
    console.log("estado", this.estadoId)

    this.titulo = "Proyectos de ApS - "
    switch (this.estadoId.toString()) {
      case "1":
        this.titulo += "solicitado por entidad externa"
        break;
      case "2":
        this.titulo += "apadrinado por algún docente"
        break;
      case "3":
        this.titulo += "en fase de aceptación de candidatos"
        break;
      case "4":
        this.titulo += "en curso"
        break;
      case "5":
        this.titulo += "finalizado"
        break;
      default:
        break;
    }
    switch (this.ambitoId.toString()) {
      case "1":
        this.titulo += "pertenecientes al ambito de Artes y Humanidades"
        break;
      case "2":
        this.titulo += "pertenecientes al ambito de Ciencias"
        break;
      case "3":
        this.titulo += "pertenecientes al ambito de Ciencias de la Salud"
        break;
      case "4":
        this.titulo += "pertenecientes al ambito de Ciencias Sociales y Políticas"
        break;
      case "5":
        this.titulo += "pertenecientes al ambito de Arquitectura e Ingeniería"
        break;
      default:
        break;
    }
  }

  
  goback() {
    this._location.back();
  }

  showDetail(projId) {
    this.proyectoId = projId
    let proyecto: Proyecto
    //Obtener experiencia con id expId
    this.subscriptionToGetProj = this._proyectosService.getProyecto(projId).subscribe((res) => {
      console.log("respuesta de getProyectos: ", res)
      if (res['success'] == true) {
        proyecto = res['proj']
        this._proyectosService.setProj(proyecto)
        //console.log("Probando geter para la experiencia seteada en el servicio:  ", expId)
        let projFromService = <Proyecto>JSON.parse(JSON.stringify(this._proyectosService.proyecto))
        console.log("Proyecto del servicio: ", projFromService)
        this.router.navigate(['proyectos-detail']);
      }
    })
  }


}
