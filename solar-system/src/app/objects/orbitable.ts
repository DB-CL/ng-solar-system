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

            const geometry = new THREE.PlaneGeometry( 500, 500 );
            let opacity = 0;
            if (this.name === 'Mars') {
                opacity = 0.2;
            }
            const materialPlane = new THREE.MeshBasicMaterial( { color: 0xff0000, opacity: opacity } );
            materialPlane.transparent = true;
            const mesh = new THREE.Mesh( geometry, materialPlane );
            container.add( mesh );

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
            
            container.rotateZ((this.argumentOfPeriapsis + this.ascendingNode) *  Math.PI / 180);
            container.rotateX(this.inclination *  Math.PI / 180);
            
            this.orbit = container;
        }
    }
}
