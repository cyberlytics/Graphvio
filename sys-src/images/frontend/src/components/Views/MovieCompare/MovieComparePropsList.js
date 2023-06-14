
import ExpandableList from "../../Base/ExpandableList";
import "./MovieComparePropsList.css"

class MovieComparePropsList extends ExpandableList 
{
    renderExpandedComponent(index) 
    {
        var indexItems = this.state.items[index];
        var listItems = indexItems.map((name) => <li key={name} className="matchedMovie">{name}</li>);
        return (<ul>{listItems}</ul>);
	}

    returnDisplayName(item) 
    {
        return this.getNameOfObject(item);
	}

    getNameOfObject(item)
    {
		for(var index in this.state.items)
        {
            var tempItem = this.state.items[index];
            if(tempItem === item)
            return index;
        }
    }
	
}

export default MovieComparePropsList;