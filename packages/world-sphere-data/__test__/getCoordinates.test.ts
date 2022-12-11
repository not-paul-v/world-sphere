import { getCoordinates } from "../getCoordinates";

describe("getCoordinates", () => {
    it("should return default data if no config is given", async () => {
        // when
        const coordinates = await getCoordinates();

        // then
        expect(Object.keys(coordinates).length).toBe(176);
    });

    xit("should return custom data if config is given", async () => {
        // when
        const coordinates = await getCoordinates({
            density: 100,
            globeRadius: 1,
            rows: 100,
        });

        // then
        // less expected since less tiles are getting placed which results in a higher probability that some smaller countries don't have any tiles that represent them
        expect(Object.keys(coordinates).length).toBe(168);
    });

    xit("should return sorted latitude coordinates if config is given", async () => {
        // when
        const coordinates = await getCoordinates({
            density: 100,
            globeRadius: 1,
            rows: 100,
        });

        let k: keyof typeof coordinates;
        for (k in coordinates) {
            const values = coordinates[k];
            let sorted = true;

            for (let i = 0; i < values.length - 1; i++) {
                if (values[i][0] < values[i + 1][0]) {
                    sorted = false;
                    break;
                }
            }

            // then
            expect(sorted).toBeTruthy();
        }
    });
});
