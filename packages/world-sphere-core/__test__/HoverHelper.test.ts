// TODO: get tests working
import { Camera, Group, Mesh, Vector2 } from "three";
import { HoverHelper } from "../HoverHelper";
import { loadMergedGeometries } from "../loadGeometries";

it("should return the coorect country on hover", async () => {
    const countriesData = await loadMergedGeometries();

    const camera = new Camera();
    const group = new Group();

    countriesData.forEach((countryData) => {
        const mesh = new Mesh();
        mesh.geometry = countryData.geometry;
        group.add(mesh);
    });

    const hoverHelper = new HoverHelper(group);
    const country = hoverHelper.getCountryFromMousePosition(
        new Vector2(0, 0),
        camera
    );
    expect(country).toBe("test");
});
