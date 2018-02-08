import { Injectable } from '@angular/core';
import { Http, Response, Headers, RequestOptions } from '@angular/http';
import { Observable } from 'rxjs/observable';
import { User } from './components/user/user';
import { Subject } from 'rxjs/Subject';
import 'rxjs/add/operator/map';

@Injectable()
export class CommonService {
    private base_url = 'http://localhost:3567/api/common';

    constructor(public _http: Http) { }

    contactEmail(params) : Observable<boolean>  {
        let body = JSON.stringify(params);
        let headers = new Headers();
        headers.append('Content-Type', 'application/json');
        let options = new RequestOptions({ headers: headers });
        return this._http.post(`${this.base_url}/contact-email`, body, options).map(res => this.parseRes(res));
    }

    parseRes(res) {
        console.log(res)
        let body = JSON.parse(res['_body']);
        return body;
    }

}
 