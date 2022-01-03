import { useLocation } from 'react-router-dom'
import ExpandablePersonList from "./ExpandablePersonList";
const Constants = require("Constants");

function CastList () {
	const location = useLocation()
	var cast = [];
	console.log(location.state)
	
	var xmlHttp = new XMLHttpRequest();
    var url = `http://${Constants.BACKEND_URL}:${Constants.BACKEND_PORT}/db/search-persons?title=${location.state["title"]}&year=${location.state["release_year"]}`
	xmlHttp.open( "GET", url, false ); 
	xmlHttp.onload = () => (cast = parseCast(xmlHttp,this));
	xmlHttp.send(null);

	let content = <div></div>
	if(!location.state["title"]){
		content = <div>
			<h1>
				No Film! :(
			</h1>
		</div>
	}
	else{
		content = (<div className = "App-body">
		<ExpandablePersonList
			
			items={cast}
		/>
		</div>)
	}
    return content;
}

function parseCast(xmlHttp,castList){
	if (xmlHttp.readyState === 4) {
		if (xmlHttp.status === 200) {
		  if(xmlHttp.responseText.length > 0){
			return JSON.parse(xmlHttp.responseText);
		  }
		} else {
		  console.error(xmlHttp.statusText);
		}
	}
}
export default CastList;