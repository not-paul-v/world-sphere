import { Coordinate } from "@world-sphere/core/types/types";
import { CountryHelper } from "./utils/CountryHelper";
import { MathUtils } from "three";

export function getCoordinates() {
    const countryHelper = new CountryHelper();

    const coordinates: {
        [key: string]: Coordinate[];
    } = {};

    forEachLatLon((lat, lon) => {
        const country = countryHelper.getCountryFromLatLon(lat, lon);
        if (country) {
            if (country in coordinates) coordinates[country].push([lat, lon]);
            else coordinates[country] = [[lat, lon]];
        }
    });

    for (let countryKey in coordinates) {
        const sortedArr = coordinates[countryKey].sort((a, b) => a[0] - a[1]);
        coordinates[countryKey] = sortedArr;
    }

    return coordinates;
}

function forEachLatLon(callbackFn: (lat: number, lon: number) => void) {
    const GLOBE_RADIUS = 1;
    const ROWS = 350;
    const DENSITY = 120;

    for (let lat = -90; lat <= 85; lat += 180 / ROWS) {
        const radius =
            Math.cos(Math.abs(lat) * MathUtils.DEG2RAD) * GLOBE_RADIUS;
        const circumference = radius * Math.PI * 2;
        const dotsForLat = Math.abs(circumference * DENSITY);
        for (let x = 0; x < dotsForLat; x++) {
            const lon = -180 + (x * 360) / dotsForLat;

            callbackFn(lat, lon);
        }
    }
}
