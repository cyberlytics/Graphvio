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
 * @returns Liste der Filme als JSON
 */
router.route('/search-movies').get(async(req, res) => {
  const reqUrl = url.parse(req.url, true)
  movie = reqUrl.query.title || "";

  sparql = SPARQL_STATEMENTS.SEARCH_MOVIE(movie)
  console.log(sparql)
  
  result = await arrayifyStream(await fetcher.fetchBindings(endpoint, sparql))

  movies = []

  result.forEach(element => {
    movies.push({
      "title": element.title.value,
      "director": element.director?.value
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