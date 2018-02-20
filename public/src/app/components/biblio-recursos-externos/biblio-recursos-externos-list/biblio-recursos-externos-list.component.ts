import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { User } from './../../user/user';
import { ExpService } from './../../experiencias/exp.service';
import { AuthService } from '../../../auth.service';
import { BsModalComponent, BsModalService } from 'ng2-bs3-modal';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-biblio-recursos-externos-list',
  templateUrl: './biblio-recursos-externos-list.component.html',
  styleUrls: ['./biblio-recursos-externos-list.component.css']
})
export class BiblioRecursosExternosListComponent implements OnInit {
  @ViewChild('modal')
  modalDelete: BsModalComponent;

  user: User
  subscriptionToGetUser: Subscription

  p: number = 1;
  page: number
  itemsPerPage: number = 25
  postsPerPage: number[] = [25, 50, 100]

  bibliografias: any
  bibliografia: any
  addMode: boolean


  constructor(
    private _expService: ExpService,
    private _authService: AuthService
  ) {
    this.user = new User();
        
    if (_authService.user != null) {
      this.user = _authService.user;
    } else {
      this.subscriptionToGetUser = _authService.user$.subscribe((user) => {
        this.user = user
      })
    }

    this.addMode = false
    console.log("ROL DE USUARO: ", this.user.roles)
    this.loadBib()
  } 

  ngOnInit() {
  }
  ngOnDestroy() {
    if (this.subscriptionToGetUser != null)
      this.subscriptionToGetUser.unsubscribe();
  }
  delete(bibliografia) {
    console.log("El id de univ es:  ", bibliografia.id)
    this.bibliografia = bibliografia
    this.modalDelete.open()
  }

  updateList(event) {
    this.loadBib()
  }

  changeEditMode(bibliografia) {
    bibliografia.editable = !bibliografia.editable
  }

  loadBib() {
    this._expService.getBibliografiasExt().subscribe((bibliografiaList) => {
      this.bibliografias = bibliografiaList
      this.bibliografias.forEach(element => {
        element.editable = false;
      });
    })
  }

  addModeEvent(event) {
    if (event)
      this.loadBib()
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
    this._expService.deleteBibliografiaExt(this.bibliografia.id).subscribe((res) => {
      if (res['success'] == true) {
        this.loadBib()
      }
    })
  }


}
