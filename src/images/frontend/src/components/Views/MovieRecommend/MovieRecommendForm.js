
import React from 'react';
import MultiMovieSelect from '../Base/MultiMovieSelect';
import ExpandableMovieList from "../Base/ExpandableMovieList";
const Constants = require("Constants");


class MovieRecommendForm extends MultiMovieSelect {
    constructor(props)
    {
        super(props);
        this.movieData = [];
        this.list = null;
    }

async getRecommendationsAfterMovieSelect(inputValue)
{
    const axios = require('axios');
    var strings = inputValue.map(x => `title=${x.value}`);
    var parameter= strings.join("&");
    var url = `http://${Constants.BACKEND_URL}:${Constants.BACKEND_PORT}/db/search-similar-movies?${parameter}`;

    try {
      const response = await axios.get(url);

      this.movieData = response.data
      this.setState(
      {
        MovieCompareValues: "Following Movies found by Recommend:",
        isDisabled : false
      });
      this.list.updateItems(this.movieData);
    } catch (error) {
      console.error(error);
    }
  }


 /*method to request database after movies selected in multi select*/
 SetValuesOfMultiSelect(values)
 {

   if(values.length < 2)
   {
    this.movieData = [];
     this.setState(
       {
         isDisabled : false
       }
       );
       this.list.updateItems(this.movieData);
   }
   else
   {
       this.getRecommendationsAfterMovieSelect(values);
   }
 }


 returnCaption(){
  return "Movie Recommendations";
}


 renderResults(){
    return <div>
              {<ExpandableMovieList ref={(l) => (this.list = l)} items={this.movieData}/>}
            </div>
  }

}
export default MovieRecommendForm