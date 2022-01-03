import React from 'react';
import TextBox from '../../Base/TextBox'
import Button from '../../Base/Button'
import {Form as SearchFormLabel, InputGroup} from 'react-bootstrap';
import './SearchForm.css'

class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
            provider: "amazon_prime",
        };

        this.textBox = null;

    }

    handleSubmit = form => event  => {
        event.preventDefault();
        form.searchFunction();
    }

    searchFunction() {
    }

    renderResults(){

    }

    renderTitle(){
        return "Search";
    }
    onValueChange = event  => {
        this.setState({
            provider: event.target.value
        });
      }

    render() {
        return (
            <div>
                <h2 style={{textAlign: 'center',marginBottom : 30}}>{this.renderTitle()}</h2>
                <SearchFormLabel onSubmit={this.handleSubmit(this)}>
                    <InputGroup>
                        <TextBox
                        ref={t => this.textBox = t } 
                        label="Search"
                        name="searchText"
                        value={this.state.searchText}
                        type = "submit"
                        />
                        {/* select button type from https://react-bootstrap.github.io/components/buttons/*/}
                        <Button type="submit" variant={this.props.color} text="Search"/>
                    </InputGroup>
                </SearchFormLabel>
                <div  id="provider_form" onChange={this.onValueChange}>
                    <div id="provider_button">
                    <input type="radio" value="amazon_prime" name="provider" defaultChecked/> Amazon Prime
                    </div>
                    <div id="provider_button">
                    <input type="radio" value="disney_plus" name="provider" /> Disney+
                    </div>
                    <div id="provider_button">
                    <input type="radio" value="netflix" name="provider" /> Netflix
                    </div>
                    <div id="provider_button"> 
                    <input type="radio" value="hulu" name="provider" /> Hulu
                    </div>
                </div>

                <div>
                    {this.renderResults()}
                </div>
            </div>
        );
    }
}
export default SearchForm