
import React from 'react';
import MovieComparePropsList from "./MovieComparePropsList";
import "./ExpandableMovieCompareResultList.css"

class ExpandableMovieCompareResultList extends React.Component
{
    constructor(props)
    {
        super(props);
        this.state = {
            items: props.items,
        }
    }

    updateItems(items){
        this.setState({items: items});
    }

    renderSubGroup(subgroup,displayname){

        if(Object.keys( this.state.items[subgroup]).length === 0)
            return null;
        return <div>
                <p class="GroupTitle">{displayname}</p>
                <hr />
                <MovieComparePropsList items={this.state.items[subgroup]}/>
            </div>
    }

    render() {

        if(this.state.items.length === 0)
        {
            return null;
        }

        return (
          <div>
              {this.renderSubGroup("genre","Genres")}
              {this.renderSubGroup("director","Director")}
              {this.renderSubGroup("cast","Cast")}
              {this.renderSubGroup("country","Country of Origin")}
          </div>
        );
    }

}

export default ExpandableMovieCompareResultList;