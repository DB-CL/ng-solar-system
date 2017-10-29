import { environment } from 'environments/environment';
import { Planet } from './planet';
import { HorizonCoordinates } from '../horizon-coordinates';
import * as THREE from 'three';

export class Mars extends Planet {

    constructor() {
        super();
        this.radius = 3396;
        this.coordinates = new HorizonCoordinates(-1.581623632242576E+00, 5.186611809594079E-01, 4.968466980629347E-02);
        this.texture = 'assets/sun.jpg';
        this.name = 'Mars';
        this.build();
    }
}
