import { render } from "@testing-library/react";

import Twitter, { getServerSideProps } from "../../../src/pages/twitter";

import * as cryptoTwitter from "../../../src/utils/crypto";
import * as nextRouter from "next/router";

describe("Twitter", () => {
  it("Should render page Twitter correctly", async () => {
    jest.spyOn(cryptoTwitter, "decrypt").mockImplementation(() => {
      return JSON.stringify({ level: 1, challenges: 2, experience: 100 });
    });
    const response = await getServerSideProps({
      query: { auth: `asd,123,asds` },
    });
    const { getByTestId, container } = render(<Twitter {...response.props} />);

    expect(container.children).toHaveLength(1);

    expect(getByTestId("level-text")).toHaveTextContent(response.props.level);
    expect(getByTestId("challenges-text")).toHaveTextContent(
      `${response.props.challenges} completos`
    );
    expect(getByTestId("experience-text")).toHaveTextContent(
      `${response.props.experience} xp`
    );
  });

  it("Should not render page Twitter", async () => {
    jest.spyOn(cryptoTwitter, "decrypt").mockImplementation(() => {
      throw new Error("Has error");
    });

    const router = { push: jest.fn() };
    const spyRouter = jest
      .spyOn(nextRouter, "useRouter")
      .mockReturnValue(router);

    const response = await getServerSideProps({
      query: { auth: `asd,123,asds` },
    });

    render(<Twitter {...response.props} />);

    expect(cryptoTwitter.decrypt).toBeCalled();
    expect(cryptoTwitter.decrypt).toThrowError("Has error");

    expect(spyRouter).toBeCalled();
  });
});
