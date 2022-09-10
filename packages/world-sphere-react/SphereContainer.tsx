import { Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { Sphere } from "./Sphere";

export function SphereContainer() {
    return (
        <Canvas camera={{ fov: 90, position: [0, 0, 2] }}>
            <Suspense fallback={null}>
                <Sphere />
            </Suspense>
        </Canvas>
    );
}
