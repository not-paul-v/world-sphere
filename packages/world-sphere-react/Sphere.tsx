import { useState, useRef, useEffect } from "react";
import { BufferGeometry, Group, Line, PointLight } from "three";
import { MemoizedSphereCountry } from "./SphereCountry";
import { loadMergedGeometries } from "@world-sphere/core";
import { useCountryHovered } from "./hooks/useCountryHovered";
import { GeometryHelper } from "@world-sphere/core/utils/GeometryHelper";
import { Bloom, EffectComposer, Selection } from "@react-three/postprocessing";
import { useThree } from "@react-three/fiber";
import { Coordinate } from "@world-sphere/types";

interface SphereProps {
    beams?: Coordinate[];
}

export function Sphere({ beams = [] }: SphereProps) {
    const [countryGeometries, setCountryGeometries] = useState<
        { key: string; geometry: BufferGeometry }[] | undefined
    >();

    const [geometryHelper] = useState(new GeometryHelper());
    const [beamGeometries] = useState<Line[]>([]);
    const { camera, scene } = useThree();

    const countriesRef = useRef<Group>(null);
    const sphereRef = useRef<Group>(null);

    const hoveredCountry = useCountryHovered(
        countriesRef.current,
        sphereRef.current
    );

    useEffect(() => {
        loadMergedGeometries().then((data) => setCountryGeometries(data));
    }, []);

    useEffect(() => {
        camera.children = [];

        const light = new PointLight();
        light.position.set(5, 10, 10);
        camera.add(light);
        scene.add(camera);
    }, [camera, scene]);

    // display beam on nearest tile
    useEffect(() => {
        for (let beam of beams) {
            const geometry = geometryHelper.getBeamGeometry(beam[0], beam[1]);

            if (geometry) beamGeometries.push(geometry);
        }
    }, [beams, beamGeometries, geometryHelper]);

    return (
        <>
            {beamGeometries ? (
                <Selection>
                    <EffectComposer multisampling={8} autoClear={false}>
                        <Bloom
                            luminanceThreshold={0}
                            luminanceSmoothing={0.9}
                        />
                    </EffectComposer>
                    {beamGeometries.map((beam) => (
                        <primitive object={beam} />
                    ))}
                </Selection>
            ) : null}
            <group ref={sphereRef}>
                <mesh>
                    <sphereGeometry args={[1, 64, 64]} />
                    <meshStandardMaterial color="blue" />
                </mesh>
            </group>
            <group ref={countriesRef}>
                {countryGeometries
                    ? countryGeometries.map((country) => (
                          <MemoizedSphereCountry
                              countryName={country.key}
                              geometry={country.geometry}
                              isHovered={hoveredCountry === country.key}
                              key={country.key}
                          />
                      ))
                    : null}
            </group>
        </>
    );
}
