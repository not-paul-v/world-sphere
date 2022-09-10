import React from "react";
import { BufferGeometry } from "three";

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
    return (
        <mesh key={countryName} geometry={geometry} name={countryName}>
            <meshBasicMaterial color={color} />
        </mesh>
    );
}

export const MemoizedSphereCountry = React.memo(SphereCountry);
