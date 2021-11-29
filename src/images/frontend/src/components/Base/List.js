import React from 'react';

import PropTypes from 'prop-types'


class List extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            items: this.props.items
        }
    }

    updateItems(items){
        this.setState({items: items});
    }
    render()
    {
        if(this.state.items.length === 0)
        {
            return null;
        }

        return (
            <ul>
                {this.state.items.map((item, index) =>
                    <li key={index}>{item}</li>
                )}
            </ul>
        )
    }
}

export default List