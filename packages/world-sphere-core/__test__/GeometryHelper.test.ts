import { GeometryHelper } from "../utils/GeometryHelper";

describe("GeometryHelper test", () => {
    let geometryHelper: GeometryHelper;

    beforeEach(() => {
        geometryHelper = new GeometryHelper();
    });

    it("should return a tile geometry", () => {
        // when
        const tile = geometryHelper.getGeometry(52.520008, 13.404954);

        // then
        expect(tile).toBeDefined();
    });

    it("should return a beam geometry", () => {
        // when
        const beam = geometryHelper.getBeamGeometry(52.520008, 13.404954);

        // then
        expect(beam).toBeDefined();
    });

    it("should not return a beam geometry if coordinates are not on a tile", () => {
        // when
        const beam = geometryHelper.getBeamGeometry(0, 0);

        // then
        expect(beam).not.toBeDefined();
    });
});
