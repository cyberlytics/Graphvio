import React from "react";
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from "react-dom/test-utils";
import MultiSelect from "../../../components/Base/MultiSelect";
import selectEvent from 'react-select-event';

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

it("renders no option select", () => {
  var ref = React.createRef()
    act(() => {
        render(<MultiSelect ref={ref} isMulti={true} isDisabled={false}/>, container);
      });
  var arr = [{title: 'Test1'},{title: 'Test2'}];
  ref.current.updateValues(arr);
  expect(container).toMatchSnapshot();
  var arr = [{title: 'Test1'},{title: 'Test2'}];
  ref.current.updateValues(arr);
  var select = container.querySelector(
    "input[id='react-select-2-input']"
  );
  selectEvent.select(select, 'Test2');
  expect(container).toMatchSnapshot();
});
