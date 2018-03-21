import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { BsModalComponent, BsModalService } from 'ng2-bs3-modal';
import { ProyectosService } from './../../proyectos.service';
import { AuthService } from './../../../../auth.service';
import { User } from './../../../user/user';
import { Proyecto } from '../../proyecto';


@Component({
  selector: 'app-proyectos-arrancar',
  templateUrl: './proyectos-arrancar.component.html',
  styleUrls: ['./proyectos-arrancar.component.css']
})
export class ProyectosArrancarComponent implements OnInit, OnDestroy {

  @ViewChild('modalArrancar')
  modalArrancar: BsModalComponent;

  @Input() proyecto: any;
  @Output()
  arrancar: EventEmitter<any> = new EventEmitter<any>();

  subscriptionToArrancar: Subscription

  inscritos: Number
  updateProj: any
  user: User

  constructor(
    private _projService: ProyectosService,
    private authService: AuthService
  ) { 
    this.updateProj = <Proyecto>JSON.parse(JSON.stringify(this._projService.proyecto))
    this.inscritos = this.updateProj.cupo_estudiantes - this.updateProj.plazas    
  }

  ngOnInit() {
  }
  ngOnDestroy() {
    if (this.subscriptionToArrancar != null)
      this.subscriptionToArrancar.unsubscribe();
  }

  cancel() {
    this.arrancar.emit(false) //Emitter
  }

  update(form) {
    this.modalArrancar.open()
  }

  modalArrancarDismissed() {
    console.log("Modal cerrado sin acción")
  }

  modalArrancarOpened() {
    /**No hacer nada*/
  }
  modalArrancarClosed() {
    this.subscriptionToArrancar = this._projService.updateProyecto(this.updateProj, 4).subscribe((res) => {
      if (res['success'] == true) {
        this.updateProj.estado = { id: 4, nombre: "Fase de desarrollo" }
        this._projService.setProj(this.updateProj)
        this.arrancar.emit(this.updateProj) //Emitter
        alert("Proyecto arrancado con éxito")
      } else {
        this.arrancar.emit(false) //Emitter
        alert("Algo ha ido mal")
      }
    })
  }

}
