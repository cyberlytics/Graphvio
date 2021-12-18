import React from "react";
import ExpandableList from "../../Base/ExpandableList";
import InfoCard from "../..//Base/Card";
import { Card, Grid } from "react-bootstrap";
import "./MovieListItem.css";

class MovieListItem extends InfoCard {
	constructor(props) {
		super(props);
		this.state = {
			movieData: this.props.movieData,
		};
	}

    renderProvider(providers){
        let mappedProviders = [];
        if(providers.includes('netflix')){
            mappedProviders.push("Netflix");
        }
        if(providers.includes('disney_plus')){
            mappedProviders.push("Disney+");
        }
        if(providers.includes('amazon_prime')){
            mappedProviders.push("Amazon Prime");
        }
        if(providers.includes('hulu')){
            mappedProviders.push("Hulu");
        }

        return mappedProviders.join(", ");
    }
    renderCast(cast){
        let renderedCast = [];
        var members = cast.split(",");
        for(var i in members){
            renderedCast.push(<li>{members[i].trim()}</li>)
        }
        return <div><ul>{renderedCast}</ul></div>;
    }

    renderDate(date){
        if(typeof date === 'undefined')
            return '-';
        return date;
    }

	renderCardBody() {
		return (
			<div>
				<div class="grid-container">
					<div class="header">
                        <b>Description : </b>
						<Card.Text>
							{`${this.state.movieData.metadata.description}`}
						</Card.Text>
						<hr />
					</div>
					<div class="left">
						<Card.Text>
                            <b>Rating : </b>{`${this.state.movieData.metadata.imdb}`}
						</Card.Text>
                        <Card.Text>
                            <b>Genre : </b>{`${this.state.movieData.metadata.genre}`}
						</Card.Text>
                        <Card.Text>
                            <b>Type : </b>{`${this.state.movieData.metadata.type}`}
						</Card.Text>
                        <Card.Text>
                            <b>Release Year : </b>{`${this.state.movieData.metadata.release_year}`}
						</Card.Text>
                        <Card.Text>
                            <b>FSK : </b>{`${this.state.movieData.metadata.rating}`}
						</Card.Text>
                        <Card.Text>
                            <b>Duration : </b>{`${this.state.movieData.metadata.duration}`}
						</Card.Text>
                        <Card.Text>
                            <b>Country : </b>{`${this.state.movieData.metadata.country}`}
						</Card.Text>
                        <Card.Text>
                            <b>Provider: </b>{this.renderProvider(this.state.movieData.provider)}
						</Card.Text>
                        <Card.Text>
                        <b>Added : </b>{this.renderDate(this.state.movieData.metadata.date_added)}
						</Card.Text>
					</div>
					<div class="right">
						<Card.Text>
                            <b>Director : </b>{`${this.state.movieData.metadata.director}`}
						</Card.Text>
						<Card.Text>
                            <b>Cast : </b>{this.renderCast(this.state.movieData.metadata.cast)}
						</Card.Text>
					</div>
				</div>
			</div>
		);
	}
}

class ExpandableMovieList extends ExpandableList {
	renderExpandedComponent(item) {
		if (!item.metadata.hasOwnProperty("imdb")) {
			item.metadata["imdb"] = "-";
		}
		return <MovieListItem movieData={item} />;
	}

	returnDisplayName(item) {
		return item["title"];
	}

	handleItemOnOpen(index) {
		this.retrieveIMDBData(index);
	}

	retrieveIMDBData(index) {
		//TODO Fix Get Request
		return;

		var xmlHttp = new XMLHttpRequest();
		var url = `http://localhost:5000/imdb/search-imdbdata?title=${this.state.items[index]["title"]}&type=${this.state.items[index]["metadata"]["type"]}`;
		xmlHttp.open("GET", url, false);
		xmlHttp.onload = () => this.parseMovies(xmlHttp, index, this);
		xmlHttp.send(null);
	}

	parseIMDBData(xmlHttp, index, expandableMovieList) {
		if (xmlHttp.readyState === 4) {
			if (xmlHttp.status === 200) {
				if (xmlHttp.responseText.length > 0) {
					var response = JSON.parse(xmlHttp.responseText);
					expandableMovieList.state.items[index]["metadata"]["imdb"] =
						response;
					//TODO Rerender needed?
				}
			} else {
				console.error(xmlHttp.statusText);
			}
		}
	}
}
export default ExpandableMovieList;
