import { useState, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import {
    BufferGeometry,
    Group,
    Raycaster,
    Vector2,
    Mesh,
    Vector3,
} from "three";
import { MemoizedSphereCountry } from "./SphereCountry";
import { loadMergedGeometries } from "@world-sphere/core";
import { acceleratedRaycast } from "three-mesh-bvh";

Mesh.prototype.raycast = acceleratedRaycast;

export function Sphere() {
    const [countryGeometries, setCountryGeometries] = useState<
        { key: string; geometry: BufferGeometry }[] | undefined
    >();
    const [mouseHoverCountry, setMouseHoverCountry] = useState("");

    const [rays] = useState({
        middle: new Raycaster(),
        left: new Raycaster(),
        right: new Raycaster(),
        up: new Raycaster(),
        down: new Raycaster(),
        leftUp: new Raycaster(),
        rightUp: new Raycaster(),
        rightDown: new Raycaster(),
        leftDown: new Raycaster(),
    });

    const countriesRef = useRef<Group>(null);
    const sphereRef = useRef<Group>(null);

    useEffect(() => {
        loadMergedGeometries().then((data) => setCountryGeometries(data));
    }, []);

    //TODO: refactor
    useFrame(({ mouse, camera }) => {
        if (!countryGeometries || !countriesRef.current || !sphereRef.current)
            return;

        const offset = 0.005;
        const pointerM = new Vector2(mouse.x, mouse.y);
        const pointerL = new Vector2(mouse.x - offset, mouse.y);
        const pointerR = new Vector2(mouse.x + offset, mouse.y);
        const pointerLU = new Vector2(mouse.x - offset, mouse.y + offset);
        const pointerRU = new Vector2(mouse.x + offset, mouse.y + offset);
        const pointerLD = new Vector2(mouse.x - offset, mouse.y - offset);
        const pointerRD = new Vector2(mouse.x + offset, mouse.y - offset);

        rays.middle.setFromCamera(pointerM, camera);
        rays.left.setFromCamera(pointerL, camera);
        rays.right.setFromCamera(pointerR, camera);
        rays.leftUp.setFromCamera(pointerLU, camera);
        rays.rightUp.setFromCamera(pointerRU, camera);
        rays.leftDown.setFromCamera(pointerLD, camera);
        rays.rightDown.setFromCamera(pointerRD, camera);

        const results: { [key: string]: number } = {};

        let countUndefined = 5;

        const cameraPosition = camera.position;
        const origin = new Vector3(0, 0, 0);
        const cameraDistanceFromOrigin = cameraPosition.distanceTo(origin);

        Object.keys(rays).forEach((key) => {
            if (!countriesRef.current) return;

            const ray = rays[key as keyof typeof rays];

            ray.firstHitOnly = true;
            const intersects = ray.intersectObjects(
                countriesRef.current.children,
                false
            );

            if (
                intersects.length > 0 &&
                intersects[0].distance < cameraDistanceFromOrigin
            ) {
                const countryName = intersects[0].object.name;
                if (countryName in results) {
                    results[countryName]++;
                } else {
                    results[countryName] = 1;
                }
                countUndefined--;
            }
        });

        if (countUndefined == 5) {
            setMouseHoverCountry("");
        } else {
            const selectedEntry = Object.entries(results).sort(
                (x, y) => y[1] - x[1]
            )[0];

            if (selectedEntry[0] !== mouseHoverCountry) {
                setMouseHoverCountry(selectedEntry[0]);
            }
        }
    });

    return (
        <>
            <axesHelper args={[100]} />
            <group ref={sphereRef}>
                <mesh>
                    <sphereGeometry args={[1, 64, 64]} />
                </mesh>
            </group>
            <group ref={countriesRef}>
                {countryGeometries
                    ? countryGeometries.map((country) => (
                          <MemoizedSphereCountry
                              countryName={country.key}
                              geometry={country.geometry}
                              color={
                                  mouseHoverCountry === country.key
                                      ? "black"
                                      : "red"
                              }
                          />
                      ))
                    : null}
            </group>
        </>
    );
}
