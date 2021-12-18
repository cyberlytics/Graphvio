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

    returnDisplayName(item){
        return null
    }

    handleItemOnOpen(index){
        return null
    }

    render()
    {
        if(this.state.items.length === 0)
        {
            return null;
        }

        var renderedListItems = []

        for(var index in this.state.items){
            var item = this.state.items[index];
            var content = this.renderExpandedComponent(item);
            renderedListItems.push(
            <Collapsible trigger={this.returnDisplayName(item)}  transitionTime={300} onOpening ={this.handleItemOnOpen.bind(this,index)}>
                {content}
            </Collapsible>
            )
        }
        return <div>{renderedListItems}</div>;
    }
}

export default ExpandableList

