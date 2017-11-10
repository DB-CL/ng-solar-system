import { environment } from 'environments/environment';
import { SpaceObject } from './spaceobject';
import { HorizonCoordinates } from '../horizon-coordinates';

import * as THREE from 'three';

export interface OrbiterJSON {
    horizon_code: number;
    center_code: number;
    orbit_around_center_code: number;
    type: number;
    name: string;
    equatorial_radius: number;
    mean_radius: number;
    mass: number;
    density: number;
    sideral_rotation_period: number;
    sideral_orbit_period: number;
    magnitude: number;
    geometric_albedo: number;
    equatorial_gravity: number;
    escape_velocity: number;
}

export interface PositionJSON {
    horizon_code: number;
    date: string;
    eccentricity: number;
    inclination: number;
    ascending_node: number;
    argument: number;
    semi_major_axis: number;
    x: number;
    y: number;
    z: number;
}

export class Orbiter extends SpaceObject {
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

    public parent: SpaceObject;

    constructor(json?: OrbiterJSON) {
        super();
        if (json) {
            this.fromJSON(json);
        }
    }
// https://www.clicktorelease.com/code/THREE.MeshLine/demo/index.html
    public fromJSON(json: OrbiterJSON) {
        this.code = json.horizon_code;
        this.barycenterCode = json.center_code;
        this.type = json.type; // if I did good, the types should be corresponding
        this.name = json.name;
        this.radius = json.mean_radius !== undefined ? json.mean_radius : json.equatorial_radius;
        this.mass = json.mass;
        this.density = json.density;
        this.sideralRotationPeriod = json.sideral_rotation_period;
        this.sideralOrbitPeriod = json.sideral_orbit_period;
        this.magnitude = json.magnitude;
        this.geometricAlbedo = json.geometric_albedo;
        this.equatorialGravity = json.equatorial_gravity;
        this.escapeVelocity = json.escape_velocity;
    }

    public positionFromJSON(json: PositionJSON) {
        this.eccentricity = json.eccentricity;
        this.inclination = json.inclination;
        this.ascendingNode = json.ascending_node;
        this.argumentOfPeriapsis = json.argument;
        this.majorAxis = json.semi_major_axis;
        this.coordinates = new HorizonCoordinates(json.x, json.y, json.z);
    }

    public buildOrbit3D(): void {
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

            const line = new THREE.Line(ellipseGeometry, material);

            container.add(line);

            container.rotateZ(this.ascendingNode * Math.PI / 180); // rotate the OM first
            container.rotateX(this.inclination * Math.PI / 180); // then the inclination
            container.rotateZ(this.argumentOfPeriapsis * Math.PI / 180); // then catch up the X alignment with W
            this.orbit = container;
        }
    }
}
