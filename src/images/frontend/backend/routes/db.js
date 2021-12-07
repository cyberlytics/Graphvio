const { SparqlEndpointFetcher } = require("fetch-sparql-endpoint");
const arrayifyStream = require('arrayify-stream');
const router = require('express').Router()
const url = require('url')
const SPARQL_STATEMENTS = require('./sparql_statements')

const endpoint = `http://${process.env.DATABASE_URI}:${process.env.DATABASE_PORT}/sparql`

var fetcher = new SparqlEndpointFetcher();

router.route('/').get((req, res) => {
  res.json("Default Route")
})

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
 */
router.route('/search-movies').get(async(req, res) => {
  const reqUrl = url.parse(req.url, true)
  movie = reqUrl.query.title || "";
  provider = reqUrl.query.provider?.toLocaleLowerCase() || undefined;
  limit = reqUrl.query.limit || undefined;

  sparql = SPARQL_STATEMENTS.SEARCH_MOVIE(movie, provider, limit)
  console.log(sparql)
  
  result = await arrayifyStream(await fetcher.fetchBindings(endpoint, sparql))
  console.log(`Result found: ${result.length}`)

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
        "genre": element.listed_in?.value,
        "imdb-rating": "42", // Nur in den Details?
      }
    })
  });

  res.json(movies) 
})

/**
 * Debug
 */
router.route('/debug-sparqljs-endpoint').get(async(req, res) => {
  // https://github.com/rubensworks/fetch-sparql-endpoint.js/
  
  // const bindingsStream = await fetcher.fetchBindings('https://dbpedia.org/sparql', 'SELECT * WHERE { ?s ?p ?o } LIMIT 100');
  console.log(SPARQL_SELECT_ALL_TITLES)
  // const bindingsStream = await fetcher.fetchBindings('http://database:8890/sparql', SPARQL_SELECT_ALL_TITLES);

  const bindingsStream = await fetcher.fetchBindings(endpoint, SPARQL_SELECT_ALL_TITLES);

  result = await arrayifyStream(bindingsStream)

  movies = []

  result.forEach(element => {
    movies.push({
      "title": element.title.value,
      "director": element.director?.value,
    })
  });

  res.json(movies) 
})

module.exports = {
  router: router
}