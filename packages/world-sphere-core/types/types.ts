import { BufferGeometry } from "three";

export interface Country {
    name: string;
    id: string;
    shapes: Shape[];
}

export type Shape = Coordinate[];

export type Coordinate = [number, number];

export interface CountryData {
    key: string;
    geometries: BufferGeometry[];
}
