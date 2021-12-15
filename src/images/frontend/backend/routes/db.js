const { SparqlEndpointFetcher } = require("fetch-sparql-endpoint");
const arrayifyStream = require('arrayify-stream');
const router = require('express').Router()
const url = require('url')
const SPARQL_STATEMENTS = require('./sparql_statements')

const endpoint_local = `http://${process.env.DATABASE_URI}:${process.env.DATABASE_PORT}/sparql`
const endpoint_dbpedia = `https://dbpedia.org/sparql/`

var fetcher = new SparqlEndpointFetcher();

/**
 * Rückgabe der Filme innerhalb der Datenbank
 * 
 * http://localhost:5000/db/search-movies
 * - Liefert eine Liste der Filme zurück
 * 
 * http://localhost:5000/db/search-movies?title=shark
 * - Der Titel muss shark beinhalten
 * - Beispiele: "Sharkdog", "Zig & Sharko"
 *
 * http://localhost:5000/db/search-movies?provider=disney_plus
 * - Sucht nur in der jeweiligen Provider-Datenbank
 * - Standard: netflix|disney_plus|amazon_prime|hulu
 * - Möglich: Beliebige Kombination der Provider, getrennt mit |
 *   - disney_plus
 *   - disney_plus|hulu
 *   - netflix|disney|amazon_prime|hulu
 * 
 * http://localhost:5000/db/search-movies?limit=1
 * - Anzahl der Einträge, die maximal zurückgegeben werden.
 * - Standard: 10
 * 
 * Beispiel:
 * - http://localhost:5000/db/search-movies?title=shark&provider=netflix|disney_plus|amazon_prime
 *   - Sucht in den Datenbanken von Netflix, Disney und Prime nach
 *     einem Eintrag, der "shark" enthält.
 * 
 * @returns Liste der Filme als JSON
 * 
 * Beispiel:
 * URL: http://localhost:5000/db/search-movies
 * 
 * [
 *   {
 *     "title": "Take Care Good Night",
 *     "provider": "amazon_prime",
 *     "metadata": {
 *       "cast": "Mahesh Manjrekar, Abhay Mahajan, Sachin Khedekar",
 *       "country": "India",
 *       "date_added": "March 30, 2021",
 *       "description": "A Metro Family decides to fight a Cyber Criminal threatening their stability and pride.",
 *       "director": "Girish Joshi",
 *       "duration": "110 min",
 *       "release_year": "2018",
 *       "type": "Movie",
 *       "rating": "13+",
 *       "genre": "Drama, International"
 *     }
 *   },
 *   ...
 */
router.route('/search-movies').get(async(req, res) => {
  const reqUrl = url.parse(req.url, true)
  movie = reqUrl.query.title || "";
  provider = reqUrl.query.provider?.toLocaleLowerCase() || undefined;
  limit = reqUrl.query.limit || undefined;

  sparql = SPARQL_STATEMENTS.SEARCH_MOVIE(movie, provider, limit)
  console.log(sparql)
  
  result = await arrayifyStream(await fetcher.fetchBindings(endpoint_local, sparql))
  console.log(`Results found: ${result.length}`)

  movies = []

  result.forEach(element => {
    movies.push({
      "title": element.title.value,
      "provider": element.id.value.match("/movies/(.*)_titles_csv")[1], // Provider, der den Film zur Verfügung stellt
      "metadata": {
        "cast": element.cast?.value,
        "country": element.country?.value,
        "date_added": element.date_added?.value,
        "description": element.description?.value,
        "director": element.director?.value,
        "duration": element.duration?.value,
        "release_year": element.release_year?.value,
        "type": element.type?.value, // "Movie" | "TV Show"
        "rating": element.rating?.value,
        "genre": element.listed_in?.value
      }
    })
  });

  res.json(movies) 
})

/**
 * Rückgabe der Filmmitwirkenden zu einem Film
 * 
 * http://localhost:5000/db/search-persons?title=Lucifer
 * - Liefert eine Liste der Filmmitwirkenden zurück
 * 
 * http://localhost:5000/db/search-persons?title=Always&year=2011
 * - Liefert eine Liste der Filmmitwirkenden zurück
 * - Das Jahr sollte immer angegeben werden, um DBpedia bei
 *   der Suche nach einem bestimmten Film zu unterstützen.
 *   Gibt es sowieso nur einen Film, wird das Jahr bei der Suche
 *   verworfen.
 *   Gibt es aber mehrere Einträge bei DBpedia und es wurde kein
 *   Jahr angegeben, kann nicht darauf zugegriffen werden.
 *   Es werden dann keine Personen ausgegeben.
 * 
 *   Beispiel:
 *   - Always, 2011
 *   - Always, 1989
 * 
 *   http://localhost:5000/db/search-persons?title=Always
 *   - Keine Personen
 *   http://localhost:5000/db/search-persons?title=Always&year=2011
 *   - Always, 2011
 *   - Film: http://dbpedia.org/resource/Always_(2011_film)
 *   http://localhost:5000/db/search-persons?title=Always&year=1989
 *   - Always, 1989
 *   - Film: http://dbpedia.org/resource/Always_(1989_film)
 * 
 * http://localhost:5000/db/search-persons?title=Avengers: Infinity War&limit=50
 * - Anzahl der Einträge, die maximal zurückgegeben werden.
 * - Standard: 10
 * 
 * @returns Liste der Filmmitwirkenden als JSON
 * 
 * Beispiel:
 * URL: http://localhost:5000/db/search-persons?title=Always&year=2011
 * 
 *  {
 *    "request": {
 *      "title": "Always",
 *      "year": "2011"
 *    },
 *    "response": {
 *      "film": "http://dbpedia.org/resource/Always_(2011_film)",
 *      "persons": [
 *        {
 *          "name": "Bang Jun-seok",
 *          "role": "music",
 *          "birthDate": "1970-08-01",
 *          "birthPlace": "South Korea",
 *          "advanced": {
 *            "title_entity": "http://dbpedia.org/resource/Always_(2011_film)",
 *            "person_entity": "http://dbpedia.org/resource/Bang_Jun-seok",
 *            "person_rdf": "Bang Jun-seok",
 *            "person_dbp": "Bang Jun-seok",
 *            "birthPlaceEntities": "http://dbpedia.org/resource/South_Korea",
 *            "country_birthPlace": "South Korea"
 *          }
 *        },
 *        ...
 */
 router.route('/search-persons').get(async(req, res) => {
  const reqUrl = url.parse(req.url, true)
  movie = reqUrl.query.title || "";
  year = reqUrl.query.year || undefined;
  limit = reqUrl.query.limit || undefined;

  sparql = SPARQL_STATEMENTS.SEARCH_PERSONS(movie, year, limit)
  console.log(sparql)
  
  result = await arrayifyStream(await fetcher.fetchBindings(endpoint_dbpedia, sparql))
  console.log(`Results found: ${result.length}`)

  persons = []

  result.forEach(element => {
    // Ungültige Personen filtern.
    if (typeof(element) === 'undefined'
      || typeof(element.name) === 'undefined'
      || typeof(element.role) === 'undefined') {
      return;
    }

    persons.push({
      "name": element.name.value,
      "role": element.role.value,
      "birthDate": element.birthDate?.value,
      "birthPlace": element.birthPlace?.value,
      "advanced": {
        "title_entity": element.film?.value,
        "person_entity": element.person?.value,
        "person_rdf": element.rdf_person_name?.value,
        "person_dbp": element.dbp_person_name?.value,
        "birthPlaceEntities": element.birthPlaceEntities?.value,
        "city_birthPlace": element.city_birthPlace?.value,
        "settlement_birthPlace": element.settlement_birthPlace?.value,
        "country_birthPlace": element.country_birthPlace?.value,
      }
    })
  });

  resultWrapper = {
    "request": {
      "title": movie,
      "year": year,
      "limit": limit,
    },
    "response": {
      "film": result[0]?.film.value || "",
      "persons": persons
    }
  }

  res.json(resultWrapper) 
})

module.exports = {
  router: router
}