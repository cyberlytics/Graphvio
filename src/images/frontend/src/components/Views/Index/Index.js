import {Link} from "react-router-dom"

export default function Index() {
    return (
        <div className="Index">
            <h1>
                Hallo bei Graphvio
            </h1>
            <Link to="/MovieSearchForm">
                <button id="index_btn" type="button">
                Movie Search
                </button>
            </Link>
            <Link id="index_btn" to="/MovieCompareSelect">
                <button type="button">
                Movie Compare
                </button>
            </Link>
            <Link id="index_btn" to="/MovieRecommendForm">
                <button type="button">
                Movie Recomend
                </button>
            </Link>
        </div>
    )
}