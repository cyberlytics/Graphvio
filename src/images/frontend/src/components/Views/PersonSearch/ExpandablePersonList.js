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

    renderCardBody() {
		return (
			<div>
				<div class="grid-container">
					<div class="header">
                        <b>Summary : </b>
						<Card.Text>
							{`${this.state.personData.summary}`}
						</Card.Text>
						<hr />
					</div>
					<div class="left">
						<Card.Text>
                            <b>Name : </b>{`${this.state.personData.name}`}
						</Card.Text>
                        <Card.Text>
                            <b>Age : </b>{`${this.state.personData.age}`}
						</Card.Text>
					</div>
					<div class="right">
						<Card.Text>
                            <b>Sex : </b>{`${this.state.personData.sex}`}
						</Card.Text>
						<Card.Text>
                            <b>Nationality : </b>{this.state.personData.nationality}
						</Card.Text>
					</div>
				</div>
			</div>
		);
	}
}

class ExpandablePersonList extends ExpandableList {

	renderExpandedComponent(item) {
		return <PersonListItem personData={this.RetrieveData(item)} />;
	}

    returnDisplayName(item){
        return item['name'];
    }

    RetrieveData(item) {
        //TODO Backend Call
        return {
            summary: "Story of my Life",
            name: "Someone",
            sex: "non binary",
            age: "40",
            nationality: "American",
            image: "https://motivatevalmorgan.com/wp-content/uploads/2016/06/default-movie-768x1129.jpg"
        }
    }
}
export default ExpandablePersonList
