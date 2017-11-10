import { environment } from 'environments/environment';
import { Orbiter, OrbiterJSON } from './orbiter';

export class Planet extends Orbiter {
    public satellites: Orbiter[];

    constructor(json?: OrbiterJSON) {
        super(json);
        this.satellites = [];
    }
}
