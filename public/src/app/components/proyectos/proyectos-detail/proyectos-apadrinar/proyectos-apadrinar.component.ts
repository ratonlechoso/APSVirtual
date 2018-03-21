import { Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { BsModalComponent, BsModalService } from 'ng2-bs3-modal';
import { ProyectosService } from './../../proyectos.service';
import { ExpService } from '../../../experiencias/exp.service'
import { AuthService } from './../../../../auth.service';
import { User } from './../../../user/user';
import { Proyecto } from '../../proyecto';

@Component({
  selector: 'app-proyectos-apadrinar',
  templateUrl: './proyectos-apadrinar.component.html',
  styleUrls: ['./proyectos-apadrinar.component.css']
})
export class ProyectosApadrinarComponent implements OnInit , OnDestroy {
  @ViewChild('modalApadrinar')
  modalApadrinar: BsModalComponent;

  @Input() proyecto: any; 
  @Output() 
  apadrinar: EventEmitter<any> = new EventEmitter<any>();

  myForm: FormGroup

  subscriptionToApadrinarProj: Subscription

  updateProj: any
  user: User
  ambitos
  especialidades
  universidades
  updateProjAmbito //Selected value para el select
  updateProjEspecialidad //Selected value para el select
  updateProjUniversidad //Selected value para el select
  message: String


  constructor(
    private _projService: ProyectosService,
    private _expService: ExpService,
    private _fb: FormBuilder,
    private authService: AuthService
  ) { 
    this.updateProj = <Proyecto>JSON.parse(JSON.stringify(this._projService.proyecto))
    this.user = this.authService.user;
    this.authService.user$.subscribe((user) => {
      this.user = user;
    });

    let coordinador = {
      nombre: this.user.first_name + " " + this.user.last_name,
      email: this.user.email
    }
    this.updateProj.coordinadores = []
    this.updateProj.cupo_estudiantes = 0
    this.updateProj.coordinadores.push(coordinador)

    this.updateProj.coord
    console.log("updateProj: ", this.updateProj)
    _expService.getAmbitos().subscribe((ambitosList) => {
      this.ambitos = ambitosList
      this.ambitos.forEach(element => {
        if (element.nombre == this.updateProj.ambito) {
          this.updateProjAmbito = element
        }
      })
      _expService.getEspecialidades(this.updateProjAmbito.id).subscribe((especialidadesList) => {
        this.especialidades = especialidadesList
        this.especialidades.forEach(element => {
          if (element.nombre == this.updateProj.especialidad) {
            this.updateProjEspecialidad = element
          }
        })
      })
    })
    _expService.getUniversidades().subscribe((universidadesList) => {
      this.universidades = universidadesList
      this.universidades.forEach(element => {
        if (element.nombre == this.updateProj.universidad)
          this.updateProjUniversidad = element
      })
    })

    this.myForm = _fb.group({
      'ambito': [this.updateProjAmbito, Validators.required],
      'especialidad': [null, Validators.required],
      'universidad': [null, Validators.required],
      // 'cupo_estudiantes' : [null, [Validators.required, Validators.min(1), Validators.max(100)]],
      'coordinadores': this._fb.array([
        this.initCoordinador(),
      ]),

      //FORMATEAR FECHA A UN SOLO CAMPO
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    if (this.subscriptionToApadrinarProj != null)
      this.subscriptionToApadrinarProj.unsubscribe();
  }


  initCoordinador() {
    return this._fb.group({
      'nombre': null,
      'email': null
    })
  }

  addCoordinador() {
    //console.log("Despues de borrar el cordinador: ", JSON.stringify(this.updateExp.coordinadores))
    const control = <FormArray>this.myForm.controls['coordinadores'];
    this.updateProj.coordinadores.push({ id: 0, nombre: '', email: '' })
    control.push(this.initCoordinador());
  }

  removeCoordinador(i: number, email) {
    const control = <FormArray>this.myForm.controls['coordinadores'];
    control.removeAt(i);
    this.updateProj.coordinadores = this.updateProj.coordinadores.filter(function (el) {
      return el.email !== email.value;
    });
  }

  onChangeAmbito(value) {
    console.log("pasa por change con indice ", parseInt(value))
    let idx = parseInt(value)
    //if (idx == 0) return
    this._expService.getEspecialidades(idx + 1).subscribe((especialidadesList) => {
      console.log("Reload Especialidades")
      this.especialidades = especialidadesList
      this.updateProjEspecialidad = ""
    })
  }

  cancel () {
    console.log("pasa1")
    this.apadrinar.emit(false) //Emitter
  }

  update (form) {
    console.log("Formulario ", form)
    this.modalApadrinar.open()
  }

  modalApadrinarDismissed() {
    console.log("Modal cerrado sin acción")
  }

  modalApadrinarOpened() {
    /**No hacer nada*/
  }
  modalApadrinarClosed() {
    this.updateProj.especialidad = this.updateProjEspecialidad
    this.updateProj.universidad = this.updateProjUniversidad
    console.log("Apadrinar", this.updateProj)
    console.log("Proyecto en Detail", this.proyecto)

     this.subscriptionToApadrinarProj = this._projService.updateProyecto(this.updateProj, 1).subscribe((res) => {
      if (res['success'] == true) {
        this.updateProj.estado = {id: 2, nombre: "apadrinado"}
        this.apadrinar.emit(this.updateProj) //Emitter
        alert("proyecto apadrinado")
      } else {
        this.apadrinar.emit(false) //Emitter
        alert("Algo ha ido mal")
      }
    })
  }
}
