import { Coordinate } from "@world-sphere/types";
import { CountryHelper } from "./utils/CountryHelper";
import { MathUtils } from "three";
import { GenerationConfig } from "@world-sphere/types";

export async function getCoordinates(config?: GenerationConfig) {
    if (!config) {
        const data = await import("./assets/countriesData.json");
        return data.default;
    }

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
    }, config);

    for (let countryKey in coordinates) {
        const sortedArr = coordinates[countryKey].sort((a, b) => b[0] - a[0]);
        coordinates[countryKey] = sortedArr;
    }

    return coordinates;
}

function forEachLatLon(
    callbackFn: (lat: number, lon: number) => void,
    config: GenerationConfig
) {
    const { globeRadius, rows, density } = config;

    for (let lat = -90; lat <= 85; lat += 180 / rows) {
        const radius =
            Math.cos(Math.abs(lat) * MathUtils.DEG2RAD) * globeRadius;
        const circumference = radius * Math.PI * 2;
        const dotsForLat = Math.abs(circumference * density);
        for (let x = 0; x < dotsForLat; x++) {
            const lon = -180 + (x * 360) / dotsForLat;

            callbackFn(lat, lon);
        }
    }
}
