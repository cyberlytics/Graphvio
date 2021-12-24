import ExpandablePersonList from "./ExpandablePersonList";
import React from 'react';
import TextBox from '../../Base/TextBox'
import Button from '../../Base/Button'
import {Form as SearchFormLabel, InputGroup} from 'react-bootstrap';

class PersonSearchForm extends React.Component {
	constructor(props) {
		super(props);
		this.state = {	searchText: '',
						peopletypes: {
							Regisseur		:	true,
							Bildregisseur	:	true,
							Schauspieler	:	true,
							Komponist		:	true,
						},
					};
		this.textBox = null;
		this.list = null;
		this.persons = [];
	}

	handleSubmit = form => event  => {
        event.preventDefault();
        form.searchFunction();
    }

	handleCheckbox = event => {
		let state = this.state;
		state.peopletypes[event.target.value] = event.target.checked;
		this.setState(state);
		console.log(this.state.peopletypes.Regisseur);
	}

	searchFunction() {
		if(this.textBox.state.value.length > 0){
			var xmlHttp = new XMLHttpRequest();
			var url = `http://localhost:5000/db/search-persons?name=${this.textBox.state.value}&limit=${20}`; //TODO Backend call
			xmlHttp.open( "GET", url, false ); 
			xmlHttp.send( null );
			if(xmlHttp.responseText.length > 0){
				this.persons = JSON.parse(xmlHttp.responseText)
				this.list.updateItems(this.persons);
			}
		}
	}

	renderResults() {
		return (
			<ExpandablePersonList
				ref={(l) => (this.list = l)}
				items={this.persons}
			/>
		);
	}

	renderChoice(){
		return <div>
				<div class="form-check form-check-inline">
					<input class="form-check-input" onChange={this.handleCheckbox} type="checkbox" id="cb_Regisseur" value="Regisseur" checked={this.state.peopletypes.Regisseur}></input>
					<label class="form-check-label" for="inlineCheckbox1">Regisseur</label>
				</div>
				<div class="form-check form-check-inline">
					<input class="form-check-input" onChange={this.handleCheckbox} type="checkbox" id="cb_Komponist" value="Komponist" checked={this.state.peopletypes.Komponist}></input>
					<label class="form-check-label" for="inlineCheckbox2">Komponist</label>
				</div>
				<div class="form-check form-check-inline">
					<input class="form-check-input" onChange={this.handleCheckbox} type="checkbox" id="cb_Schauspieler" value="Schauspieler" checked={this.state.peopletypes.Schauspieler}></input>
					<label class="form-check-label" for="inlineCheckbox3">Schauspieler</label>
				</div>
				<div class="form-check form-check-inline">
					<input class="form-check-input" onChange={this.handleCheckbox} type="checkbox" id="cb_Bildregisseur" value="Bildregisseur" checked={this.state.peopletypes.Bildregisseur}></input>
					<label class="form-check-label" for="inlineCheckbox4">Bildregisseur</label>
				</div>
			</div>
	}

	render() {
        return (
            <div>
				<p>Here you can search people who worked on movies and series.</p>
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
				{this.renderChoice()}
                <div>
                    {this.renderResults()}
                </div>
            </div>
        );
    }
}
export default PersonSearchForm;