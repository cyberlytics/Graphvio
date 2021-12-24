import React from "react";
import ExpandablePersonList from "./ExpandablePersonList";

class CastList extends React.Component {
    constructor(props) {
		super(props);
        this.state = {
            name: `${props.location.state[0]}`,
            year: `${props.location.state[1]}`,
        }
        this.cast = [];
        this.searchFunction()
	}

    searchFunction() {
		var xmlHttp = new XMLHttpRequest();
        var url = `http://localhost:5000/db/search-persons?title=${this.state.name}&year=${this.state.year}`
		xmlHttp.open( "GET", url, false ); 
		//WTF is this in this context?
		xmlHttp.onload = () => this.parseCast(xmlHttp,this);
		xmlHttp.send(null);
	}

    parseCast(xmlHttp,castList){
		if (xmlHttp.readyState === 4) {
			if (xmlHttp.status === 200) {
			  if(xmlHttp.responseText.length > 0){
				castList.cast = JSON.parse(xmlHttp.responseText);
			  }
			} else {
			  console.error(xmlHttp.statusText);
			}
		}
	}

    render() {
        return (
			<ExpandablePersonList
				ref={(l) => (this.list = l)}
				items={this.cast}
			/>
		);
    }
}

export default CastList;