import { findNearestGeometryCoordinates } from "../utils/findNearestGeometryCoordinates";

describe("findNearestTile test", () => {
    it("should find nearest tile for given coordinates on land", () => {
        // when
        const nearestTileCoordinates = findNearestGeometryCoordinates(
            52.520008,
            13.404954
        );

        // then
        expect(nearestTileCoordinates).toBeDefined();

        if (nearestTileCoordinates) {
            expect(nearestTileCoordinates.length).toBe(2);
            expect(nearestTileCoordinates[0]).toBeGreaterThanOrEqual(52);
            expect(nearestTileCoordinates[0]).toBeLessThanOrEqual(53);
            expect(nearestTileCoordinates[1]).toBeGreaterThanOrEqual(12);
            expect(nearestTileCoordinates[1]).toBeLessThanOrEqual(14);
        }
    });

    it("should not find nearest tile for given coordinates in the ocean", () => {
        // when
        const nearestTileCoordinates = findNearestGeometryCoordinates(-20, -7);

        // then
        expect(nearestTileCoordinates).not.toBeDefined();
    });
});
