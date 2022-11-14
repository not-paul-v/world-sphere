import { findNearestGeometryCoordinates } from "../utils/findNearestGeometryCoordinates";

it("should find nearest tile for given coordinates on land", () => {
    const nearestTileCoordinates = findNearestGeometryCoordinates(52.520008, 13.404954);
    
    expect(nearestTileCoordinates.length).toBe(2);
    expect(nearestTileCoordinates[0]).toBeGreaterThanOrEqual(52);
    expect(nearestTileCoordinates[0]).toBeLessThanOrEqual(53);
    expect(nearestTileCoordinates[1]).toBeGreaterThanOrEqual(12);
    expect(nearestTileCoordinates[1]).toBeLessThanOrEqual(14);
});