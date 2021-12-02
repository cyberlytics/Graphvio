import React from 'react';
import PropTypes from 'prop-types'
import {Button as BootstrapButton} from 'react-bootstrap';


class Button extends React.Component 
{   
    handleClick = () => {
        this.props.onClick()
    }
    
    render() {
        const { variant,text } = this.props
    
        return (
        <BootstrapButton 
        variant={variant}
        onClick={this.handleClick}
        >
            {text}
        </BootstrapButton>
        )
    }


    defaultProps = {
        onClick: ()=>{},
    }

    propTypes = {
    text: PropTypes.string,
    variant: PropTypes.string,
    onClick: PropTypes.func,
    }
}
export default Button