import { environment } from 'environments/environment';
import { SpaceObject } from './spaceobject';
import { HorizonCoordinates } from '../horizon-coordinates';

import * as THREE from 'three';

export class Orbitable extends SpaceObject {
    public orbit: THREE.Object3D;

    public orbitColor = 0x000000;
    public ellipseNumberOfPoints = 2000;

    public argumentOfPeriapsis: number;
    public ascendingNode: number;
    public inclination: number;
    public eccentricity: number;
    public majorAxis: number;
    public trueAnomaly: number;
    public meanAnomaly: number;

    constructor() {
        super();
    }

    public buildOrbit(): void {
        if (this.eccentricity !== undefined && this.majorAxis !== undefined) {
            const container = new THREE.Object3D();
            /*
            const geometry = new THREE.PlaneGeometry(500, 500);
            const materialPlane = new THREE.MeshBasicMaterial({ opacity: 0 });
            materialPlane.transparent = true;
            const mesh = new THREE.Mesh(geometry, materialPlane);
            container.add(mesh);
            */
            const ea = this.eccentricity * this.majorAxis;
            const rx = this.majorAxis;
            const ry = this.majorAxis * Math.sqrt(1 - this.eccentricity * this.eccentricity);
            const coef = HorizonCoordinates.au / environment.distanceCoef;

            const material = new THREE.LineBasicMaterial({ color: this.orbitColor, opacity: 1 });
            const ellipse = new THREE.EllipseCurve(-ea * coef, 0, rx * coef, ry * coef, 0, 2.0 * Math.PI, false);
            const ellipsePath = new THREE.CurvePath();
            ellipsePath.add(ellipse);

            const ellipseGeometry = ellipsePath.createPointsGeometry(this.ellipseNumberOfPoints);
            ellipseGeometry.computeTangents();

            const line = new THREE.Line(ellipseGeometry, material);

            container.add(line);

            container.rotateZ(this.ascendingNode * Math.PI / 180); // rotate the OM first
            container.rotateX(this.inclination * Math.PI / 180); // then the inclination
            container.rotateZ(this.argumentOfPeriapsis * Math.PI / 180); // then catch up the X alignment with W
            this.orbit = container;
        }
    }
}
