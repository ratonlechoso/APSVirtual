import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';//Para manejar los verbos http

import { Proyecto } from './proyecto';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';
import { Observable } from 'rxjs'; //se implementan los observables para manejar las promesas

@Injectable()

export class ProyectosService {
    //base_url = 'http://localhost:3567/api/proj';
    base_url = 'api/proj';
    constructor(public _http: Http
    ) { }

    private proyectoSource = new Subject<Proyecto>();
    proyecto$ = this.proyectoSource.asObservable();
    proyecto: Proyecto

    public proyectos: Proyecto[]
    public sCriteria: String
  

    /******************* PROYECTO ***************************/

    setProj(proyecto: Proyecto) {
        console.log("pasa por setProj")
        this.proyecto = proyecto
        this.proyectoSource.next(proyecto);
        this.proyecto$ = this.proyectoSource.asObservable();
    }

    getProyectos( id): Observable<Object> {
        let headers = new Headers({ 'x-access-token': JSON.parse(JSON.stringify(id)) });
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        console.log("Accediendo al endpoint GET proyectos")
        return this._http.get(`${this.base_url}/proyectos`, options).map(res => this.parseRes(res));
    }

    searchProyectos(proj): Observable<Object> {
        console.log("searchProyectos: ", proj)
        let body = JSON.stringify(proj)
        let headers = new Headers()
        headers.append('Content-Type', 'application/json')
        let options = new RequestOptions({ headers: headers })
        return this._http.post(`${this.base_url}/search_proj`, body, options).map(res => this.parseRes(res));
      }
    

    getProyectosByEstado(estadoId): Observable<Object> {
        let headers = new Headers({ 'x-access-token': estadoId });
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        console.log("Accediendo al endpoint GET proyectos")
        return this._http.get(`${this.base_url}/proyectos`, options).map(res => this.parseRes(res));
    }

    getImages(id): Observable<Object> {
        let headers = new Headers({ 'x-access-token': id });
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        console.log("Accediendo al endpoint GET images")
        return this._http.get(`${this.base_url}/images`, options).map(res => this.parseRes(res));
    }

    getProyecto(id): Observable<Object> {
        let headers = new Headers({ 'x-access-token': id });
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        console.log("Accediendo al endpoint GET Proyecto")
        return this._http.get(`${this.base_url}/proyecto`, options).map(res => this.parseRes(res));
    }

    createProyecto(proyecto: Proyecto): Observable<Object> {
        console.log(proyecto)
        let body = JSON.stringify(proyecto);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return this._http.post(`${this.base_url}/proyectos`, body, options).map((res) => this.parseRes(res));
    }

    updateProyecto(proyecto: Proyecto, accion): Observable<Object> {
        console.log(proyecto)
        let body = JSON.stringify(proyecto);
        let headers = new Headers();
        headers.append('x-access-upd-action', accion )                 //Codifico el "0" para la acción de actualizar generico
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return this._http.put(`${this.base_url}/proyectos`, body, options).map((res) => this.parseRes(res));
    }

    deleteProyecto(id): Observable<Object> {
        let headers = new Headers({ 'x-access-token': id });
        let options = new RequestOptions({ headers: headers });
        return this._http.delete(`${this.base_url}/proyectos/`, options).map((res) => this.parseRes(res));
    }


    /******************* ESTADOS ***************************************/
    getEstados(): Observable<Object> {
        let headers = new Headers();
            headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        console.log("Accediendo al endpoint GET ambitos")
        return this._http.get(`${this.base_url}/estados`, options).map(res => this.parseRes(res));
      }
      
    /******************* PROVINCIAS ***************************************/    
    getProvincias(): Observable<Object> {
        let headers = new Headers();
            headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        console.log("Accediendo al endpoint GET provincias")
        return this._http.get(`${this.base_url}/provincias`, options).map(res => this.parseRes(res));
      }
    /******************* AUXILIARES ************************************/

    parseRes(res) {
        let body = JSON.parse(res['_body']);
        return body;
    }

}
