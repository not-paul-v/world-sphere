import { BufferGeometry } from "three";

// @world-sphere/core
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

export type MergedCountryData = {
    key: string;
    geometry: BufferGeometry;
}[];

// @world-sphere/data, @world-sphere/core
export interface GenerationConfig {
    globeRadius: number;
    rows: number;
    density: number;
}
