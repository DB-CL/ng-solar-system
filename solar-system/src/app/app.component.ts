import { Component, OnInit, ViewEncapsulation } from '@angular/core';

import * as THREE from 'three';
declare const require: (moduleId: string) => any;
const OrbitControls = require('three-orbit-controls')(THREE);

import { CoreService } from './core.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
    encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
    private camera: THREE.PerspectiveCamera;
    private renderer: THREE.WebGLRenderer;
    private scene;
    private controls: any;

    constructor(private core: CoreService) {}

    ngOnInit() {
        this.core.init();

        this.core.onWindowResize();

        this.core.controls.addEventListener('change', () => {
            this.update();
        });
        window.addEventListener(
            'resize',
            () => {
                this.core.onWindowResize();
            },
            false
        );

        this.core.animate();
    }

    public centerOn(object: string) {
        this.core.centerCameraOn(object);
    }

    public update() {
        // this.sun.light.position.copy(this.core.camera.position);
    }
}
