import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';//Para manejar los verbos http

import { Experiencia } from './experiencia';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs'; //se implementan los observables para manejar las promesas

@Injectable()
export class ExpService {
  base_url = 'http://localhost:3567/api/exp';
  constructor(public _http: Http
  ) { }

  private expSource = new Subject<Experiencia>();
  exp$ = this.expSource.asObservable();
  exp:  Experiencia

  /******************* EXPERIENCIA ***************************/

  setExp(exp: Experiencia) {
    console.log("pasa por setExp")
    this.exp = exp
    this.expSource.next(exp);
    this.exp$ = this.expSource.asObservable();
  }

  getExperiencias(ambitoId): Observable<Object> {
    let headers = new Headers({ 'x-access-token': ambitoId });
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    console.log("Accediendo al endpoint GET experiencias")
    return this._http.get(`${this.base_url}/experiencias`, options).map(res => this.parseRes(res));
  }


  getImages(expId): Observable<Object> {
    let headers = new Headers({ 'x-access-token': expId });
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    console.log("Accediendo al endpoint GET images")
    return this._http.get(`${this.base_url}/images`, options).map(res => this.parseRes(res));
  }

  getExperiencia(expId): Observable<Object> {
    let headers = new Headers({ 'x-access-token': expId });
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    console.log("Accediendo al endpoint GET experiencias")
    return this._http.get(`${this.base_url}/experiencia`, options).map(res => this.parseRes(res));
  }

  createExperiencia(exp: Experiencia): Observable<Object> {
    console.log(exp)
    let body = JSON.stringify(exp);
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this._http.post(`${this.base_url}/experiencias`, body, options).map( (res) => this.parseRes(res) );
  }

  updateExperiencia(exp: Experiencia): Observable<Object> {
    console.log(exp)
    let body = JSON.stringify(exp);
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this._http.put(`${this.base_url}/experiencias`, body, options).map( (res) => this.parseRes(res) );
  }

  deleteExperiencia(id: String): Observable<Object> {
    let headers = new Headers({ 'x-access-token': id });
    let options = new RequestOptions({ headers: headers });
    return this._http.delete(`${this.base_url}/experiencias/`, options).map( (res) => this.parseRes(res) );
  }

  /************************ AMBITOS *******************************/

  getAmbitos(): Observable<Object> {
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    console.log("Accediendo al endpoint GET ambitos")
    return this._http.get(`${this.base_url}/ambitos`, options).map(res => this.parseRes(res));
  }

  /************************ ESPECIALIDADES *******************************/

  getEspecialidades(id): Observable<Object> {
    let headers = new Headers({ 'x-access-token': id });
    headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    console.log("Accediendo al endpoint GET especialidades")
    return this._http.get(`${this.base_url}/especialidades`, options).map(res => this.parseRes(res));
  }

  addEspecialidad(espec: any): Observable<Object> {
    let body = JSON.stringify(espec);
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this._http.post(`${this.base_url}/especialidad`, body, options).map( (res) => this.parseRes(res) );
  }

  updateEspecialidad(espec: any): Observable<Object> {
    let body = JSON.stringify(espec);
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this._http.put(`${this.base_url}/especialidad`, body, options).map( (res) => this.parseRes(res) );
  }

  deleteEspecialidad(id: String): Observable<Object> {
    let headers = new Headers({ 'x-access-token': id });
    let options = new RequestOptions({ headers: headers });
    return this._http.delete(`${this.base_url}/especialidad/`, options).map( (res) => this.parseRes(res) );
  }

   /******************* UNIVERSIDAD ***************************/

   getUniversidades(): Observable<Object> {
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    console.log("Accediendo al endpoint GET Universidades")
    return this._http.get(`${this.base_url}/universidades`, options).map(res => this.parseRes(res));
  }

  addUniversidad(univ: any): Observable<Object> {
    let body = JSON.stringify(univ);
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this._http.post(`${this.base_url}/universidad`, body, options).map( (res) => this.parseRes(res) );
  }


  updateUniversidad(univ: any): Observable<Object> {
    let body = JSON.stringify(univ);
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this._http.put(`${this.base_url}/universidad`, body, options).map( (res) => this.parseRes(res) );
  }

  deleteUniversidad(id: String): Observable<Object> {
    let headers = new Headers({ 'x-access-token': id });
    let options = new RequestOptions({ headers: headers });
    return this._http.delete(`${this.base_url}/universidad/`, options).map( (res) => this.parseRes(res) );
  }

  /**************** BIBLIOGRAFIA EXTERNAS ****************************/

  getBibliografiasExt(): Observable<Object> {
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    console.log("Accediendo al endpoint GET Universidades")
    return this._http.get(`${this.base_url}/bibliografiaExt`, options).map(res => this.parseRes(res));
  }

  addBibliografiaExt(bib: any): Observable<Object> {
    let body = JSON.stringify(bib);
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this._http.post(`${this.base_url}/bibliografiaExt`, body, options).map( (res) => this.parseRes(res) );
  }


  updateBibliografiaExt(bib: any): Observable<Object> {
    let body = JSON.stringify(bib);
    let headers = new Headers();
		headers.append('Content-Type', 'application/json');
    let options = new RequestOptions({ headers: headers });
    return this._http.put(`${this.base_url}/bibliografiaExt`, body, options).map( (res) => this.parseRes(res) );
  }

  deleteBibliografiaExt(id: String): Observable<Object> {
    let headers = new Headers({ 'x-access-token': id });
    let options = new RequestOptions({ headers: headers });
    return this._http.delete(`${this.base_url}/bibliografiaExt/`, options).map( (res) => this.parseRes(res) );
  }


  /******************* AUXILIARES ************************************/

  parseRes(res) {
    let body = JSON.parse(res['_body']);
    return body;
  }


}