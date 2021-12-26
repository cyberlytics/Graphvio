
import ExpandableList from "../../Base/ExpandableList";
import "./MovieComparePropsList.css"

class MovieComparePropsList extends ExpandableList 
{
    renderExpandedComponent(index) 
    {
        var listItems = this.state.items[index].map((name) => <li key={name} class="matchedmovie">{name}</li>);
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