import { Injectable, OnDestroy } from '@angular/core';
import { environment } from 'environments/environment';

import { DataHandlerService, LoadingStep } from './data-handler.service';
import { Orbiter, Sun, SpaceObject } from './objects/index';

import 'rxjs/add/operator/takeWhile';
import * as THREE from 'three';
declare const require: (moduleId: string) => any;
const OrbitControls = require('three-orbit-controls')(THREE);

@Injectable()
export class CoreService implements OnDestroy {
    private scene: THREE.Scene;
    private renderer: THREE.WebGLRenderer;
    private camera: THREE.PerspectiveCamera;
    private scaleVector: THREE.Vector3;
    private alive: boolean;

    public controls: any;

    public sun = new Sun();
    public spaceObjects: Map<string, SpaceObject>; //  name, object

    constructor(private datahandler: DataHandlerService) {
        this.scaleVector = new THREE.Vector3();
        this.spaceObjects = new Map();
        this.alive = true;
    }

    public init(): void {
        this.buildScene();
        this.buildAxes(100);

        this.datahandler.progression.takeWhile(() => this.alive).subscribe(progression => {
            if (progression === LoadingStep.PositionsLoaded) {
                this.buildObjects();
                this.centerCameraOn('Sun');
            }
        });

        this.datahandler.initialize();
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

        this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.0001, 100000);

        this.controls = new OrbitControls(this.camera, this.renderer.domElement);
        this.controls.enableKeys = false;

        // enable animation loop when using damping or autorotation
        // this.controls.enableDamping = true;
        // this.controls.dampingFactor = 0.25;
        // THREE.SceneUtils.traverseHierarchy( object, function ( object ) { object.visible = false; } );
        // myObject3D.traverse( function ( object ) { object.visible = false; } );
        this.controls.enableZoom = true;

        const ambLight = new THREE.AmbientLight(0x404040);
        this.scene.add(ambLight);
    }

    private buildObjects() {
        const sun = this.datahandler.sun;
        sun.build3D();
        this.spaceObjects.set('Sun', sun);

        this.datahandler.sun.planets.forEach(planet => {
            planet.build3D();
            planet.buildOrbit3D();
            this.spaceObjects.set(planet.name, planet);
            planet.satellites.forEach(moon => {
                moon.build3D();
                moon.buildOrbit3D();
                this.spaceObjects.set(moon.name, moon);
                planet.add(moon.mesh);
                planet.add(moon.orbit);
            });
            sun.add(planet.mesh);
            sun.add(planet.orbit);
        });

        this.scene.add(sun.mesh);
        this.scene.add(sun.light);
    }


    public centerCameraOn(objectName: string) {
        const object = this.spaceObjects.get(objectName);
        // this.camera.lookAt(planet.mesh.position);
        this.controls.target.set(object.coordinates.getSceneX(), object.coordinates.getSceneY(), object.coordinates.getSceneZ());

        this.camera.position.x = object.mesh.position.x;
        this.camera.position.y = object.mesh.position.y;
        this.camera.position.z = object.mesh.position.z + 30 * object.radius / environment.distanceCoef;
    }

    public buildAxes(length) {
        const axes = new THREE.Object3D();

        axes.add(this.buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(length, 0, 0), 0xff0000, false)); // +X
        axes.add(this.buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(-length, 0, 0), 0xff0000, true)); // -X
        axes.add(this.buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, length, 0), 0x00ff00, false)); // +Y
        axes.add(this.buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, -length, 0), 0x00ff00, true)); // -Y
        axes.add(this.buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, length), 0x0000ff, false)); // +Z
        axes.add(this.buildAxis(new THREE.Vector3(0, 0, 0), new THREE.Vector3(0, 0, -length), 0x0000ff, true)); // -Z

        this.scene.add(axes);
    }

    private render() {
        // const currentTime = Date.now();
        // this.uniforms.iGlobalTime.value = (currentTime - this.startTime) * 0.001;
        this.renderer.render(this.scene, this.camera);
    }

    public animate() {
        requestAnimationFrame(() => this.animate());
        this.spaceObjects.forEach(spaceObject => {
            const sprite = spaceObject.mesh.children[0];
            if (sprite !== undefined) {
                const scaleFactor = 8;
                const scale = this.scaleVector.subVectors(spaceObject.mesh.position, this.camera.position).length() / scaleFactor;
                sprite.scale.set(scale, scale, 1);
            }
        });

        this.render();
    }

    public onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    private buildAxis(src, dst, colorHex, dashed) {
        const geom = new THREE.Geometry();
        let mat: any;

        if (dashed) {
            mat = new THREE.LineDashedMaterial({ linewidth: 3, color: colorHex, dashSize: 3, gapSize: 3 });
        } else {
            mat = new THREE.LineBasicMaterial({ linewidth: 3, color: colorHex });
        }

        geom.vertices.push(src.clone());
        geom.vertices.push(dst.clone());
        geom.computeLineDistances(); // This one is SUPER important, otherwise dashed lines will appear as simple plain lines

        const axis = new THREE.Line(geom, mat, THREE.LineSegments);

        return axis;
    }

    public ngOnDestroy() {
        this.alive = false;
    }
}
