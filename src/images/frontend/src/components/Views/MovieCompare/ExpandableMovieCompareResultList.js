
import ExpandableList from "../../Base/ExpandableList";
import MovieComparePropsList from "./MovieComparePropsList";


class ExpandableMovieCompareResultList extends ExpandableList 
{
    renderExpandedComponent(index) 
    {
       return <MovieComparePropsList items={this.state.items[index]}/>;
	}

    returnDisplayName(item) {
		for(var index in this.state.items)
        {
            var tempItem = this.state.items[index];
            if(tempItem === item)
            return index;
        }
	}
	
}

export default ExpandableMovieCompareResultList;