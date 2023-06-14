import React from 'react';
import ExpandableMovieCompareResultList from './ExpandableMovieCompareResultList';
import MultiMovieSelect from '../Base/MultiMovieSelect';
const Constants = require("Constants");
class MovieCompareSelect extends MultiMovieSelect {
    constructor(props)
    {
        super(props);
        this.movieData = [];
        this.list = null;
    }

    getEmptyHint(){
      return "select 2 or more values to show similarities between movies ..."
    }


    /*method to request compare values from db after 
    movie select via dropdown*/
    async getCompareValuesAfterMovieSelect(inputValue)
    {
        const axios = require('axios');
        var strings = inputValue.map(x => `title=${x.value}`);
        var parameter= strings.join("&");
        var url = `http://${Constants.BACKEND_URL}:${Constants.BACKEND_PORT}/db/compare-movies?${parameter}`;

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
      SetValuesOfMultiSelect(values)
      {

        if(values.length < 2)
        {
          this.setState(
            {
              isDisabled : false,
              MovieCompareValues : this.getEmptyHint()
            }
            );
            this.list.updateItems([]);
        }
        else
        {
          this.setState(
            {
              MovieCompareValues: "following values found by compare:",
            });
            this.getCompareValuesAfterMovieSelect(values)
        }
      }


  returnCaption(){
        return "Movie Compare";
  }

  renderResults(){
    return <div>
              {<ExpandableMovieCompareResultList ref={(l) => (this.list = l)} items={this.movieData}/>}
            </div>
  }
}
export default MovieCompareSelect