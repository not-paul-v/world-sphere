import { loadGeometries } from "../loadGeometries";

it("should load the geometries", async () => {
    const geometries = await loadGeometries();

    expect(geometries.length).toBe(176);
    geometries.forEach((data) => {
        expect(data.geometries.length).toBeGreaterThan(0);
    });
});
