import React from 'react'
import propTypes from 'prop-types'
import {Button as BootstrapButton} from 'react-bootstrap'


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


    /*defaultProps = {
        onClick: ()=>{},
    }*/
}
Button.propTypes = {
    text: propTypes.string,
    variant: propTypes.string,
    type: propTypes.string,
    onClick: propTypes.func
}
export default Button