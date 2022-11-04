import {
    BufferGeometry,
    Camera,
    Group,
    Mesh,
    Raycaster,
    Vector2,
    Vector3,
} from "three";
import { acceleratedRaycast } from "three-mesh-bvh";

Mesh.prototype.raycast = acceleratedRaycast;

export class HoverHelper {
    previousCountry: string = "";
    readonly rays = {
        middle: new Raycaster(),
        left: new Raycaster(),
        right: new Raycaster(),
        up: new Raycaster(),
        down: new Raycaster(),
        leftUp: new Raycaster(),
        rightUp: new Raycaster(),
        leftDown: new Raycaster(),
        rightDown: new Raycaster(),
    };
    readonly countriesGroup: Group;

    constructor(countriesGroup: Group) {
        Object.keys(this.rays).forEach((key) => {
            this.rays[key as keyof typeof this.rays].firstHitOnly = true;
        });

        this.countriesGroup = countriesGroup;
    }

    public getCountryFromMousePosition(
        position: Vector2,
        camera: Camera
    ): string {
        if (!this.countriesGroup) return "";

        const offset = 0.005;
        const pointerM = new Vector2(position.x, position.y);
        const pointerL = new Vector2(position.x - offset, position.y);
        const pointerR = new Vector2(position.x + offset, position.y);
        const pointerLU = new Vector2(position.x - offset, position.y + offset);
        const pointerRU = new Vector2(position.x + offset, position.y + offset);
        const pointerLD = new Vector2(position.x - offset, position.y - offset);
        const pointerRD = new Vector2(position.x + offset, position.y - offset);

        this.rays.middle.setFromCamera(pointerM, camera);
        this.rays.left.setFromCamera(pointerL, camera);
        this.rays.right.setFromCamera(pointerR, camera);
        this.rays.leftUp.setFromCamera(pointerLU, camera);
        this.rays.rightUp.setFromCamera(pointerRU, camera);
        this.rays.leftDown.setFromCamera(pointerLD, camera);
        this.rays.rightDown.setFromCamera(pointerRD, camera);

        const results: { [key: string]: number } = {};

        let countUndefined = 5;

        const cameraPosition = camera.position;
        const origin = new Vector3(0, 0, 0);
        const cameraDistanceFromOrigin = cameraPosition.distanceTo(origin);

        Object.keys(this.rays).forEach((key) => {
            const ray = this.rays[key as keyof typeof this.rays];

            const intersects = ray.intersectObjects(
                this.countriesGroup.children,
                true
            );

            if (
                intersects.length > 0 &&
                intersects[0].distance < cameraDistanceFromOrigin
            ) {
                const countryName = intersects[0].object.name;
                if (countryName in results) {
                    results[countryName]++;
                } else {
                    results[countryName] = 1;
                }
                countUndefined--;
            }
        });

        if (countUndefined == 5) {
            this.previousCountry = "";
        } else {
            const selectedEntry = Object.entries(results).sort(
                (x, y) => y[1] - x[1]
            )[0];

            if (selectedEntry[0] !== this.previousCountry) {
                this.previousCountry = selectedEntry[0];
            }
        }
        return this.previousCountry;
    }
}
