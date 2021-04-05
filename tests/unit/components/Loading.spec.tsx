import { render } from "@testing-library/react";
import * as nextRouter from "next/router";

import { Loading } from "../../../src/components/Loading";

describe("Loading Component", () => {
  it("Should render the component of Loading correctly", () => {
    const { getByTestId } = render(<Loading />);

    expect(getByTestId("loading")).toBeTruthy();
  });

  it("Should render the component of Loading with route name", () => {
    const router = { push: jest.fn() };
    jest.spyOn(nextRouter, "useRouter").mockReturnValue(router);

    const { getByTestId } = render(<Loading routeName="/login" />);

    expect(getByTestId("loading")).toBeTruthy();
    expect(router.push).toHaveBeenCalledWith("/login");
  });
});
