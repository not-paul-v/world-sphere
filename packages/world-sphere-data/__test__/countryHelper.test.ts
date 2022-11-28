import { CountryHelper } from "../utils/CountryHelper";

const helper = new CountryHelper();

it("should return correct country", () => {
    const country = helper.getCountryFromLatLon(52.5, 13.5);

    expect(country).not.toBeNull();
    expect(country).toBe("Germany");
});

it("should not return a country", () => {
    const country = helper.getCountryFromLatLon(58.5, -16);

    expect(country).toBeNull();
});
