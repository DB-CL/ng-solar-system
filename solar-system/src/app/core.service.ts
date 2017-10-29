import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

import { Planet, Sun, Mars, Earth } from './planets/index';

import * as THREE from 'three';
declare const require: (moduleId: string) => any;
const OrbitControls = require('three-orbit-controls')(THREE);

@Injectable()
export class CoreService {
    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    private scaleVector: THREE.Vector3;
    public planets: Map<string, Planet>;

    public controls: any;

    constructor() {
        this.scaleVector = new THREE.Vector3();
        this.planets = new Map();
    }

    public init(): void {
        this.buildScene();
        this.buildPlanets();
        this.centerCameraOn('Earth');
    }

    private buildScene() {
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0xffffff);
        // this.scene.fog = new THREE.FogExp2(0xcccccc, 0.002);

        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.setSize(window.innerWidth, window.innerHeight);

        const container = document.getElementById('container');
        container.appendChild(this.renderer.domElement);

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.0001, 10000);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);

        // enable animation loop when using damping or autorotation
        this.controls.enableDamping = true;
        this.controls.dampingFactor = 0.25;

        this.controls.enableZoom = true;

        const ambLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambLight);

    }

    private centerCameraOn(planetName: string) {
        const planet = this.planets.get(planetName);
        // this.camera.lookAt(planet.mesh.position);
        this.controls.target.set(planet.coordinates.getSceneX(), planet.coordinates.getSceneY(), planet.coordinates.getSceneZ());

        this.camera.position.x = planet.mesh.position.x;
        this.camera.position.y = planet.mesh.position.y;
        this.camera.position.z = planet.mesh.position.z + 3 * planet.radius / environment.distanceCoef;
        /*
        this.camera.position.x = 150;
        this.camera.position.y = 150;
        this.camera.position.z = 150;
        */
    }

    private buildPlanets() {
        this.addPlanet(new Sun());
        this.addPlanet(new Mars());
        this.addPlanet(new Earth());
    }

    private addPlanet(planet: Planet) {
        this.scene.add(planet.mesh);
        this.scene.add(planet.light);
        this.planets.set(planet.name, planet);
        if (planet.orbit !== undefined) {
            this.scene.add(planet.orbit);
        }
    }

    private render() {
        // const currentTime = Date.now();
        // this.uniforms.iGlobalTime.value = (currentTime - this.startTime) * 0.001;
        this.renderer.render(this.scene, this.camera);
    }

    public animate() {
       requestAnimationFrame(() => this.animate());
        this.planets.forEach(planet => {
            const scaleFactor = 8;
            const sprite = planet.mesh.children[0];
            const scale = this.scaleVector.subVectors(planet.mesh.position, this.camera.position).length() / scaleFactor;
            sprite.scale.set(scale, scale, 1);
        });

        this.render();
    }

    public onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
}
