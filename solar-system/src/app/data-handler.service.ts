import { Injectable, OnDestroy } from '@angular/core';
import { environment } from 'environments/environment';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import 'rxjs/add/operator/takeWhile';
import * as moment from 'moment';
import { SolarLogger } from './logger.service';

import { Orbiter, SpaceObject, Sun, OrbiterJSON, Planet, ObjectType, PositionJSON } from './objects/index';
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

    constructor(private provider: DataProviderService, private logger: SolarLogger) {
        this.sun = new Sun();
        this.progression = new BehaviorSubject(LoadingStep.SunLoaded);
        this.date = moment();
    }

    public initialize() {
        this.logger.debug('DataHandlerService::initialize');
        this.progression.takeWhile(() => this.alive).subscribe(progression => {
            if (progression === LoadingStep.SunLoaded) {
                this.logger.debug('DataHandlerService::initialize - progression sun loaded');
                this.getPlanets();
            } else if (progression === LoadingStep.PlanetLoaded) {
                this.logger.debug('DataHandlerService::initialize - progression planets loaded');
                this.getSatellites();
            } else if (progression === LoadingStep.SatellitesLoaded) {
                this.logger.debug('DataHandlerService::initialize - progression satellites loaded');
                this.getPositions();
            }
        });
    }

    public getPlanets() {
        this.logger.debug('DataHandlerService::getPlanets');
        this.provider.getPlanets().subscribe(response => {
            this.logger.debug('DataHandlerService::getPlanets - response has arrived');
            const planets = response.data;
            if (planets !== undefined) {
                planets.forEach((planetJSON: OrbiterJSON) => {
                    const planet = new Planet(planetJSON);
                    this.sun.planets.push(planet);
                    planet.parent = this.sun;
                    this.orbiters.set(planet.code, planet);
                });
            } else {
                this.logger.warn('DataHandlerService::getPlanets - response.data is undefined');
            }
            this.progression.next(LoadingStep.PlanetLoaded);
        });
    }

    public getSatellites() {
        this.logger.debug('DataHandlerService::getSatellites');
        this.provider.getSatellites().subscribe(response => {
            this.logger.debug('DataHandlerService::getSatellites - response has arrived');
            const satellites = response.data;
            if (satellites !== undefined) {
                satellites.forEach((satJSON: OrbiterJSON) => {
                    const sat = new Orbiter(satJSON);
                    this.orbiters.set(sat.code, sat);
                    const planet: Planet = this.orbiters.get(satJSON.orbit_around_center_code) as Planet;
                    planet.satellites.push(sat);
                    sat.parent = planet;
                });
            } else {
                this.logger.warn('DataHandlerService::getSatellites - response.data is undefined');
            }
            this.progression.next(LoadingStep.SatellitesLoaded);
        });
    }

    public getPositions() {
        this.logger.debug('DataHandlerService::getPositions');
        if (this.orbiters.size > 0) {
            const codes = Array.from(this.orbiters.keys()).join(',');
            const dateStr = this.date.format('YYYYMMDD') + 'Z';
            this.provider.getPositions(this.orbiters, this.date).subscribe(response => {
                this.logger.debug('DataHandlerService::getPositions - response has arrived');
                const positions = response.data;
                if (positions !== undefined) {
                    positions.forEach((positionJSON: PositionJSON) => {
                        const orbiter = this.orbiters.get(positionJSON.horizon_code);
                        orbiter.positionFromJSON(positionJSON);
                    });
                } else {
                    this.logger.warn('DataHandlerService::getPositions - response.data is undefined');
                }
                this.progression.next(LoadingStep.PositionsLoaded);
            });
        }
    }

    public ngOnDestroy() {
        this.logger.debug('DataHandlerService::ngOnDestroy');
        this.alive = false;
    }
}
