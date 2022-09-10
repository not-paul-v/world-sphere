import { Coordinate } from "@world-sphere/core/types/types";
import { CountryHelper } from "./utils/countryHelper";
import * as fs from "fs";

const DEG2RAD = Math.PI / 180;

const GLOBE_RADIUS = 1;
const ROWS = 350;
const DENSITY = 120;

export function generateFile(filename: string) {
    const countryHelper = new CountryHelper();

    const coordinates: {
        [key: string]: Coordinate[];
    } = {};

    for (let lat = -90; lat <= 85; lat += 180 / ROWS) {
        const radius = Math.cos(Math.abs(lat) * DEG2RAD) * GLOBE_RADIUS;
        const circumference = radius * Math.PI * 2;
        const dotsForLat = Math.abs(circumference * DENSITY);
        for (let x = 0; x < dotsForLat; x++) {
            const lon = -180 + (x * 360) / dotsForLat;

            const country = countryHelper.getCountryFromLatLon(lat, lon);
            if (country) {
                if (coordinates[country] === undefined)
                    coordinates[country] = [[lat, lon]];
                else coordinates[country].push([lat, lon]);
            }
        }
    }

    fs.writeFileSync(filename, JSON.stringify(coordinates));
}
