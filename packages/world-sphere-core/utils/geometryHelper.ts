import {
    Object3D,
    BufferGeometry,
    CylinderGeometry,
    MathUtils,
    Quaternion,
    Vector3,
} from "three";

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

    getGeometry(lat: number, lon: number): BufferGeometry {
        //TODO check if three MathUtils works the same
        this.lonHelper.rotation.y = MathUtils.degToRad(lon) + this.lonFudge;
        this.latHelper.rotation.x =
            MathUtils.degToRad(-lat + 25) + this.latFudge;

        const geometry = new CylinderGeometry(1.5, 1.5, 0.1, 6);

        const quaternion = new Quaternion();
        quaternion.setFromAxisAngle(new Vector3(1, 1, 1).normalize(), 90);
        geometry.applyQuaternion(quaternion);

        this.positionHelper.scale.set(0.002, 0.002, 0.01);
        this.originHelper.updateWorldMatrix(true, false);

        geometry.applyMatrix4(this.originHelper.matrixWorld);

        return geometry;
    }
}
