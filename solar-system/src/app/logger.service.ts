import { Injectable } from '@angular/core';
import { environment } from 'environments/environment';

const noop = (): any => undefined;

@Injectable()
export class SolarLogger {
    private productionMode = false;
    constructor() {
        if (environment.production === true) {
            this.productionMode = true;
        }
    }

    get info() {
        if (!this.productionMode) {
            return console.info.bind(console);
        } else {
            return noop;
        }
    }

    get warn() {
        if (!this.productionMode) {
            return console.warn.bind(console);
        } else {
            return noop;
        }
    }

    get error() {
        if (!this.productionMode) {
            return console.error.bind(console);
        } else {
            return noop;
        }
    }

    get debug() {
        if (!this.productionMode) {
            return console.debug.bind(console);
        } else {
            return noop;
        }
    }

    invokeConsoleMethod(type: string, args?: any): void {
        const logFn: Function = console[type] || console.log || noop;
        logFn.apply(console, [args]);
    }
}
