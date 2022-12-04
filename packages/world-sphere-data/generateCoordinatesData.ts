import { getCoordinates } from "./getCoordinates";
import * as fs from "fs";

const GLOBE_RADIUS = 1;
const ROWS = 350;
const DENSITY = 120;

export async function generateFile(filename: string) {
    const coordinates = await getCoordinates({
        globeRadius: GLOBE_RADIUS,
        rows: ROWS,
        density: DENSITY,
    });

    fs.writeFileSync(filename, JSON.stringify(coordinates));
    console.log("Successfully generated coordinates data");
}

generateFile("./assets/countriesData.json");
