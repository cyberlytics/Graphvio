import React from "react"
import propTypes from "prop-types"
import {
  ButtonDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from "reactstrap"

class Dropdown extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      dropdownOpen: false,
      title: this.props.title,
      selectedItemName: null,
    };
  }

  toggleDropdown = () => {
    this.setState({ dropdownOpen: !this.state.dropdownOpen });
  };

  selectItem = (item) => {
    const { resetThenSet } = this.props;
    const { id, key, title } = item;
    this.selectedItemName = title;

    this.setState(
      {
        title: title,
        isListOpen: false,
      },
      () => resetThenSet(id, key)
    );
  };

  /*https://blog.logrocket.com/validating-react-component-props-with-prop-types-ef14b29963fc/*/
  /*https://blog.logrocket.com/building-a-custom-dropdown-menu-component-for-react-e94f02ced4a1/*/
  render() {
    const { dropdownOpen, title } = this.state;
    const { listElements } = this.props;

    return (
        <ButtonDropdown isOpen={dropdownOpen} toggle={this.toggleDropdown} title={this.selectedItemName || title}>
          <DropdownToggle color={this.props.color}>{this.selectedItemName || title}</DropdownToggle>
          <DropdownMenu>
            {listElements.map((item) => (
              <DropdownItem onClick={() => this.selectItem(item)} key={item.id}>
                {item.title}
              </DropdownItem>
            ))}
          </DropdownMenu>
        </ButtonDropdown>
    );
  }
}

Dropdown.propTypes =
{
  title: propTypes.string,     
  listElements: propTypes.array 
}


export default Dropdown;
