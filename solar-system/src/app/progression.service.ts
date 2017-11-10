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
export class ProgressionService implements OnDestroy {

    // Load

    // Build


    constructor(private http: Http) {
       
    }

    
   

    public ngOnDestroy() {
        this.alive = false;
    }
}
