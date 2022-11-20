import { motion } from "framer-motion-3d";
import React, { useEffect } from "react";
import { BufferGeometry } from "three";
import { MeshBVH } from "three-mesh-bvh";

interface SphereCountryProps {
    countryName: string;
    geometry: BufferGeometry;
    isHovered?: boolean;
}

export function SphereCountry({
    countryName,
    geometry,
    isHovered = false,
}: SphereCountryProps) {
    useEffect(() => {
        geometry.boundsTree = new MeshBVH(geometry);
    }, [geometry]);

    return (
        <motion.group animate={isHovered ? "hover" : "rest"}>
            <motion.mesh
                key={countryName}
                geometry={geometry}
                name={countryName}
                variants={{ hover: { z: 0.0 } }}
            >
                <meshStandardMaterial color={isHovered ? "red" : "black"} />
            </motion.mesh>
        </motion.group>
    );
}

export const MemoizedSphereCountry = React.memo(SphereCountry);
