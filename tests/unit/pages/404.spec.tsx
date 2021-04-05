import { render } from "@testing-library/react";


import PageNotFound from "../../../src/pages/404";

describe("404", () => {
  it("Should render page 404 correctly", async () => {
    const {getByTestId } = render(<PageNotFound />);
    
    expect(getByTestId('404')).toHaveTextContent("Pagina não encontrada");
  });
});
