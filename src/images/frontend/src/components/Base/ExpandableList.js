import React from 'react';
import Collapsible from 'react-collapsible';
import "./ExpandableList.css";
class ExpandableList extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            items: props.items,
        }
        this.renderedItemsRef = [];
    }

    updateItems(items){
        this.setState({items: items});
    }

    renderExpandedComponent(index){
        return null
    }

    returnDisplayName(item){
        return null
    }

    async handleItemOnOpen(index){
        return null
    }

    render()
    {
        //Clear the rendered items
        this.renderedItemsRef.length = 0;

        if(this.state.items.length === 0)
        {
            return null;
        }

        let renderedCollapsibleItems = [];
        
        for(var index in this.state.items){
            var item = this.state.items[index];
            var content = this.renderExpandedComponent.bind(this)(index);

            renderedCollapsibleItems.push(
            <Collapsible trigger={this.returnDisplayName(item)}  transitionTime={300} onOpening = {this.handleItemOnOpen.bind(this,index)} key={`Collapsible_${this.returnDisplayName(item)}`}>
                {content}
            </Collapsible>
            )
        }
        return <div>{renderedCollapsibleItems}</div>;
    }
}

export default ExpandableList

