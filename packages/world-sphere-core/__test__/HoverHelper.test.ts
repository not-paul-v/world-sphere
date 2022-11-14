// TODO: get tests working
import { Camera, Group, Mesh, Sphere, SphereGeometry, Vector2, Vector3 } from "three";
import { HoverHelper } from "../HoverHelper";
import { loadMergedGeometries } from "../loadGeometries";

xit("should return the correct country on hover", async () => {
    const countriesData = await loadMergedGeometries();

    const camera = new Camera();
    const group = new Group();
    const sphereGroup = new Group();

    const sphere = new SphereGeometry(1, 32, 32);
    sphereGroup.add(new Mesh(sphere));

    countriesData.forEach((countryData) => {
        const mesh = new Mesh();
        mesh.geometry = countryData.geometry;
        group.add(mesh);
    });

    const hoverHelper = new HoverHelper(group, sphereGroup);
    const country = hoverHelper.getCountryFromMousePosition(
        new Vector2(0, 0),
        camera
    );
    expect(country).toBe("test");
});
