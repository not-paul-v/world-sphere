import { SphereContainer } from "../index";
import { render } from "@testing-library/react";

it("test", () => {
    const component = render(
        <div style={{ width: "100vw", height: "100vh" }}>
            <SphereContainer />
        </div>
    );

    expect(component).not.toBeUndefined();
});
