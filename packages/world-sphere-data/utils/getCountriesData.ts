import { Coordinate, Country, Shape } from "@world-sphere/core/types/types";

export const getCountriesData = (countryData: any) => {
    let countries: Country[] = [];

    countryData.features.forEach((country: any) => {
        let countryPolygon: Country = {
            name: country.properties.name,
            id: country.id,
            shapes: [],
        };

        if (country.geometry.type === "Polygon") {
            const shape = getShapeFromCoordinates(country.geometry.coordinates);
            countryPolygon.shapes.push(shape);
        } else {
            const polygonsRaw: number[][][][] = country.geometry.coordinates;

            polygonsRaw.forEach((polygon) => {
                const shape = getShapeFromCoordinates(polygon);
                countryPolygon.shapes.push(shape);
            });
        }

        countries.push(countryPolygon);
    });

    return countries;
};

const getShapeFromCoordinates = (coordinates: number[][][]): Shape => {
    const coordsRaw: number[][][] = coordinates;
    const coords: Coordinate[] = coordsRaw.flat() as Coordinate[];

    return coords;
};
