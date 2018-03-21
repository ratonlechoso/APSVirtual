import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { BsModalComponent, BsModalService } from 'ng2-bs3-modal';
import { ProyectosService } from './../../proyectos.service';
import { AuthService } from './../../../../auth.service';
import { User } from './../../../user/user';
import { Proyecto } from '../../proyecto';

@Component({
  selector: 'app-proyectos-finalizar',
  templateUrl: './proyectos-finalizar.component.html',
  styleUrls: ['./proyectos-finalizar.component.css']
})
export class ProyectosFinalizarComponent implements OnInit, OnDestroy {

  @ViewChild('modalArrancar')
  modalArrancar: BsModalComponent;

  @Input() proyecto: any;
  @Output()
  finalizar: EventEmitter<any> = new EventEmitter<any>();

  subscriptionToArrancar: Subscription

  inscritos: Number
  updateProj: any
  user: User


  constructor(private _projService: ProyectosService,
    private authService: AuthService
  ) {
    this.updateProj = <Proyecto>JSON.parse(JSON.stringify(this._projService.proyecto))
    this.inscritos = this.updateProj.cupo_estudiantes - this.updateProj.plazas
  }

  ngOnDestroy() {
    if (this.subscriptionToArrancar != null)
      this.subscriptionToArrancar.unsubscribe();
  }

  ngOnInit() {
  }
  cancel() {
    this.finalizar.emit(false) //Emitter
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
    this.subscriptionToArrancar = this._projService.updateProyecto(this.updateProj, 5).subscribe((res) => {
      if (res['success'] == true) {
        this.updateProj.estado = { id: 5, nombre: "Proyecto finalizado" }
        this._projService.setProj(this.updateProj)
        this.finalizar.emit(this.updateProj) //Emitter
        alert("Proyecto finalizado con éxito")
      } else {
        this.finalizar.emit(false) //Emitter
        alert("Algo ha ido mal")
      }
    })
  }

}
