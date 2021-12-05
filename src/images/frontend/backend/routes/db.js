const { SparqlEndpointFetcher } = require("fetch-sparql-endpoint");
const arrayifyStream = require('arrayify-stream');
const router = require('express').Router()

var db_uri = process.env.DATABASE_URI
var db_port = process.env.DATABASE_PORT

const SPARQL_SELECT_ALL_TITLES = 
`PREFIX netflix: <http://localhost:${db_port}/schemas/netflix/> ` +
'SELECT * ' +
`FROM <http://localhost:${db_port}/netflix#> ` +
'WHERE {?id netflix:title ?title} ' +
'LIMIT 10'

router.route('/').get((req, res) => {
  res.json("Default Route")
})

/**
 * Debug
 */
router.route('/debug-sparqljs-endpoint').get(async(req, res) => {
  // https://github.com/rubensworks/fetch-sparql-endpoint.js/
  var fetcher = new SparqlEndpointFetcher();
  
  // const bindingsStream = await fetcher.fetchBindings('https://dbpedia.org/sparql', 'SELECT * WHERE { ?s ?p ?o } LIMIT 100');
  console.log(SPARQL_SELECT_ALL_TITLES)
  // const bindingsStream = await fetcher.fetchBindings('http://database:8890/sparql', SPARQL_SELECT_ALL_TITLES);

  const bindingsStream = await fetcher.fetchBindings(`http://${db_uri}:${db_port}/sparql`, SPARQL_SELECT_ALL_TITLES);
  result = await arrayifyStream(bindingsStream)

  console.log("Results (n): " + result.length)

  res.json(result)
})

/**
 * Debug
 */
router.route('/debug-sparqljs-parser').get((req, res) => {
  // https://github.com/RubenVerborgh/SPARQL.js/
  // Stephan: SEE: Set sparqlStar to true to allow SPARQL* syntax.

  // Parse a SPARQL query to a JSON object
  var SparqlParser = require('sparqljs').Parser;
  var parser = new SparqlParser();
  // var parsedQuery = parser.parse(
  //   'PREFIX foaf: <http://xmlns.com/foaf/0.1/> ' +
  //   'SELECT * { ?mickey foaf:name "Mickey Mouse"@en; foaf:knows ?other. }');
  var parsedQuery = parser.parse(
    SPARQL_SELECT_ALL_TITLES);
  
  // Regenerate a SPARQL query from a JSON object
  // var SparqlGenerator = require('sparqljs').Generator;
  // var generator = new SparqlGenerator({ /* prefixes, baseIRI, factory, sparqlStar */ });
  // parsedQuery.variables = ['?mickey'];
  // var generatedQuery = generator.stringify(parsedQuery);

  res.json(parsedQuery)
})

module.exports = {
  router: router
}