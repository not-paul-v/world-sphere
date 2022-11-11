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
    const [lines, setLines] = useState<{start: Vector3, direction: Vector3}[]>([{
        start: new Vector3(0.8, 0.21, 0.55),
        direction: new Vector3(0, 0, -1)
    }, {
        start: new Vector3(0, 0, 0),
        direction: new Vector3(0, 0, -1)
    }, {
        start: new Vector3(0, 0, 0),
        direction: new Vector3(0, 0, -1)
    }, {
        start: new Vector3(0, 0, 0),
        direction: new Vector3(0, 0, -1)
    }]);
    const [pointOnSphere, setPointOnSphere] = useState<Vector3 | undefined>();

    const countriesRef = useRef<Group>(null);
    const sphereRef = useRef<Group>(null);

    const hoveredCountry = useCountryHovered(countriesRef.current, sphereRef.current);

    useFrame(({mouse, camera}) => {
        const ray = new Raycaster();
        const mousePointer = new Vector2(mouse.x, mouse.y);

        ray.setFromCamera(mousePointer, camera);
        ray.firstHitOnly = true;

        if (!sphereRef.current) return;

        const intersections = ray.intersectObject(sphereRef.current);
        const intersectionPoint = intersections[0]?.point;

        if (!intersectionPoint) return;
        setPointOnSphere(intersectionPoint);
        
        const origin = new Vector3(0, 0, 0);

        const dir = new Vector3(0, 0, 0);
        dir.subVectors(origin, intersectionPoint).normalize();

        const leftRayVector = new Vector3();
        const rightRayVector = new Vector3();
        const topRayVector = new Vector3();
        const bottomRayVector = new Vector3();

        rightRayVector.crossVectors(dir, new Vector3(0, 1, 0))
        leftRayVector.crossVectors(dir, new Vector3(0, -1, 0));
        
        topRayVector.crossVectors(dir, rightRayVector);
        bottomRayVector.crossVectors(dir, leftRayVector);

        lines[0].direction = leftRayVector.normalize();
        lines[0].start = intersectionPoint;

        lines[1].direction = rightRayVector.normalize();
        lines[1].start = intersectionPoint;

        lines[2].direction = topRayVector.normalize();
        lines[2].start = intersectionPoint;

        lines[3].direction = bottomRayVector.normalize();
        lines[3].start = intersectionPoint;

        // lines[0].direction = dir.clone();
    });

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
