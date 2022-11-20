import {
    Object3D,
    BufferGeometry,
    CylinderGeometry,
    MathUtils,
    Quaternion,
    Vector3,
    Matrix4,
    Line,
    LineBasicMaterial,
} from "three";
import { findNearestGeometryCoordinates } from "./findNearestGeometryCoordinates";

export class GeometryHelper {
    lonHelper: Object3D;
    latHelper: Object3D;
    positionHelper: Object3D;
    originHelper: Object3D;
    lonFudge: number;
    latFudge: number;

    constructor() {
        this.lonHelper = new Object3D();
        this.latHelper = new Object3D();
        this.lonHelper.add(this.latHelper);

        this.positionHelper = new Object3D();
        this.positionHelper.position.z = 1;
        this.latHelper.add(this.positionHelper);

        this.originHelper = new Object3D();
        this.originHelper.position.z = 0.5;
        this.positionHelper.add(this.originHelper);

        this.lonFudge = Math.PI * 0.5;
        this.latFudge = Math.PI * -0.135;
    }

    getMatrixWorldAtCoordinates(lat: number, lon: number): Matrix4 {
        this.lonHelper.rotation.y = MathUtils.degToRad(lon) + this.lonFudge;
        this.latHelper.rotation.x =
            MathUtils.degToRad(-lat + 25) + this.latFudge;

        this.positionHelper.scale.set(0.002, 0.002, 0.01);
        this.originHelper.updateWorldMatrix(true, false);

        return this.originHelper.matrixWorld;
    }

    getGeometry(lat: number, lon: number): BufferGeometry {
        let geometry = new CylinderGeometry(1.5, 1.5, 0.1, 6);

        this.rotateGeometry(geometry);
        this.applyMatrixWorld(geometry, lat, lon);

        return geometry;
    }

    getBeamGeometry(lat: number, lon: number): Line | undefined {
        const coords = findNearestGeometryCoordinates(lat, lon);
        if (!coords) return undefined;

        const startPoint = new Vector3(0, 0, 0);
        const endPoint = new Vector3(0, 50, 0);
        let beamGeometry = new BufferGeometry();
        beamGeometry.setFromPoints([startPoint, endPoint]);

        this.rotateGeometry(beamGeometry);
        this.applyMatrixWorld(beamGeometry, coords[0], coords[1]);

        const material = new LineBasicMaterial({
            color: 0x00ffff,
            linewidth: 5,
        });

        const beam = new Line(beamGeometry, material);
        return beam;
    }

    private rotateGeometry(geometry: BufferGeometry) {
        const quaternion = new Quaternion();
        quaternion.setFromAxisAngle(new Vector3(1, 1, 1).normalize(), 90);
        geometry.applyQuaternion(quaternion);
    }

    private applyMatrixWorld(
        geometry: BufferGeometry,
        lat: number,
        lon: number
    ) {
        const matrixWorld = this.getMatrixWorldAtCoordinates(lat, lon);
        geometry.applyMatrix4(matrixWorld);
    }
}
