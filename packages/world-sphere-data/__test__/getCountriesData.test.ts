import { getCountriesData } from "../utils/getCountriesData";
import countriesData from "../assets/world.json";

describe("getCountriesData", () => {
    it("should return the correct number of country objects", () => {
        // when
        const countries = getCountriesData(countriesData);

        // then
        expect(countries.length).toBe(179);
        countries.forEach((country) => {
            expect(country.shapes.length).toBeGreaterThan(0);
        });
    });
});
