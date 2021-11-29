import React from 'react';
import PropTypes from 'prop-types'


class Button extends React.Component {
    constructor(props) {
        super(props)
    }
    
    handleClick = () => {
        this.props.onClick()
    }
    
    render() {
        const { color,text, onClick } = this.props
    
        return (
        <button
            className={`button`}
            style={{ backgroundColor: color }}
            onClick={this.handleClick}
        >
            {text}
        </button>
        )
    }


    defaultProps = {
        onClick: ()=>{},
    }

    propTypes = {
    text: PropTypes.string,
    color: PropTypes.string,
    onClick: PropTypes.func,
    }
}
export default Button