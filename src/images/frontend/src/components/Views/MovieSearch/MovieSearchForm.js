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
			//WTF is this in this context?
			xmlHttp.onload = () => this.parseMovies(xmlHttp,this);
			xmlHttp.send(null);
		}
	}

	parseMovies(xmlHttp,movieSearchForm){
		if (xmlHttp.readyState === 4) {
			if (xmlHttp.status === 200) {
			  if(xmlHttp.responseText.length > 0){
				movieSearchForm.movies = JSON.parse(xmlHttp.responseText);
				movieSearchForm.list.updateItems(this.movies);
			  }
			} else {
			  console.error(xmlHttp.statusText);
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