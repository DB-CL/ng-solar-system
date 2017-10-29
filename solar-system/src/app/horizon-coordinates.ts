import { environment } from 'environments/environment';
import * as THREE from 'three';

export class HorizonCoordinates {
    public static au = 149597870.7;

    public X: number;
    public Y: number;
    public Z: number;

    constructor(x: number, y: number, z: number) {
        this.X = x;
        this.Y = y;
        this.Z = z;
    }

    public static auToKm(au: number): number {
        return au * HorizonCoordinates.au;
    }

    public getSceneX(): number {
        return this.X * HorizonCoordinates.au / environment.distanceCoef;
    }
    public getSceneY(): number {
        return this.Y * HorizonCoordinates.au / environment.distanceCoef;
    }
    public getSceneZ(): number {
        return this.Z * HorizonCoordinates.au / environment.distanceCoef;
    }
}
