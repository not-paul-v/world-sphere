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
import { loadMergedGeometries, HoverHelper } from "@world-sphere/core";
import { acceleratedRaycast } from "three-mesh-bvh";
import { useCountryHovered } from "./hooks/useCountryHovered";

Mesh.prototype.raycast = acceleratedRaycast;

export function Sphere() {
    const [countryGeometries, setCountryGeometries] = useState<
        { key: string; geometry: BufferGeometry }[] | undefined
    >();

    const countriesRef = useRef<Group>(null);
    const sphereRef = useRef<Group>(null);

    const hoveredCountry = useCountryHovered(countriesRef.current);

    useEffect(() => {
        loadMergedGeometries().then((data) => setCountryGeometries(data));
    }, []);

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
                                  hoveredCountry === country.key
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
