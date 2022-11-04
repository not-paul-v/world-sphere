import React, { useEffect } from "react";
import { BufferGeometry } from "three";
import { MeshBVH } from "three-mesh-bvh";

interface SphereCountryProps {
    countryName: string;
    geometry: BufferGeometry;
    color?: string;
}

export function SphereCountry({
    countryName: countryName,
    geometry,
    color = "red",
}: SphereCountryProps) {
    useEffect(() => {
        geometry.boundsTree = new MeshBVH(geometry);
    }, [geometry]);

    return (
        <mesh key={countryName} geometry={geometry} name={countryName}>
            <meshBasicMaterial color={color} />
        </mesh>
    );
}

export const MemoizedSphereCountry = React.memo(SphereCountry);
