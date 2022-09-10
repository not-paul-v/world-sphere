import { OrbitControls } from "@react-three/drei";
import { loadGeometries } from "@world-sphere/core";
import { useState, useRef, useEffect } from "react";
import { useFrame } from "react-three-fiber";
import {
    BufferGeometry,
    BufferGeometryUtils,
    Group,
    Raycaster,
    Vector2,
} from "three";
import { MemoizedSphereCountry } from "./SphereCountry";

export function Sphere() {
    const [countryGeometries, setCountryGeometries] = useState<
        { key: string; geometry: BufferGeometry }[] | undefined
    >();
    const [mouseRay] = useState(new Raycaster());
    const [mouseHoverCountry, setMouseHoverCountry] = useState("");

    const countriesRef = useRef<Group>(null);

    //TODO: refactor merging to core package
    useEffect(() => {
        const geoPromise = loadGeometries();
        geoPromise?.then((data) => {
            const geometries = [];

            for (let countryData of data) {
                if (countryData.geometries.length > 0) {
                    const merged = BufferGeometryUtils.mergeBufferGeometries(
                        countryData.geometries
                    );
                    geometries.push({ key: countryData.key, geometry: merged });
                }
            }
            setCountryGeometries(geometries);
        });
    }, []);

    //TODO: fix country focus not releasing after mouse leaving
    useFrame(({ mouse, camera }) => {
        if (!countryGeometries || !countriesRef.current) return;

        const pointer = new Vector2(mouse.x, mouse.y);

        mouseRay.setFromCamera(pointer, camera);
        const intersects = mouseRay.intersectObjects(
            countriesRef.current.children
        );

        if (intersects.length > 0) {
            let closest = intersects.reduce(function (res, obj) {
                return obj.distance < res.distance ? obj : res;
            });

            if (
                closest.distance < 2 &&
                closest.object.name !== mouseHoverCountry
            ) {
                setMouseHoverCountry(closest.object.name);
                return;
            }
        }
    });

    return (
        <>
            <ambientLight />
            <mesh>
                <sphereGeometry args={[1, 64, 64]} />
                <OrbitControls
                    enableZoom
                    enableRotate
                    enablePan={false}
                    zoomSpeed={0.6}
                    rotateSpeed={0.4}
                    minZoom={100}
                    maxZoom={0.2}
                />
            </mesh>
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
