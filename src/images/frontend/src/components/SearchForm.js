import React from 'react';
import TextBox from './Base/TextBox'
import ExpandableMovieList from './ExpandableMovieList'
import Button from './Base/Button'
import {Form as SearchFormLabel, InputGroup} from 'react-bootstrap';
import './SearchForm.css'

class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
        };

        this.textBox = null;
        this.list = null;
        this.movies = [];
    }

    handleSubmit(e) {
        e.preventDefault();
    }

    searchFunction = () => {
        console.log(this.textBox.state.value);
        //TODO Backend call
        this.movies = ["Lord of the Rings","The Matrix","Harry Potter"]
        this.list.updateItems(this.movies);
    }

    render() {
        return (
        <SearchFormLabel onSubmit={this.handleSubmit}>
            <InputGroup>
            <TextBox
            ref={t => this.textBox = t } 
            label="Search"
            name="searchText"
            value={this.state.searchText}
            onEnter = {this.searchFunction}
            />
            {/* select button type from https://react-bootstrap.github.io/components/buttons/*/}
            <Button text="submit" variant="primary" onClick={this.searchFunction}>Search</Button>
            </InputGroup>
        <div>
            <ExpandableMovieList ref={l => this.list = l}  items = {this.movies}/>
        </div>
        </SearchFormLabel>
        );
    }
}
export default SearchForm