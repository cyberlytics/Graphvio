import React from 'react';
import PropTypes from 'prop-types'
import {Button as BootstrapButton} from 'react-bootstrap';


class Button extends React.Component 
{   
    handleClick = () => { 
        if("onClick" in this.props)
        {
            this.props.onClick()
        }
    }
    
    render() {
        const { variant,text,type } = this.props
    
        return (
        <BootstrapButton 
        variant={variant}
        onClick={this.handleClick}
        type={type}
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
    type: PropTypes.string,
    onClick: PropTypes.func,
    }
}
export default Button