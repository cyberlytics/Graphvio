import { useLocation } from 'react-router-dom'
import ExpandablePersonList from "./ExpandablePersonList";

function CastList () {
	const location = useLocation()
	var cast = [];
	
	var xmlHttp = new XMLHttpRequest();
    var url = `http://localhost:5000/db/search-persons?title=${location.state["title"]}&year=${location.state["release_year"]}`
	xmlHttp.open( "GET", url, false ); 
	xmlHttp.onload = () => (cast = parseCast(xmlHttp,this));
	xmlHttp.send(null);
	
	
	
	
	
	
	
	
	
	
	let content = <div></div>
	if(!location.state["title"]){
		content = <div>
			<h1>
				No film found! :(
			</h1>
		</div>
	}
	else{
		if(cast.response.persons.length===0){
			content = <div>
			<h1>
				No cast found! :(
			</h1>
			</div>
		}
		else{
			content = (<div className = "App-body">
				<h1>Castlist for {location.state["title"]}({location.state["release_year"]})</h1>
			<ExpandablePersonList
				
				items={cast}
			/>
			</div>)
		}
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