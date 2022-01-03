import React from "react";
import { Nav, Navbar, NavDropdown } from 'react-bootstrap'

class Header extends React.Component {
    render(){
        return (
            <div className="App-header">
            <Navbar bg="dark" variant="dark"
            sticky="top" expand="sm" collapseOnSelect>
            <Navbar.Brand>
                <Nav.Link href="/">Graphvio</Nav.Link>
            </Navbar.Brand>
    
            <Navbar.Toggle className="coloring" />
            <Navbar.Collapse>
              <Nav>
                <NavDropdown title="Navigation">
                  <NavDropdown.Item href="/MovieSearchForm">Movie Search</NavDropdown.Item>
                  <NavDropdown.Item href="/MovieCompareSelect">Movie Compare</NavDropdown.Item>
                  <NavDropdown.Item href="/MovieRecommendForm">Movie Recommend</NavDropdown.Item>
                </NavDropdown>
                <Nav.Link href="/about-us">About Us</Nav.Link>
              </Nav>
            </Navbar.Collapse>
    
          </Navbar>
          </div>
        );
    }
}
export default Header;