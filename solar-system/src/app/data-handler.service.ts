import { Injectable, OnDestroy } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Orbiter, SpaceObject, Sun, OrbiterJSON, Planet, ObjectType, PositionJSON } from './objects/index';
import 'rxjs/add/operator/takeWhile';
import * as moment from 'moment';
import { DataProviderService } from './data-provider.service';

export enum LoadingStep {
    SunLoaded,
    PlanetLoaded,
    SatellitesLoaded,
    PositionsLoaded
}

@Injectable()
export class DataHandlerService implements OnDestroy {
    public progression: BehaviorSubject<LoadingStep>;
    public sun: Sun;
    public date: moment.Moment;
    public orbiters: Map<number, Orbiter | Planet> = new Map();

    private alive = true;

    constructor(private provider: DataProviderService) {
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
        this.provider.getPlanets().subscribe(response => {
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
        this.provider.getSatellites().subscribe(response => {
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
            this.provider.getPositions(this.orbiters, this.date).subscribe(response => {
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
