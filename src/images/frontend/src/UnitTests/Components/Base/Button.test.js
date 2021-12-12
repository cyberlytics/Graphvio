import React from "react";
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from "react-dom/test-utils";
import Button from "../../../components/Base/Button";

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

it("renders correctly", () => {
  act(() => {
    render(
      <Button 
        text="Button Text"
        variant="primary"
        onClick={console.log("hello world")}
        type="submit"
      />,
       container);
  });
  expect(container).toMatchSnapshot();
});