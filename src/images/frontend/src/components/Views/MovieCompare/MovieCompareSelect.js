
import React from 'react';
import MultiSelect from '../../Base/MultiSelect';



class MovieCompareSelect extends React.Component {
    constructor(props)
    {
        super(props);
        this.multiSelect=null;
        this.state = {
          isDisabled: false
         };
    }

    /*method to request dropdown values from db after 
    input of movie sub string*/
    getDropDownValuesForMultiSelect = (inputValue) => {
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

      /*method to request database after movies selected in multi select*/
      SetValuesOfMultiSelect = (movieList) =>{
          /* request for movie list, currently unused value for db call*/
          /*const values = movieList.map(function (params) {
            return params.value
          })*/
          /*later replace if metadata found for selected movies */
        if(movieList.length > 2)
        {
          this.setState({isDisabled : true});
        }
        else
        {
          this.setState({isDisabled : false});
        }
      }

      displayExtendedList()
      {
          if(this.state.isDisabled)
          {
              return <p>no metadata for different movies found</p>
          }
          else
          {
              return null
          }
      }

  render() {
    return (
      <div>
      <p>type in more than one character</p>
      <MultiSelect 
      ref={(t) => this.multiSelect = t}
      getDropDownValuesForMultiSelect={this.getDropDownValuesForMultiSelect}
      SetValuesOfMultiSelect={this.SetValuesOfMultiSelect}
      isMulti={true}
      isDisabled={this.state.isDisabled}
      ></MultiSelect>
      {this.displayExtendedList()}
      </div>
    );
  }
}
export default MovieCompareSelect