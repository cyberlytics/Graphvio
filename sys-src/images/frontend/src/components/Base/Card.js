import React from 'react';
import {Card} from 'react-bootstrap';
import "./Card.css"
class InfoCard extends React.Component {


    renderCardBody(){

    }

    render() {
        return (
            <Card>
                <Card.Body>{this.renderCardBody()}</Card.Body>
            </Card>
        )
    }
}
export default InfoCard