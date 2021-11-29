import React from 'react';

import Textbox from './Base/Textbox'
import List from './Base/List'
import Button from './Base/Button'

class SearchForm extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            searchText: '',
        };

        this.textbox = null;
        this.list = null;
        this.movies = [];
    }

    handleSubmit(e) {
        e.preventDefault();
    }

    searchFunction = () => {
        console.log(this.textbox.state.value);
        //TODO Backend call
        this.movies = ["Lord of the Rings","The Matrix","Harry Potter"]
        this.list.updateItems(this.movies);
    }

    render() {
        return (
        <form onSubmit={this.handleSubmit}>
            <Textbox
            ref={t => this.textbox = t } 
            label="Search"
            name="searchText"
            value={this.state.searchText}
            onEnter = {this.searchFunction}
            />
            <Button text="submit" onClick={this.searchFunction}>Search</Button>
        <div>
            <List ref={l => this.list = l}  items = {this.movies}/>
        </div>
        </form>
        );
    }
}
export default SearchForm