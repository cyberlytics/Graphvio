
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
    getDropDownValuesForMultiSelect = (inputValue) => 
    {
        var xmlHttp = new XMLHttpRequest();
        var url = `http://localhost:5000/db/search-movies?title=${inputValue}&limit=${20}`;
        xmlHttp.open( "GET", url, false ); 
        xmlHttp.onload = () => this.parseMovieTitles(xmlHttp, this);
        xmlHttp.send( null );
	  }

    
    parseMovieTitles(xmlHttp, movieCompare){
      if (xmlHttp.readyState === 4) {
        if (xmlHttp.status === 200) {
          if(xmlHttp.responseText.length > 0){
          movieCompare.multiSelect.updateOptions(JSON.parse(xmlHttp.responseText));
          }
        } else {
          console.error(xmlHttp.statusText);
        }
      }
    }

        /*method to request compare values from db after 
    movie select via dropdown*/
    getCompareValuesAfterMovieSelect = (inputValue) => 
    {
        var xmlHttp = new XMLHttpRequest();
        const strings = inputValue.map(x => `title=${x.value}`);
        const parameter= strings.join("&");
        var url = `http://localhost:5000/db/compare-movies?${parameter}`;
        xmlHttp.open( "GET", url, false ); 
        xmlHttp.onload = () => this.parseMovieMetaData(xmlHttp, this);
        xmlHttp.send( null );
	  }

      parseMovieMetaData(xmlHttp, movieCompare){
        if (xmlHttp.readyState === 4) {
          if (xmlHttp.status === 200) {
            if(xmlHttp.responseText.length > 0){
              this.list.updateItems(JSON.parse(xmlHttp.responseText));
            }
          } else {
            console.error(xmlHttp.statusText);
          }
        }
      }

      /*method to request database after movies selected in multi select*/
      SetValuesOfMultiSelect = (movieList) =>{
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
              isDisabled : true,
              MovieCompareValues: "following values found by compare:"
            }
            );
            this.getCompareValuesAfterMovieSelect(movieList)
        }
      }

  render() {
    return (
      <div>
      <p>type in more than one character to get search options</p>
      <MultiSelect 
      ref={(t) => this.multiSelect = t}
      getDropDownValuesForMultiSelect={this.getDropDownValuesForMultiSelect}
      SetValuesOfMultiSelect={this.SetValuesOfMultiSelect}
      isMulti={true}
      isDisabled={this.state.isDisabled}/>
      <p >{this.state.MovieCompareValues}</p>
      <ExpandableMovieCompareResultList ref={(l) => (this.list = l)} items={this.state.jsonResult}/>
      </div>
    );
  }
}
export default MovieCompareSelect