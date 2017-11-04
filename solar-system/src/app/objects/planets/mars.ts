import { environment } from 'environments/environment';
import { Orbitable, ObjectType } from '../index';
import { HorizonCoordinates } from '../../horizon-coordinates';
import * as THREE from 'three';

export class Mars extends Orbitable {
    constructor() {
        super();
        this.type = ObjectType.Planet;
        this.radius = 3396;
        this.coordinates = new HorizonCoordinates(-1.609048911223828, 4.208516516376911e-1, 4.830808910357868e-2);
        this.texture = 'assets/sun.jpg';
        this.name = 'Mars';
        this.eccentricity = 9.347279630225067e-2;
        this.majorAxis = 1.523667266799167;
        this.argumentOfPeriapsis = 2.86614767849351e2;
        this.ascendingNode = 4.950702495279573e1;
        this.inclination = 1.848362900525095;
        // this.inclination = 347.726;
        this.trueAnomaly = 1.892089795488493e2;
        this.meanAnomaly = 1.910496428966482e2;

        this.build();
        this.buildOrbit();
    }
}

/*
2458055.500000000 = A.D. 2017-Oct-29 00:00:00.0000 TDB 
 X =-1.609048911223828E+00 Y = 4.208516516376911E-01 Z = 4.830808910357868E-02
 VX=-3.017284230339141E-03 VY=-1.234266427276564E-02 VZ=-1.845967424689463E-04
 LT= 9.609754738473272E-03 RG= 1.663877454282495E+00 RR=-2.093845638148735E-04


2458055.500000000 = A.D. 2017-Oct-29 00:00:00.0000 TDB 
 EC= 9.347279630225067E-02 QR= 1.381245826737241E+00 IN= 1.848362900525095E+00
 OM= 4.950702495279573E+01 W = 2.866147678493510E+02 Tp=  2458377.896394703072
 N = 5.240454294132041E-01 MA= 1.910496428966482E+02 TA= 1.892089795488493E+02
 A = 1.523667266799167E+00 AD= 1.666088706861093E+00 PR= 6.869633428596205E+02
*/
