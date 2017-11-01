import { environment } from 'environments/environment';
import { Orbitable } from '../orbitable';
import { HorizonCoordinates } from '../../horizon-coordinates';
import * as THREE from 'three';

export class Earth extends Orbitable {
    constructor() {
        super();
        this.radius = 6378.137;
        this.coordinates = new HorizonCoordinates(8.085189297377026E-01, 5.770742450594002E-01, -2.783714659030374E-05);
        this.texture = 'assets/sun.jpg';
        this.name = 'Earth';
        this.eccentricity = 1.693936505240274E-02;
        this.majorAxis = 9.997893698231427E-01;
        this.argumentOfPeriapsis = 3.460022671282024E+02;
        this.ascendingNode = 1.180185004251146E+02;
        this.inclination = 1.619499879517213E-03;
        this.trueAnomaly = 2.914962922586066E+02;
        this.meanAnomaly = 2.932939316914255E+02;
        
        this.build();
        this.buildOrbit();
    }
}

/*
X = 8.085189297377026E-01 Y = 5.770742450594002E-01 Z =-2.783714659030374E-05
VX=-1.028408692019775E-02 VY= 1.393984497597139E-02 VZ= 1.973672455337278E-07
LT= 5.766669745070375E-03 RG= 9.984679147638652E-01 RR=-2.123104301000147E-04

EC= 1.693936505240274E-02 QR= 9.828535727121969E-01 IN= 1.619499879517213E-03
 OM= 1.180185004251146E+02 W = 3.460022671282024E+02 Tp=  2458123.158659660257
 N = 9.859206292830410E-01 MA= 2.932939316914255E+02 TA= 2.914962922586066E+02
 A = 9.997893698231427E-01 AD= 1.016725166934089E+00 PR= 3.651409548675242E+02

*/