import React from 'react';
import Collapsible from 'react-collapsible';

class ExpandableList extends React.Component
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

    renderExpandedComponent(item){
        return null
    }

    render()
    {
        if(this.state.items.length === 0)
        {
            return null;
        }

        let renderedListItems = []

        for(let index in this.state.items){
            renderedListItems.push(
            <Collapsible trigger={this.state.items[index]}  transitionTime={300}>
                {this.renderExpandedComponent(this.state.items[index])}
            </Collapsible>
            )
        }
        return <tbody>{renderedListItems}</tbody>;
    }
}

export default ExpandableList

