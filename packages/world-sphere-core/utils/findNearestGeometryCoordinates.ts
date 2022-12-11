import data from "../assets/countriesData.json";
import { Coordinate } from "@world-sphere/types";

export const findNearestGeometryCoordinates = (
    lat: number,
    lon: number
): Coordinate | undefined => {
    const roundedLat = Math.round(lat);
    const roundedLon = Math.round(lon);

    let key: keyof typeof data;
    for (key in data) {
        const coordinates = data[key];
        const minLat = coordinates[0][0];
        const maxLat = coordinates[coordinates.length - 1][0];

        if (roundedLat > maxLat || roundedLat < minLat) continue;

        for (let coordinate of coordinates) {
            const isCorrectLat = roundedLat === Math.round(coordinate[0]);
            if (!isCorrectLat) continue;
            const isCorrectLon = roundedLon === Math.round(coordinate[1]);
            if (!isCorrectLon) continue;

            return coordinate as Coordinate;
        }
    }
    return undefined;
};
