import { useEffect, useState } from "react";
import { Group } from "three";
import { HoverHelper } from "@world-sphere/core";
import { useFrame } from "@react-three/fiber";

export const useCountryHovered = (countries: Group | null) => {
    const [mouseHoverCountry, setMouseHoverCountry] = useState("");
    const [hoverHelper, setHoverHelper] = useState<HoverHelper | undefined>(
        undefined
    );

    useEffect(() => {
        if (countries) {
            setHoverHelper(new HoverHelper(countries));
        }
    }, [countries]);

    useFrame(({ mouse, camera }) => {
        if (!hoverHelper) return;

        const country = hoverHelper.getCountryFromMousePosition(mouse, camera);
        if (country !== mouseHoverCountry) {
            setMouseHoverCountry(country);
        }
    });

    return mouseHoverCountry;
};
