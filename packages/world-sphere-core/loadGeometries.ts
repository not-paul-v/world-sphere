import { BufferGeometry } from "three";
import { CountryData } from "./types/types";
import { GeometryHelper } from "./utils/geometryHelper";
import data from "./assets/countriesData.json";

/**
 *
 * @returns A list of objects of type CountryData; Containing the name of a country and the BufferGeometries to draw that country
 */
export async function loadGeometries(): Promise<CountryData[]> {
    const geometryHelper = new GeometryHelper();
    const countriesData: CountryData[] = [];

    let key: keyof typeof data;
    for (key in data) {
        const geometries: BufferGeometry[] = [];
        data[key].forEach((coordinates) => {
            const geometry = geometryHelper.getGeometry(
                coordinates[0],
                coordinates[1]
            );
            geometries.push(geometry);
        });

        countriesData.push({
            key,
            geometries,
        });
    }

    return countriesData;
}
