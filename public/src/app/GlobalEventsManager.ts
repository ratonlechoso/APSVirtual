import { Injectable } from '@angular/core'
import { BehaviorSubject } from "rxjs/BehaviorSubject"
import { Observable } from "rxjs/Observable"

@Injectable()
export class GlobalEventsManager {

    private _registeredUser: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false)
    public registeredUserObservable: Observable<boolean> = this._registeredUser.asObservable()

    constructor() {}

    registeredUser(ifShow: boolean) {
        this._registeredUser.next(ifShow)
    }

}