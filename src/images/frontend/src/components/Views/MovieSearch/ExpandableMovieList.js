import React from "react";
import ExpandableList from "../../Base/ExpandableList";
import InfoCard from "../..//Base/Card";
import { Card } from "react-bootstrap";
import "./MovieListItem.css";
import { Link } from "react-router-dom";

class MovieListItem extends InfoCard {
	constructor(props) {
		super(props);
		this.state = {
			movieData: this.props.movieData,
		};
	}

	Update(newMovieData) {
		this.setState({ movieData: newMovieData });
	}

	renderProvider(providers) {
		let mappedProviders = [];
		if (providers.includes("netflix")) {
			mappedProviders.push("Netflix");
		}
		if (providers.includes("disney_plus")) {
			mappedProviders.push("Disney+");
		}
		if (providers.includes("amazon_prime")) {
			mappedProviders.push("Amazon Prime");
		}
		if (providers.includes("hulu")) {
			mappedProviders.push("Hulu");
		}

		return mappedProviders.join(", ");
	}
	renderCast(cast) {
		if (typeof cast === "undefined") return "-";

		let renderedCast = [];
		var members = cast.split(",");
		for (var i in members) {
			renderedCast.push(
				<li key={members[i].trim()}> {members[i].trim()} </li>
			);
		}
		return <ul>{renderedCast}</ul>;
	}

	renderDate(date) {
		if (typeof date === "undefined") return "-";
		return date;
	}

	renderCardBody() {
		return (
			<div>
				<div>
					<img
						src={this.state.movieData.metadata.image}
						alt={"No_Image_Available.jpg"}
						width="200"
					/>
					<hr />
					<b>Description : </b>
					<Card.Text>
						{`${this.state.movieData.metadata.description}`}
					</Card.Text>
				</div>
				<hr />
				<div class="grid-container">
					<div class="left">
						<Card.Text>
							<b>Rating : </b>
							{`${this.state.movieData.metadata.imdb}`}
						</Card.Text>
						<Card.Text>
							<b>Genre : </b>
							{`${this.state.movieData.metadata.genre}`}
						</Card.Text>
						<Card.Text>
							<b>Type : </b>
							{`${this.state.movieData.metadata.type}`}
						</Card.Text>
						<Card.Text>
							<b>Release Year : </b>
							{`${this.state.movieData.metadata.release_year}`}
						</Card.Text>
						<Card.Text>
							<b>FSK : </b>
							{`${this.state.movieData.metadata.rating}`}
						</Card.Text>
						<Card.Text>
							<b>Duration : </b>
							{`${this.state.movieData.metadata.duration}`}
						</Card.Text>
						<Card.Text>
							<b>Country : </b>
							{`${this.state.movieData.metadata.country}`}
						</Card.Text>
						<Card.Text>
							<b>Provider: </b>
							{this.renderProvider(this.state.movieData.provider)}
						</Card.Text>
						<Card.Text>
							<b>Added : </b>
							{this.renderDate(
								this.state.movieData.metadata.date_added
							)}
						</Card.Text>
					</div>
					<div class="right">
						<Card.Text>
							<b>Director : </b>
							{`${this.state.movieData.metadata.director}`}
						</Card.Text>
						<Card.Text>
							<b>
								<Link
									classname="castLink"
									to={{
										pathname: "/CastList",
										state: [
											`${this.state.movieData.title}`,
											`${this.state.movieData.metadata.release_year}`,
										],
									}}
								>
									Cast
								</Link>{" "}
								:{" "}
							</b>
							{this.renderCast(
								this.state.movieData.metadata.cast
							)}
						</Card.Text>
					</div>
				</div>
			</div>
		);
	}
}

class ExpandableMovieList extends ExpandableList {
	renderExpandedComponent(index) {
		if (!this.state.items[index].metadata.hasOwnProperty("imdb")) {
			this.state.items[index].metadata["imdb"] = "-";
			this.state.items[index].metadata["image"] =
				".\\No_Image_Available.jpg";
		}
		return (
			<MovieListItem
				movieData={this.state.items[index]}
				ref={(ref) => this.renderedItemsRef.push(ref)}
				key={this.state.items[index].title}
			/>
		);
	}

	returnDisplayName(item) {
		return item["title"];
	}

	async handleItemOnOpen(index) {
		if (this.state.items[index]["metadata"]["imdb"] === "-") {
			await this.retrieveIMDBData(index);
		}
	}

	async retrieveIMDBData(index) {
		const axios = require("axios");
		var url = `http://localhost:5000/imdb/search-imdbdata?title=${this.state.items[index]["title"]}&type=${this.state.items[index]["metadata"]["type"]}`;
		try {
			const response = await axios.get(url);
			if (response.status !== 200) {
				console.warn("Reached Maximum usage of IMDB API!");
				return;
			}
			this.state.items[index]["metadata"]["imdb"] = response.data["imDb"];
			this.state.items[index]["metadata"]["image"] =
				response.data["image"];
			this.renderedItemsRef[index].Update(this.state.items[index]);
		} catch (error) {
			console.error(error);
		}
	}

	parseIMDBData(xmlHttp, index, expandableMovieList) {
		if (xmlHttp.readyState === 4) {
			if (xmlHttp.status === 200) {
				if (xmlHttp.responseText.length > 0) {
					var response = JSON.parse(xmlHttp.responseText);
					if (xmlHttp.responseText.includes("Maximum usage")) {
						console.warn("Reached Maximum usage of IMDB API!");
						return;
					}
					expandableMovieList.state.items[index]["metadata"]["imdb"] =
						response["imDb"];
					expandableMovieList.state.items[index]["metadata"][
						"image"
					] = response["image"];
					expandableMovieList.renderedItemsRef[index].Update(
						expandableMovieList.state.items[index]
					);
				}
			} else {
				console.error(xmlHttp.statusText);
			}
		}
	}
}
export default ExpandableMovieList;
