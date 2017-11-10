import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import { Orbiter, Planet, ObjectType } from './objects/index';
import * as moment from 'moment';
import 'rxjs/add/operator/map';

@Injectable()
export class DataProviderService {
    constructor(private http: Http) {}

    public getPlanets(): Observable<any> {
        return this.http.get(environment.API_URL + '/orbiters?type=' + ObjectType.Planet).map(response => response.json());
    }

    public getSatellites(): Observable<any> {
        return this.http.get(environment.API_URL + '/orbiters?type=' + ObjectType.Satellite).map(response => response.json());
    }

    public getPositions(orbiters: Map<number, Orbiter | Planet>, date: moment.Moment): Observable<any> {
        const codes = Array.from(orbiters.keys()).join(',');
        const dateStr = date.format('YYYYMMDD') + 'Z';
        return this.http.get(environment.API_URL + '/orbiters/' + codes + '/positions/' + dateStr).map(response => response.json());
    }
}
