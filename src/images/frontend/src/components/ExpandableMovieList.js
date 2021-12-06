import React from 'react';
import ExpandableList from './Base/ExpandableList';
import {Card} from 'react-bootstrap';
import "./ExpandableMoveList.css"

class MovieListItem extends React.Component {
	constructor(props) {
		super(props);
        this.state = {
            movieData: this.props.movieData
        }
	}

    render() {
        return <Card style={{ width: '75%' }}>

            <Card.Body>
                {/* TODO Display Image <Card.Img src={this.state.movieData.image} />*/}
                <Card.Title >{this.state.movieData.title}</Card.Title>
                <Card.Text >{`Director: ${this.state.movieData.director}`} </Card.Text>
                <Card.Text >{`Rating: ${this.state.movieData.rating}`} </Card.Text>
                {/* TODO Restliche Metadaten*/}
            </Card.Body>
            
        </Card>
    }
}

class ExpandableMovieList extends ExpandableList {

	renderExpandedComponent(item) {
		return <MovieListItem movieData={this.RetrieveData(item)} />;
	}

    RetrieveData(item) {
        //TODO Backend Call
        return {
            title: item,
            director: "Director",
            rating: "10/10",
            image: "https://motivatevalmorgan.com/wp-content/uploads/2016/06/default-movie-768x1129.jpg"
        }
    }
}
export default ExpandableMovieList
