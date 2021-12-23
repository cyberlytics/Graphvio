
import ExpandableList from "../../Base/ExpandableList";


class MovieComparePropsList extends ExpandableList 
{
    renderExpandedComponent(index) 
    {
        const objToDisplay = this.state.items[index];
        const listItems = objToDisplay[this.getNameOfObject(objToDisplay)].map((name) => <li key={name}>{name}</li>);
        return (<ul>{listItems}</ul>);
	}

    returnDisplayName(item) 
    {
        return this.getNameOfObject(item);
	}

    getNameOfObject(item)
    {
        const name = Object.keys(item).map(key => {return key});
        return name[0];
    }
	
}

export default MovieComparePropsList;