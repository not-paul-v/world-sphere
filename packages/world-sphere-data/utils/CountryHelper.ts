import countryData from "../assets/world.json";
import {
    Scene,
    Mesh,
    ShapeGeometry,
    MeshBasicMaterial,
    Shape,
    DoubleSide,
    Vector2,
    Vector3,
    Raycaster,
} from "three";
import { Coordinate, Country } from "@world-sphere/types";
import { ProjectionHelper } from "./ProjectionHelper";
import { getCountriesData } from "./getCountriesData";

export class CountryHelper {
    projectionHelper: ProjectionHelper;
    countries: Country[];
    scene: Scene;
    width: number;
    height: number;

    constructor() {
        this.scene = new Scene();
        this.width = 1200;
        this.height = 1200;

        this.projectionHelper = new ProjectionHelper(this.width, this.height);
        this.countries = getCountriesData(countryData);

        this.setupScene();
    }

    setupScene() {
        const mesh = new Mesh();
        for (let country of this.countries) {
            const countryMesh = new Mesh();
            countryMesh.name = country.name;

            for (let shape of country.shapes) {
                const vectors = this.convertPoints(shape);

                const geometry = new ShapeGeometry(new Shape(vectors));
                const material = new MeshBasicMaterial({
                    color: "white",
                    side: DoubleSide,
                });

                let mesh = new Mesh(geometry, material);
                mesh.name = country.name;
                countryMesh.add(mesh);
            }
            mesh.add(countryMesh);
        }
        this.scene.add(mesh);
    }

    convertPoints(points: Coordinate[]): Vector2[] {
        let result = points.map((point) =>
            this.convertPoint([point[1], point[0]])
        );
        return result;
    }

    convertPoint(point: Coordinate): Vector2 {
        const { x, y } = this.projectionHelper.mercator(point[0], point[1]);
        return new Vector2(x, y);
    }

    getCountryFromLatLon(lat: number, lon: number) {
        const { x, y } = this.convertPoint([lat, lon]);
        // offset (+25) bc of weird shape "bug"
        return this.getCountryFromXY(x, y);
    }

    getCountryFromXY(x: number, y: number) {
        const ray = new Raycaster(new Vector3(x, y, 10), new Vector3(0, 0, -1));

        const intersections = ray.intersectObjects(this.scene.children);
        if (intersections.length > 0) {
            return intersections[0].object.name;
        }
        return null;
    }
}
