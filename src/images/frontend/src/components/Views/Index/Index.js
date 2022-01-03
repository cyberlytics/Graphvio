import {Link} from "react-router-dom"
import {Button} from 'react-bootstrap'
import './Index.css'

export default function Index() {
    return (
        <div className="Index">
            <h1>
                Graphvio
            </h1>
            <Link to="/MovieSearchForm">
                <Button className="IndexButton" type="button">
                 {"Movie Search"}
                </Button>
            </Link>
            <Link to="/MovieCompareSelect">
                <Button className= "IndexButton" type="button">
                {"Movie Compare"}
                </Button>
            </Link>
            <Link to="/MovieRecommendForm">
                <Button className= "IndexButton" type="button">
                {"Movie Recommend"}
                </Button>
            </Link>
        </div>
    )
}