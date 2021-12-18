
import React from 'react';
import MultiSelect from '../../Base/MultiSelect';



class MovieCompareSelect extends React.Component {
    constructor(props)
    {
        super(props);
        this.multiSelect=null;
    }

    /*method to request dropdown values from db after 
    input of movie sub string*/
    getDropDownValuesForMultiSelect = (inputValue) => {
        var xmlHttp = new XMLHttpRequest();
        var url = `http://localhost:5000/db/search-movies?title=${inputValue}&limit=${20}`;
        xmlHttp.open( "GET", url, false ); 
        xmlHttp.send( null );
        if(xmlHttp.responseText.length > 0)
        {
          this.multiSelect.updateOptions(JSON.parse(xmlHttp.responseText))
        }
	    }

      /*method to request database after movies selected in multi select*/
      SetValuesOfMultiSelect = (movieList) =>{
          /* request for movie list, currently unused value for db call*/
          /*const values = movieList.map(function (params) {
            return params.value
          })*/
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
      ></MultiSelect>
      </div>
    );
  }
}
export default MovieCompareSelect