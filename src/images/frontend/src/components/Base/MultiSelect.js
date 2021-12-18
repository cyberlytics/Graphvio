import React from 'react';
import Select from 'react-select';

class MultiSelect extends React.Component 
{     
  constructor(props)
    {
        super(props);
        this.state = {
          selectOption: [],
         };
}

/*method called from parent to set new options*/
    updateOptions = (options) =>
    {
      const optionsFormat = this.updateValues(options);
      this.setState({selectOption: optionsFormat});
  }

  /*method to extract title from options to react select conform type */
  updateValues(options)
  {
    return options.map(
        (member) => {
            return {
              /*a react-select needs a value and label property */
                value: (member.title),
                label: (member.title)
            }
        })
  }

  /*method to send input value from select to parent component*/
  handleInputChange =(changeValues)=>{
    const{getDropDownValuesForMultiSelect} = this.props;
    if(!this.props.isDisabled && changeValues !== undefined && changeValues !== "" && changeValues.length > 1)
    {
      getDropDownValuesForMultiSelect(changeValues)
    }
    else
    {
          this.setState({selectOption: []});
    }
  };

  /*method to set selected values of multi select to parent component*/
  handleValueSelect =(changeValueSelect)=>{
    const{SetValuesOfMultiSelect} = this.props;
    SetValuesOfMultiSelect(changeValueSelect)
  };

  render() 
  {   
    const {isMulti} = this.props;
    return (
      <Select
        onInputChange={e=>this.handleInputChange(e)}
        onChange={e=>this.handleValueSelect(e)}
        options={this.state.selectOption}
        isMulti={isMulti}
        isSearchable={true}
        closeMenuOnSelect={true}
        isSearchable={!this.props.isDisabled}
      />
    );
} 
}
export default MultiSelect