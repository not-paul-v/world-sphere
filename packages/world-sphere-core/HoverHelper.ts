import {
    Camera,
    Group,
    Mesh,
    Raycaster,
    Vector2,
    Vector3,
} from "three";
import { acceleratedRaycast } from "three-mesh-bvh";

Mesh.prototype.raycast = acceleratedRaycast;

type Rays = {
    middle: Raycaster;
    left: Raycaster;
    right: Raycaster;
    up: Raycaster;
    down: Raycaster;
} 

export class HoverHelper {
    previousCountry: string = "";
    readonly rays: Rays = {
        middle: new Raycaster(),
        left: new Raycaster(),
        right: new Raycaster(),
        up: new Raycaster(),
        down: new Raycaster(),
    };
    readonly countriesGroup: Group;
    readonly sphereRef: Group;

    constructor(countriesGroup: Group, sphereRef: Group) {
        Object.keys(this.rays).forEach((key) => {
            this.rays[key as keyof typeof this.rays].firstHitOnly = true;
        });

        this.countriesGroup = countriesGroup;
        this.sphereRef = sphereRef;
    }

    public getCountryFromMousePosition(
        position: Vector2,
        camera: Camera
    ): string {
        const ray = new Raycaster();
        const mousePointer = new Vector2(position.x, position.y);

        ray.setFromCamera(mousePointer, camera);
        ray.firstHitOnly = true;

        const sphereIntersection = ray.intersectObject(this.sphereRef);
        
        const origin = new Vector3(0, 0, 0);
        const intersectionPoint = sphereIntersection[0]?.point;

        if (!intersectionPoint) return "";

        const dir = new Vector3(0, 0, 0);
        dir.subVectors(origin, intersectionPoint).normalize();

        const leftRayVector = new Vector3();
        const rightRayVector = new Vector3();
        const topRayVector = new Vector3();
        const bottomRayVector = new Vector3();

        rightRayVector.crossVectors(dir, new Vector3(0, 1, 0))
        leftRayVector.crossVectors(dir, new Vector3(0, -1, 0));
        
        topRayVector.crossVectors(dir, rightRayVector);
        bottomRayVector.crossVectors(dir, leftRayVector);
        
        const pointerM = new Vector2(position.x, position.y);

        const elevatedPoint = new Vector3();
        elevatedPoint.addVectors(intersectionPoint, dir.multiplyScalar(-0.005));

        this.rays.middle.setFromCamera(pointerM, camera);
        this.rays.left.set(elevatedPoint, leftRayVector);
        this.rays.right.set(elevatedPoint, rightRayVector);
        this.rays.up.set(elevatedPoint, topRayVector);
        this.rays.down.set(elevatedPoint, bottomRayVector);

        const results: { [key: string]: number[] } = {};
        let countUndefined = 4;

        const cameraPosition = camera.position;
        const cameraDistanceFromOrigin = cameraPosition.distanceTo(origin);

        const middleIntersectionPoint = this.rays.middle.intersectObjects(
            this.countriesGroup.children,
            true
        );

        if (middleIntersectionPoint.length > 0 &&
            middleIntersectionPoint[0].distance < cameraDistanceFromOrigin
        ) {
            const countryName = middleIntersectionPoint[0].object.name;
            if (countryName != this.previousCountry) this.previousCountry = countryName;
            return this.previousCountry;
        }

        Object.keys(this.rays).forEach((key) => {
            if (key as keyof Rays === "middle") return;

            const ray = this.rays[key as keyof Rays];

            const intersects = ray.intersectObjects(
                this.countriesGroup.children,
                true
            );

            if (intersects.length > 0) {
                const countryName = intersects[0].object.name;
                if (countryName in results) {
                    results[countryName].push(intersects[0].distance);
                } else {
                    results[countryName] = [intersects[0].distance];
                }
                countUndefined--;
            }
        });

        if (countUndefined === 4) this.previousCountry = "";
        return this.previousCountry;
    }
}
