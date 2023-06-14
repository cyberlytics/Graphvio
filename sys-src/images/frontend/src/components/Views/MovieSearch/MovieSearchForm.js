import SearchForm from "../Base/SearchForm";
import ExpandableMovieList from "../Base/ExpandableMovieList";
const Constants = require("Constants");

class MovieSearchForm extends SearchForm {
	constructor(props) {
		super(props);

		this.list = null;
		this.movies = [];
		this.provider = "all";
	}

	async searchFunction() {
		
		if(this.textBox.state.value.length > 0){
			const axios = require('axios');
			var url = `http://${Constants.BACKEND_URL}:${Constants.BACKEND_PORT}/db/search-movies?title=${this.textBox.state.value}&limit=${20}`;
			if(this.provider !== "all"){
				url += `&provider=${this.provider}`;
			}
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


	onValueChange = event  => {
            this.provider = event.target.value
      }

	renderAdditionalContent(){
		return (<div  id="provider_form" onChange={this.onValueChange}>
		<div id="provider_button">
		<input type="radio" value="all" name="provider" defaultChecked/> All
		</div>
		<div id="provider_button">
		<input type="radio" value="amazon_prime" name="provider"/> Amazon Prime
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
	</div>)
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