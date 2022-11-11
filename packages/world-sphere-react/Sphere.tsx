import { useState, useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import {
    BufferGeometry,
    Group,
    Raycaster,
    Vector2,
    Mesh,
    Vector3,
    LineBasicMaterial,
    Line,
} from "three";
import { MemoizedSphereCountry } from "./SphereCountry";
import { loadMergedGeometries, HoverHelper } from "@world-sphere/core";
import { acceleratedRaycast } from "three-mesh-bvh";
import { useCountryHovered } from "./hooks/useCountryHovered";
import { LineGeometry } from "three/examples/jsm/lines/LineGeometry";

Mesh.prototype.raycast = acceleratedRaycast;

const getLine = (startPoint: Vector3, direction: Vector3) => {
    direction.normalize();

    // 0.8 0.21 0.55
    var distance = 100; // at what distance to determine pointB

    const endPoint = new Vector3();
    endPoint.addVectors (startPoint, direction.multiplyScalar( distance ) );
    // console.log(startPoint.x, startPoint.y, startPoint.z);
    
    const geometry = new BufferGeometry().setFromPoints([startPoint, endPoint]);
    return geometry
}


function LineI ({start, direction}: {start: Vector3, direction: Vector3}) {
    const ref = useRef<Line>(null);

    useFrame(() => {
        if(ref.current){
            ref.current.geometry = getLine(start, direction);
        }
    })
    return (
        // @ts-ignore
        <line ref={ref}>
            <bufferGeometry />
            <lineBasicMaterial color="hotpink" linewidth={100}/>
        </line>
    )
}

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
