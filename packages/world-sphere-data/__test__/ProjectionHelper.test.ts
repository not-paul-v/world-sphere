import { ProjectionHelper } from "../utils/ProjectionHelper";

describe("ProjectionHelper tests", () => {
    let projectionHelper: ProjectionHelper;

    beforeAll(() => {
        projectionHelper = new ProjectionHelper(1000, 1000);
    });

    describe("equirectangular", () => {
        it("should return the correct x and y coordinates for lat lon 0", () => {
            // when
            const { x, y } = projectionHelper.equirectangular(0, 0);

            // then
            expect(x).toBe(500);
            expect(y).toBe(500);
        });

        it("should return the correct x and y coordinates for min lat lon", () => {
            // when
            const { x, y } = projectionHelper.equirectangular(-90, -180);

            // then
            expect(x).toBe(0);
            expect(y).toBe(0);
        });

        it("should return the correct x and y coordinates for max lat lon", () => {
            // when
            const { x, y } = projectionHelper.equirectangular(90, 180);

            // then
            expect(x).toBe(1000);
            expect(y).toBe(1000);
        });
    });

    describe("mercator", () => {
        it("should return the correct x and y coordinates for lat lon 0", () => {
            // when
            const { x, y } = projectionHelper.mercator(0, 0);

            // then
            expect(x).toBe(500);
            expect(y).toBe(500);
        });

        it("should return the correct x and y coordinates for min lat lon", () => {
            // when
            const { x, y } = projectionHelper.mercator(-90, -180);

            // then
            expect(x).toBe(0);
            expect(y).toBe(0);
        });

        it("should return the correct x and y coordinates for max lat lon", () => {
            // when
            const { x, y } = projectionHelper.mercator(90, 180);

            // then
            expect(x).toBe(1000);
            expect(y).toBe(1000);
        });
    });
});
