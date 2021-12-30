import React from "react";
import InfoCard from "../..//Base/Card";
import { Card } from "react-bootstrap";
import "./PersonListItem.css";
import Collapsible from 'react-collapsible';
import "./ExpandablePersonList.css";

class MovieListItem extends InfoCard {
	constructor(props) {
		super(props);
		this.state = {
			personData: props.personData,
		};
	}

	renderCardBody() {
		return (
			<div>
				<div class="grid-container">
					<div class="left">
						<Card.Text>
                            <b>Birthdate : </b>{`${this.state.personData.birthDate}`}
						</Card.Text>
                        <Card.Text>
                            <b>Birthplace : </b>{`${this.state.personData.birthPlace}`}
						</Card.Text>
					</div>
					<div class="right">
						<Card.Text>
                            <b>Name : </b>{`${this.state.personData.name}`}
						</Card.Text>
						<Card.Text>
                            <b>Role : </b>{`${this.state.personData.role}`}
						</Card.Text>
					</div>
				</div>
			</div>
		);
	}
}

class ExpandablePersonList extends React.Component {
    constructor(props)
    {
        super(props);
        this.state = {
            items: props.items,
        }
        this.renderedItemsRef = [];
    }

    updateItems(items){
        this.setState({items: items})
    }

	renderExpandedComponent(index) {
		return <MovieListItem personData={this.state.items.response.persons[index]} ref={(ref) => this.renderedItemsRef.push(ref)} key={this.state.items.response.persons[index]}/>;
	}

	returnDisplayName(item) {
		return item["name"];
	}

    render()
    {
        //Clear the rendered items
        this.renderedItemsRef.length = 0;

        if(this.state.items.length === 0)
        {
            return null;
        }

        let renderedCollapsibleItems = [];
        
        for(var index in this.state.items.response.persons){
            var item = this.state.items.response.persons[index];
            var content = this.renderExpandedComponent(index);

            renderedCollapsibleItems.push(
            <Collapsible trigger={this.returnDisplayName(item)}  transitionTime={300} key={`Collapsible_${index}_${this.returnDisplayName(item)}`}>
                {content}
            </Collapsible>
            )
        }
        return <div>{renderedCollapsibleItems}</div>;
    }
}
export default ExpandablePersonList;