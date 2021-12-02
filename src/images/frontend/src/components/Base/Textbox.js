import React from 'react';
import {FormControl as BootstrapTextBox} from 'react-bootstrap';

class TextBox extends React.Component 
{
    constructor(props) 
    {
        super(props);
        this.state = {
            value: props.value
        };
    }

    componentDidMount() 
    {
        this.textBox.focus();
    }

    handleChange(event) 
    {
        this.setState({
            value: event.target.value
        });
    }

    handleKeyUp(event) 
    {
        if (event.keyCode === 13) 
        {
            //this.props.onEnter(this.state.value);
        }
    }

    render() 
    {
        return (
            <BootstrapTextBox
                type="text"
                ref={(input) => { this.textBox = input; }}
                value={this.state.value}
                onChange={this.handleChange.bind(this)}
                onKeyUp={this.handleKeyUp.bind(this)}
            />
        );
    }
} 
export default TextBox

