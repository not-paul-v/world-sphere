import { BufferGeometry } from "three";
import {
    CountryData,
    MergedCountryData,
    GenerationConfig,
} from "@world-sphere/types";
import { GeometryHelper } from "./utils/GeometryHelper";
import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";
import { getCoordinates } from "@world-sphere/data";

/**
 *
 * @param config [(optional) You can pass the globe's radius, the number of rows and the density of those rows. If you don't pass any config the default coordinate data will be loaded from a pregenerated file. This will be a lot faster than if you provide custom values.
 * @returns A list of merged geometries for the specific countries.
 */
export async function loadMergedGeometries(
    config?: GenerationConfig
): Promise<MergedCountryData> {
    const mergedCountryData: MergedCountryData = [];

    const geos = await loadGeometries(config);

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
export async function loadGeometries(
    config?: GenerationConfig
): Promise<CountryData[]> {
    const geometryHelper = new GeometryHelper();
    const countriesData: CountryData[] = [];

    const data = await getCoordinates(config);

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
