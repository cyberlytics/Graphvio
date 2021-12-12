import SearchForm from "../Base/SearchForm";
import ExpandablePersonList from "./ExpandablePersonList";

class PersonSearchForm extends SearchForm {
	constructor(props) {
		super(props);

		this.list = null;
		this.persons = [];
	}

	searchFunction() {
		if(this.textBox.state.value.length > 0){
			var xmlHttp = new XMLHttpRequest();
			var url = `http://localhost:5000/db/search-movies?title=${this.textBox.state.value}&limit=${20}`; //TODO Backend call
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
}
export default PersonSearchForm;