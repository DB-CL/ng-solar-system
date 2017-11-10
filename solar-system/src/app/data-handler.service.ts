import { Injectable, OnDestroy } from '@angular/core';
import { environment } from 'environments/environment';
import { Http } from '@angular/http';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Orbiter, SpaceObject, Sun, OrbiterJSON, Planet, ObjectType, PositionJSON } from './objects/index';
import 'rxjs/add/operator/takeWhile';
import * as moment from 'moment';

export enum LoadingStep {
    SunLoaded,
    PlanetLoaded,
    SatellitesLoaded,
    PositionsLoaded
}

@Injectable()
export class DataHandlerService implements OnDestroy {
    // progression as a behavior subject ?

    public progression: BehaviorSubject<LoadingStep>;
    public sun: Sun;
    private alive = true;

    public date: moment.Moment;

    // Dictionnary, if we need an object later
    public orbiters: Map<number, Orbiter | Planet> = new Map();

    constructor(private http: Http) {
        this.sun = new Sun();
        this.progression = new BehaviorSubject(LoadingStep.SunLoaded);
        this.date = moment();
    }

    public initialize() {
        this.progression.takeWhile(() => this.alive).subscribe(progression => {
            if (progression === LoadingStep.SunLoaded) {
                this.getPlanets();
            } else if (progression === LoadingStep.PlanetLoaded) {
                this.getSatellites();
            } else if (progression === LoadingStep.SatellitesLoaded) {
                this.getPositions();
            }
        });
    }

    public getPlanets() {
        this.http.get(environment.API_URL + '/orbiters?type=' + ObjectType.Planet).subscribe(response => {
            const planets = response.json().data;
            if (planets !== undefined) {
                planets.forEach((planetJSON: OrbiterJSON) => {
                    const planet = new Planet(planetJSON);
                    this.sun.planets.push(planet);
                    planet.parent = this.sun;
                    this.orbiters.set(planet.code, planet);
                });
            }
            this.progression.next(LoadingStep.PlanetLoaded);
        });
    }

    public getSatellites() {
        this.http.get(environment.API_URL + '/orbiters?type=' + ObjectType.Satellite).subscribe(response => {
            const satellites = response.json().data;
            if (satellites !== undefined) {
                satellites.forEach((satJSON: OrbiterJSON) => {
                    const sat = new Orbiter(satJSON);
                    this.orbiters.set(sat.code, sat);
                    const planet: Planet = this.orbiters.get(satJSON.orbit_around_center_code) as Planet;
                    planet.satellites.push(sat);
                    sat.parent = planet;
                });
            }
            this.progression.next(LoadingStep.SatellitesLoaded);
        });
    }

    public getPositions() {
        if (this.orbiters.size > 0) {
            const codes = Array.from(this.orbiters.keys()).join(',');
            const dateStr = this.date.format('YYYYMMDD') + 'Z';
            this.http.get(environment.API_URL + '/orbiters/' + codes + '/positions/' + dateStr).subscribe(response => {
                const positions = response.json().data;
                if (positions !== undefined) {
                    positions.forEach((positionJSON: PositionJSON) => {
                        const orbiter = this.orbiters.get(positionJSON.horizon_code);
                        orbiter.positionFromJSON(positionJSON);
                    });
                }
                this.progression.next(LoadingStep.PositionsLoaded);
            });
        }
    }

    public ngOnDestroy() {
        this.alive = false;
    }
}
