import React from 'react';
import Collapsible from 'react-collapsible';
import "./ExpandableList.css";
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

    returnTrigger(item){
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
            <Collapsible trigger={this.returnTrigger(this.state.items[index])}  transitionTime={300}>
                <div>{this.renderExpandedComponent(this.state.items[index])}</div>
            </Collapsible>
            )
        }
        return <div>{renderedListItems}</div>;
    }
}

export default ExpandableList

