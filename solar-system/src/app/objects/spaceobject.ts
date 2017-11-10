import { environment } from 'environments/environment';
import { HorizonCoordinates } from '../horizon-coordinates';
import * as THREE from 'three';

export enum ObjectType {
    Planet = 0,
    Satellite = 1,
    Comet = 2,
    Asteroid = 3,
    Sun = 4
}

export class SpaceObject {
    public name: string;
    public radius: number;
    protected texture: string;
    public coordinates: HorizonCoordinates;
    public mesh: THREE.Mesh;
    public light: THREE.SpotLight;
    public type: ObjectType;
    public code: number; // code in Horizon JPL (sort of NASA id)
    public barycenterCode: number; // Horizon JPL code of the barycenter
    public mass: number;
    public density: number;
    public sideralRotationPeriod: number;
    public sideralOrbitPeriod: number;
    public magnitude: number;
    public geometricAlbedo: number;
    public equatorialGravity: number;
    public escapeVelocity: number;

    constructor() {}

    public build3D() {
        console.log('Build3D', this.name);
        const geometry = new THREE.SphereGeometry(this.radius / environment.distanceCoef, 100, 100);

        const textureLoader = new THREE.TextureLoader();

        const material = new THREE.MeshPhongMaterial({
            map: textureLoader.load(this.texture)
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.overdraw = true;
        mesh.castShadow = true;

        mesh.position.set(this.coordinates.getSceneX(), this.coordinates.getSceneY(), this.coordinates.getSceneZ());

        if (this.name !== undefined) {
            const canvas = document.createElement('canvas');
            canvas.width = 128;
            canvas.height = 128;
            const ctx = canvas.getContext('2d');
            ctx.font = '30px Arial';
            ctx.fillStyle = 'steelblue';
            ctx.textAlign = 'center';
            ctx.fillText(this.name, 64, 64);
            const tex = new THREE.Texture(canvas);
            tex.needsUpdate = true;
            const spriteMat = new THREE.SpriteMaterial({
                map: tex
            });
            const sprite = new THREE.Sprite(spriteMat);
            sprite.position.y = this.radius / environment.distanceCoef * 1.1;

            mesh.add(sprite);
        } else {
            console.log('NAME UNDEFINED ...');
        }

        this.mesh = mesh;

        this.addLight();
    }

    private addLight() {
        // const spotLight = new THREE.SpotLight(0xffffff);
        // this.light = spotLight;

        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 5, 5);
        light.castShadow = true;
        light.shadow.camera.near = 0.01;
        light.shadow.camera.far = 15;
        light.shadow.camera.fov = 45;
        light.shadow.camera.left = -1;
        light.shadow.camera.right = 1;
        light.shadow.camera.top = 1;
        light.shadow.camera.bottom = -1;
        light.shadow.bias = 0.001;
        light.shadow.darkness = 0.2;
        light.shadow.mapWidth = 1024;
        light.shadow.mapHeight = 1024;
        this.light = light;
    }

    public add(object: any): void {
        this.mesh.add(object);
    }
}
