import React from 'react';
import ExpandableList from '../../Base/ExpandableList';
import InfoCard from '../..//Base/Card';
import {Card} from 'react-bootstrap';
import "./ExpandablePersonList.css"

class PersonListItem extends InfoCard {
	constructor(props) {
		super(props);
        this.state = {
            personData: this.props.personData
        }
	}

    renderCardBody(){
            return <div>
                <Card.Title >{this.state.personData.name}</Card.Title>
                <Card.Text >{`Geschlecht: ${this.state.personData.sex}`} </Card.Text>
                <Card.Text >{`Alter: ${this.state.personData.age}`} </Card.Text>
                <Card.Text >{`Nationalität: ${this.state.personData.nationality}`} </Card.Text>
            </div>
    }
}

class ExpandablePersonList extends ExpandableList {

	renderExpandedComponent(item) {
		return <PersonListItem personData={this.RetrieveData(item)} />;
	}

    returnDisplayName(item){
        return item['title'];
    }

    RetrieveData(item) {
        //TODO Backend Call
        return {
            name: "Someone",
            sex: "non binary",
            age: "40",
            nationality: "American",
            image: "https://motivatevalmorgan.com/wp-content/uploads/2016/06/default-movie-768x1129.jpg"
        }
    }
}
export default ExpandablePersonList
