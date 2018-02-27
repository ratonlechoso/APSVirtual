import { Component, OnInit, ViewChild } from '@angular/core';
import { ExpService } from './../../experiencias/exp.service';
import { BsModalComponent, BsModalService } from 'ng2-bs3-modal';

@Component({
  selector: 'app-especialidades-list',
  templateUrl: './especialidades-list.component.html',
  styleUrls: ['./especialidades-list.component.css']
})
export class EspecialidadesListComponent implements OnInit {
  @ViewChild('modal')
  modalDelete: BsModalComponent;

  p: number = 1;
  page: number
  itemsPerPage: number = 25
  postsPerPage: number[] = [25, 50, 100]

  especialidades: any
  especialidad: any
  ambitos: any
  addMode: boolean
  sortingField: string
  ascending: boolean
  nombreAsc: boolean
  nombreDesc: boolean
  nombreAmbitoAsc: boolean
  nombreAmbitoDesc: boolean
  query:string

  constructor(
    private _expService: ExpService
  ) {
    this.addMode = false
    this.loadEspec()
    this.sortingField="nombre"
    this.ascending = true
    this.nombreAsc = true
    this.query=""
  }

  ngOnInit() {
  }

  delete(especialidad) {
    console.log("El id de exp es:  ", especialidad.id)
    this.especialidad = especialidad
    this.modalDelete.open()
  }

  updateList(event) {
    this.loadEspec()
  }

  changeEditMode(especialidad) {
    especialidad.editable = !especialidad.editable
  }

  loadEspec() {
    this._expService.getAmbitos().subscribe((ambitosList) => {
      this.ambitos = ambitosList
      this._expService.getEspecialidades(0).subscribe((especialidadesList) => {
        this.especialidades = especialidadesList
        this.especialidades.forEach(element => {
          if (element.ambito_id >=1 && element.ambito_id <= 5) //Validar ambito
            element.ambito_nombre = this.ambitos[element.ambito_id-1].nombre
          element.editable = false;
        });
      })
    })
  }

  orderBy (field: string, order: boolean) {
    this.sortingField = field
    this.ascending = order
    this.nombreAmbitoAsc = this.nombreAmbitoDesc = this.nombreAsc = this.nombreDesc = false
    switch (field) {
      case 'nombre':
        (this.ascending? this.nombreAsc = true: this.nombreDesc = true)
        break;
      case 'ambito_nombre':
        (this.ascending? this.nombreAmbitoAsc = true: this.nombreAmbitoDesc = true)
      break;  
    
      default:
        break;
    }

  }

  addModeEvent(event) {
    if (event)
      this.loadEspec()
    this.changeAddMode()
  }

  changeAddMode() {
    this.addMode = !this.addMode
  }

  pageChanged(event) {
    this.page = event.page;
    this.itemsPerPage = event.itemsPerPage
  }

  modalDeleteDismissed() {
    console.log("Modal cerrado sin acción")
  }
  modalDeleteOpened() {
    /**No hacer nada*/
  }
  modalDeleteClosed() {
    this._expService.deleteEspecialidad(this.especialidad.id).subscribe((res) => {
      if (res['success'] == true) {
        this.loadEspec()
      }
    })
  }


}

