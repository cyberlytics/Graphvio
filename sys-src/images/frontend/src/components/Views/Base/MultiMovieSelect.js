import React from 'react';
import MultiSelect from '../../Base/MultiSelect';
const Constants = require("Constants");

class MultiMovieSelect extends React.Component {
    constructor(props)
    {
        super(props);
        this.multiSelect=null;
        this.state = {
          isDisabled: false,
          MovieCompareValues : this.getEmptyHint() 
         };
    }

    getEmptyHint(){
      return "not enough values set"
    }
        /*method to request dropdown values from db after 
    input of movie sub string*/
    async getDropDownValuesForMultiSelect(inputValue)
    {
      const axios = require('axios');
      var url = `http://${Constants.BACKEND_URL}:${Constants.BACKEND_PORT}/db/search-movies?title=${inputValue}&limit=${20}`;
      try {
        const response = await axios.get(url);
        this.multiSelect.updateOptions(response.data);   
      } catch (error) {
        console.error(error);
      }
	}


    SetValuesOfMultiSelect(values)
    {

    }


    renderResults(){
        return null;
    }

    returnCaption(){
        return null;
    }

    render() {
        return (
          <div>
          <h2 style={{textAlign: 'center',marginBottom : 30}}>{this.returnCaption()}</h2>
          <MultiSelect 
          ref={(t) => this.multiSelect = t}
          getDropDownValuesForMultiSelect={this.getDropDownValuesForMultiSelect.bind(this)}
          SetValuesOfMultiSelect={this.SetValuesOfMultiSelect.bind(this)}
          isMulti={true}
          isDisabled={this.state.isDisabled}/>
          <p >{this.state.MovieCompareValues}</p>
          {this.renderResults.bind(this)()}
          </div>
        );
      }

}

export default MultiMovieSelect