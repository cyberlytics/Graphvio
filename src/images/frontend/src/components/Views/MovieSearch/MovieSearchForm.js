import SearchForm from "../Base/SearchForm";
import ExpandableMovieList from "../Base/ExpandableMovieList";
const Constants = require("Constants");

class MovieSearchFormbar extends SearchForm {
	constructor(props) {
		super(props);

		this.list = null;
		this.movies = [];
	}

	async searchFunction() {
		
		if(this.textBox.state.value.length > 0){
			const axios = require('axios');
			var url = `http://${Constants.BACKEND_URL}:${Constants.BACKEND_PORT}/db/search-movies?title=${this.textBox.state.value}&limit=${20}&provider=${this.state.provider}`;
			try {
				const response = await axios.get(url);
				
				this.movies = response.data;
				this.list.updateItems(this.movies);

			  } catch (error) {
				console.error(error);
			  }
		}
	}
	

	
    renderTitle(){
        return "Movie Search";
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
export default function MovieSearchForm(){
	return(
		<div>
			<h1>Moviesearch</h1>
			<MovieSearchFormbar/>
		</div>
		
	)
}