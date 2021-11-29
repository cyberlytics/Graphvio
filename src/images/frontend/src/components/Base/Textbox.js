import React from 'react';

import PropTypes from 'prop-types'


class Textbox extends React.Component 
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
        this.textbox.focus();
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
            <input
                type="text"
                ref={(input) => { this.textbox = input; }}
                value={this.state.value}
                onChange={this.handleChange.bind(this)}
                onKeyUp={this.handleKeyUp.bind(this)}
            />
        );
    }
} 
export default Textbox

