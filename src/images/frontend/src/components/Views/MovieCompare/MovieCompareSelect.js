
import React from 'react';
import MultiSelect from '../../Base/MultiSelect';
import ExpandableMovieCompareResultList from './ExpandableMovieCompareResultList';


class MovieCompareSelect extends React.Component {
    constructor(props)
    {
        super(props);
        this.multiSelect=null;
        this.list = null;
        this.state = {
          isDisabled: false,
          jsonResult : [],
          MovieCompareValues : "not enough values set, to show movie compare"
         };
    }

    /*method to request dropdown values from db after 
    input of movie sub string*/
    async getDropDownValuesForMultiSelect(inputValue)
    {
      const axios = require('axios');
      var url = `http://localhost:5000/db/search-movies?title=${inputValue}&limit=${20}`;
      try {
        const response = await axios.get(url);
        this.multiSelect.updateOptions(response.data);   
      } catch (error) {
        console.error(error);
      }
	  }

    /*method to request compare values from db after 
    movie select via dropdown*/
    async getCompareValuesAfterMovieSelect(inputValue)
    {
        const axios = require('axios');
        var strings = inputValue.map(x => `title=${x.value}`);
        var parameter= strings.join("&");
        var url = `http://localhost:5000/db/compare-movies?${parameter}`;

        try {
          const response = await axios.get(url);

          this.list.updateItems(response.data);
          this.setState(
          {
            isDisabled : false
          });
        } catch (error) {
          console.error(error);
        }
	  }

      /*method to request database after movies selected in multi select*/
      SetValuesOfMultiSelect(movieList)
      {
          /* request for movie list, currently unused value for db call*/
          /*const values = movieList.map(function (params) {
            return params.value
          })*/
          /*later replace if metadata found for selected movies */
        if(movieList.length < 2)
        {
          this.setState(
            {
              isDisabled : false,
            }
            );
            this.list.updateItems([])
        }
        else
        {
          this.setState(
            {
              MovieCompareValues: "following values found by compare:"
            });
            this.getCompareValuesAfterMovieSelect(movieList)
        }
      }

  render() {
    return (
      <div>
      <p>type in more than one character to get search options</p>
      <MultiSelect 
      ref={(t) => this.multiSelect = t}
      getDropDownValuesForMultiSelect={this.getDropDownValuesForMultiSelect.bind(this)}
      SetValuesOfMultiSelect={this.SetValuesOfMultiSelect.bind(this)}
      isMulti={true}
      isDisabled={this.state.isDisabled}/>
      <p >{this.state.MovieCompareValues}</p>
      <ExpandableMovieCompareResultList ref={(l) => (this.list = l)} items={this.state.jsonResult}/>
      </div>
    );
  }
}
export default MovieCompareSelect