import React from "react";
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from "react-dom/test-utils";
import Dropdown from "../../../components/Base/Dropdown";

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

it("renders Movie Search correctly", () => {
  act(() => {
    render(
      <Dropdown
            title={"Movie Search"}
            color={"primary"}
            listElements={
              [
                { id: 0, title: "Movie Search", selected: true, key: 'modeObj', color:"primary" },
                { id: 1, title: "Person Search", selected: false, key: 'modeObj', color:"secondary" }
              ]
            }
      />,
       container);
  });
  expect(container).toMatchSnapshot();
});

// it("renders Person Search correctly", () => {
//   act(() => {
//     render(
//       <Dropdown
//             title={"Person Search"}
//             color={"secondary"}
//             listElements={
//               [
//                 { id: 0, title: "Movie Search", selected: false, key: 'modeObj', color:"primary" },
//                 { id: 1, title: "Person Search", selected: true, key: 'modeObj', color:"secondary" }
//               ]
//             }
//       />,
//        container);
//   });
//   expect(container).toMatchSnapshot();
// });

it("renders toggled correctly", () => {
  act(() => {
    let component = render(
      <Dropdown
            title={"Person Search"}
            color={"secondary"}
            listElements={
              [
                { id: 0, title: "Movie Search", selected: false, key: 'modeObj', color:"primary" },
                { id: 1, title: "Person Search", selected: true, key: 'modeObj', color:"secondary" }
              ]
            }
      />,
       container);
    
    component = component.toggleDropdown();
  });
  expect(container).toMatchSnapshot();
});

it("renders changed selection correctly", () => {
  act(() => {
    var component = render(
      <Dropdown
            title={"Movie Search"}
            color={"primary"}
            listElements={
              [
                { id: 0, title: "Movie Search", selected: true, key: 'modeObj', color:"primary" },
                { id: 1, title: "Person Search", selected: false, key: 'modeObj', color:"secondary" }
              ]
            }
            resetThenSet={(id, key)=>{return}}
      />,
      container
    );
    
    component.toggleDropdown();

    let newSelection = { id: 1, title: "Person Search", selected: false, key: 'modeObj', color:"secondary" };
    component.selectItem(newSelection)
  });

  expect(container).toMatchSnapshot();
});