import { Component, OnInit, ViewChild } from '@angular/core';
import { ExpService } from './../../experiencias/exp.service';
import { BsModalComponent, BsModalService } from 'ng2-bs3-modal';

@Component({
  selector: 'app-universidades-list',
  templateUrl: './universidades-list.component.html',
  styleUrls: ['./universidades-list.component.css']
})
export class UniversidadesListComponent implements OnInit {
  @ViewChild('modal')
  modalDelete: BsModalComponent;

  p:number = 1;
  page: number
  itemsPerPage: number = 25
  postsPerPage: number[] = [25, 50, 100]

  universidades: any
  universidad: any
  addMode: boolean
  constructor(
    private _expService: ExpService
  ) { 
    this.addMode = false
    this.loadUniv()
  }

  ngOnInit() {
  }

  delete(universidad) {
    console.log("El id de univ es:  ", universidad.id)
    this.universidad = universidad
    this.modalDelete.open()
  }

  updateList(event) {
    this.loadUniv()
  }

  changeEditMode(universidad) {
    universidad.editable = !universidad.editable
  }

  loadUniv() {
      this._expService.getUniversidades().subscribe((universidadesList) => {
        this.universidades = universidadesList
        this.universidades.forEach(element => {
          element.editable = false;
        });

      })
  }

  addModeEvent(event) {
    if (event)
      this.loadUniv()
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
    this._expService.deleteUniversidad(this.universidad.id).subscribe((res) => {
      if (res['success'] == true) {
        this.loadUniv()
      }
    })
  }

}
