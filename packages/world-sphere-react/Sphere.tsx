import { useState, useRef, useEffect } from "react";
import {
    BufferGeometry,
    Group,
    Mesh,
} from "three";
import { MemoizedSphereCountry } from "./SphereCountry";
import { loadMergedGeometries } from "@world-sphere/core";
import { acceleratedRaycast } from "three-mesh-bvh";
import { useCountryHovered } from "./hooks/useCountryHovered";

Mesh.prototype.raycast = acceleratedRaycast;

export function Sphere() {
    const [countryGeometries, setCountryGeometries] = useState<
        { key: string; geometry: BufferGeometry }[] | undefined
    >();

    const countriesRef = useRef<Group>(null);
    const sphereRef = useRef<Group>(null);

    const hoveredCountry = useCountryHovered(countriesRef.current, sphereRef.current);

    useEffect(() => {
        loadMergedGeometries().then((data) => setCountryGeometries(data));
    }, []);

    return (
        <>
            <axesHelper args={[100]} />
            <group ref={sphereRef}>
                <mesh>
                    <sphereGeometry args={[1, 64, 64]} />
                    <meshBasicMaterial color="blue" />
                </mesh>
            </group>
            <group ref={countriesRef}>
                {countryGeometries
                    ? countryGeometries.map((country) => (
                          <MemoizedSphereCountry
                              countryName={country.key}
                              geometry={country.geometry}
                              isHovered={hoveredCountry === country.key}
                          />
                      ))
                    : null}
            </group>
        </>
    );
}
