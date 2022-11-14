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
import { GeometryHelper } from "@world-sphere/core/utils/GeometryHelper";

Mesh.prototype.raycast = acceleratedRaycast;

export function Sphere() {
    const [countryGeometries, setCountryGeometries] = useState<
        { key: string; geometry: BufferGeometry }[] | undefined
    >();

    const [geometryHelper] = useState(new GeometryHelper());

    const countriesRef = useRef<Group>(null);
    const sphereRef = useRef<Group>(null);
    const beamRef = useRef<Group>(null);

    const hoveredCountry = useCountryHovered(countriesRef.current, sphereRef.current);

    useEffect(() => {
        loadMergedGeometries().then((data) => setCountryGeometries(data));
    }, []);

    // display beam on nearest tile
    useEffect(() => {
        if (!beamRef || !beamRef.current) return;

        const beam = geometryHelper.getBeamGeometry(52, 13);

        if (beam)
            beamRef.current.add(beam);
    }, [geometryHelper]);

    return (
        <>
            <group ref={beamRef} />
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
