import SearchForm from "../Base/SearchForm";
import ExpandableMovieList from "./ExpandableMovieList";

class MovieSearchForm extends SearchForm {
	constructor(props) {
		super(props);

		this.list = null;
		this.movies = [];
	}

	searchFunction() {
		if(this.textBox.state.value.length > 0){
			var xmlHttp = new XMLHttpRequest();
			var url = `http://localhost:5000/db/search-movies?title=${this.textBox.state.value}&limit=${20}`;
			xmlHttp.open( "GET", url, false ); 
			xmlHttp.send( null );
			if(xmlHttp.responseText.length > 0){
				this.movies = JSON.parse(xmlHttp.responseText)
				this.list.updateItems(this.movies);
			}
		}
	}

	renderResults() {
		return (
			<ExpandableMovieList
				ref={(l) => (this.list = l)}
				items={this.movies}
			/>
		);
	}
}
export default MovieSearchForm;