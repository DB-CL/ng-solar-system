import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';

import { Orbiter, Planet, ObjectType, OrbiterJSON } from './objects/index';

import * as moment from 'moment';

@Injectable()
export class DataProviderMockService {
    constructor(private http: Http) {}

    public getPlanets(): Observable<any> {
        const response = {
            data: [this.generateOrbiter('mars'), this.generateOrbiter('earth')]
        };

        return Observable.of(response);
    }

    public getSatellites(): Observable<any> {
        const response = {
            data: [this.generateOrbiter('moon'), this.generateOrbiter('phobos'), this.generateOrbiter('deimos')]
        };

        return Observable.of(response);
    }

    public getPositions(orbiters: Map<number, Orbiter | Planet>, date: moment.Moment): Observable<any> {
        const codes = Array.from(orbiters.keys()).join(',');
        const dateStr = date.format('YYYYMMDD') + 'Z';
        return this.http.get(environment.API_URL + '/orbiters/' + codes + '/positions/' + dateStr).map(response => response.json());
    }

    private generateOrbiter(name?: string): OrbiterJSON {
        if (name === 'mars') {
            return {
                horizon_code: 499,
                center_code: 4,
                orbit_around_center_code: 10,
                type: ObjectType.Planet,
                name: 'Mars',
                equatorial_radius: 3396.19,
                mean_radius: 3389.5,
                mass: 0.641693 * 10e24,
                density: 3.934,
                sideral_rotation_period: 1.02595676,
                sideral_orbit_period: 1.8808476,
                magnitude: -1.52,
                geometric_albedo: 0.15,
                equatorial_gravity: 3.71,
                escape_velocity: 5.03
            };
        } else if (name === 'earth') {
            return {
                horizon_code: 399,
                center_code: 3,
                orbit_around_center_code: 10,
                type: ObjectType.Planet,
                name: 'Earth',
                equatorial_radius: 6378.14,
                mean_radius: 6371.0,
                mass: 5.97219 * 10e24,
                density: 5.5134,
                sideral_rotation_period: 0.99726968,
                sideral_orbit_period: 1.0000174,
                magnitude: -3.86,
                geometric_albedo: 0.367,
                equatorial_gravity: 9.8,
                escape_velocity: 11.19
            };
        }
    }
}
