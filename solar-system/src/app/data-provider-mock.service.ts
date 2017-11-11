import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';
import { Http, Response } from '@angular/http';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';
import 'rxjs/add/observable/of';
import { SolarLogger } from './logger.service';

import { Orbiter, Planet, ObjectType, OrbiterJSON } from './objects/index';

import * as moment from 'moment';

@Injectable()
export class DataProviderMockService {
    constructor(private http: Http, private logger: SolarLogger) {}

    public getPlanets(): Observable<any> {
        this.logger.debug('DataProviderMockService::getPlanets');
        const response = {
            data: [this.generateOrbiter('mars'), this.generateOrbiter('earth')]
        };

        return Observable.of(response);
    }

    public getSatellites(): Observable<any> {
        this.logger.debug('DataProviderMockService::getSatellites');
        const response = {
            data: [this.generateOrbiter('moon'), this.generateOrbiter('phobos'), this.generateOrbiter('deimos')]
        };

        return Observable.of(response);
    }

    public getPositions(orbiters: Map<number, Orbiter | Planet>, date: moment.Moment): Observable<any> {
        this.logger.debug('DataProviderMockService::getPositions');
        return Observable.of({
            data: [
                {
                    horizon_code: 301,
                    date: '2017-11-11T23:00:00.000Z',
                    eccentricity: 0.04866999269687138,
                    inclination: 5.037668571070342,
                    ascending_node: 139.5829339319685,
                    argument: 282.5114030614599,
                    semi_major_axis: 0.002511999950763117,
                    x: -0.002251998458107184,
                    y: 0.001106763774637738,
                    z: 0.00005442863075175116
                },
                {
                    horizon_code: 399,
                    date: '2017-11-11T23:00:00.000Z',
                    eccentricity: 0.01649261523495248,
                    inclination: 0.003984141049387106,
                    ascending_node: 198.9610459183168,
                    argument: 262.6555696555494,
                    semi_major_axis: 1.000172510777506,
                    x: 0.6422612698042578,
                    y: 0.7532156906152897,
                    z: -0.00003502262914376317
                },
                {
                    horizon_code: 401,
                    date: '2017-11-11T23:00:00.000Z',
                    eccentricity: 0.01485465242456829,
                    inclination: 25.66165835693372,
                    ascending_node: 83.51234610119825,
                    argument: 304.4917102047968,
                    semi_major_axis: 0.00006268741229385104,
                    x: -0.00005545071667825468,
                    y: 0.00001414516919184466,
                    z: 0.00002723820730446197
                },
                {
                    horizon_code: 402,
                    date: '2017-11-11T23:00:00.000Z',
                    eccentricity: 0.0002403828421091774,
                    inclination: 25.3997469922609,
                    ascending_node: 78.7529829617043,
                    argument: 323.1458619038918,
                    semi_major_axis: 0.0001568191830226637,
                    x: 0.0001421573845259679,
                    y: 7.0569095401447e-7,
                    z: -0.00006613884738485666
                },
                {
                    horizon_code: 499,
                    date: '2017-11-11T23:00:00.000Z',
                    eccentricity: 0.09346165415997672,
                    inclination: 1.848360530252722,
                    ascending_node: 49.50715683189576,
                    argument: 286.6121547916021,
                    semi_major_axis: 1.523683752766728,
                    x: -1.641062190006351,
                    y: 0.2457651980072727,
                    z: 0.04542474074766346
                }
            ]
        });
    }

    private generateOrbiter(name: string): OrbiterJSON {
        if (name === 'mars') {
            return {
                horizon_code: 499,
                center_code: 4,
                orbit_around_center_code: 500,
                type: 0,
                name: 'Mars',
                equatorial_radius: 3396.19,
                mean_radius: 3389.5,
                mass: 6.41693e23,
                density: 3.934,
                sideral_rotation_period: 1.02595676,
                sideral_orbit_period: 1.8808476,
                magnitude: -1.52,
                geometric_albedo: 0.15,
                equatorial_gravity: 3.71,
                escape_velocity: 5.03,
                color: 'c37e5a'
            };
        } else if (name === 'earth') {
            return {
                horizon_code: 399,
                center_code: 3,
                orbit_around_center_code: 500,
                type: 0,
                name: 'Earth',
                equatorial_radius: 6378.14,
                mean_radius: 6371,
                mass: 5.97219e24,
                density: 5.5134,
                sideral_rotation_period: 0.99726968,
                sideral_orbit_period: 1.0000174,
                magnitude: -3.86,
                geometric_albedo: 0.367,
                equatorial_gravity: 9.8,
                escape_velocity: 11.19,
                color: '29395d',
                texture: {
                    map: 'earthmap.jpg',
                    bumpMap: 'earthbump.jpg',
                    bumpScale: 0.05,
                    specularMap: 'earthsecular.jpg',
                    specular: 'grey'
                }
            };
        } else if (name === 'moon') {
            return {
                horizon_code: 301,
                center_code: null,
                orbit_around_center_code: 399,
                type: 1,
                name: 'Moon',
                equatorial_radius: null,
                mean_radius: 1737.5,
                mass: 7.34767e22,
                density: 3.344,
                sideral_rotation_period: null,
                sideral_orbit_period: null,
                magnitude: -12.74,
                geometric_albedo: 0.12,
                equatorial_gravity: null,
                escape_velocity: null,
                color: '827b7f'
            };
        } else if (name === 'phobos') {
            return {
                horizon_code: 401,
                center_code: null,
                orbit_around_center_code: 499,
                type: 1,
                name: 'Phobos',
                equatorial_radius: null,
                mean_radius: 11.1,
                mass: 10658500000000000,
                density: 1.872,
                sideral_rotation_period: null,
                sideral_orbit_period: null,
                magnitude: 11.4,
                geometric_albedo: 0.071,
                equatorial_gravity: null,
                escape_velocity: null
            };
        } else if (name === 'deimos') {
            return {
                horizon_code: 402,
                center_code: null,
                orbit_around_center_code: 499,
                type: 1,
                name: 'Deimos',
                equatorial_radius: null,
                mean_radius: 6.2,
                mass: 1476190000000000,
                density: 1.471,
                sideral_rotation_period: null,
                sideral_orbit_period: null,
                magnitude: 12.45,
                geometric_albedo: 0.068,
                equatorial_gravity: null,
                escape_velocity: null
            };
        } else {
            throw new Error('Cannot generate random orbiter');
        }
    }
}
