import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Sphere } from "./Sphere";
import { OrbitControls } from "@react-three/drei";

export function SphereContainer() {
    return (
        <Canvas
            camera={{ fov: 90, position: [0, 0, 2] }}
            style={{ background: "#040D21" }}
        >
            <Suspense fallback={null}>
                <OrbitControls
                    enableZoom
                    enableRotate
                    enablePan={false}
                    zoomSpeed={0.6}
                    rotateSpeed={0.4}
                    minZoom={100}
                    maxZoom={0.2}
                />
                <Sphere beams={[[52, 13]]} />
            </Suspense>
        </Canvas>
    );
}
