import { loadGeometries, loadMergedGeometries } from "../loadGeometries";

describe("load geometries test", () => {
    it("should load the geometries", async () => {
        // when
        const geometries = await loadGeometries();

        // then
        expect(geometries.length).toBe(176);
        geometries.forEach((data) => {
            expect(data.geometries.length).toBeGreaterThan(0);
        });
    });

    it("should load the merged geometries", async () => {
        // when
        const geometries = await loadMergedGeometries();

        // then
        expect(geometries.length).toBe(176);
        geometries.forEach((data) => {
            expect(data.geometry).toBeDefined();
        });
    });
});
