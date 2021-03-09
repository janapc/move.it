import { render } from "@testing-library/react";

import Home from "../../../src/pages/index";

global.Notification = ({
  requestPermission: jest.fn(),
  permission: "granted"
} as unknown) as jest.Mocked<typeof Notification>;

describe("Home", () => {
  it("Should render page Home correctly", () => {
    const wrapper = render(
      <Home level={2} currentExperience={30} challengesCompleted={3} />
    );

    expect(wrapper.asFragment()).toMatchSnapshot()
  });
});
