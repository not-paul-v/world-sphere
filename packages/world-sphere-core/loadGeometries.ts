import data from "./assets/countriesData.json";
import { BufferGeometry } from "three";
import { CountryData, MergedCountryData } from "./types/types";
import { GeometryHelper } from "./utils/geometryHelper";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

export async function loadMergedGeometries(): Promise<MergedCountryData> {
    const mergedCountryData: MergedCountryData = [];

    const geos = await loadGeometries();

    for (let countryData of geos) {
        if (countryData.geometries.length > 0) {
            mergedCountryData.push({
                key: countryData.key,
                geometry: mergeBufferGeometries(countryData.geometries),
            });
        }
    }

    return mergedCountryData;
}

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
