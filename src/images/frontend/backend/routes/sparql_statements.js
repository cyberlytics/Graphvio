var DB_PORT = process.env.DATABASE_PORT
const ALL_PROVIDERS = 'netflix|disney_plus|amazon_prime|hulu'

function SELECT_ALL_TITLES(providers = ALL_PROVIDERS, limit = 10) {
    sparql =         
    getPrefix() +
    `SELECT * ` +
    getGraph() +
    `WHERE {?id netflix:title ?title ` +
    filterProviders(providers) +
    getMetadata() +
    `} ` +
    `LIMIT ${limit}`
    return sparql
}

function SEARCH_MOVIE(movie, providers = ALL_PROVIDERS, limit = 10) {
    sparql =         
    getPrefix() +
    'SELECT * ' +
    getGraph() +
    `WHERE {?id movie:title ?title ` +
    filterProviders(providers) +
    `FILTER regex(str(lcase(?title)), "${movie.toLowerCase()}"). ` +
    getMetadata() +
    `} ` +
    `LIMIT ${limit}`
    return sparql
}

/**
 * 
 * 
 *
 */
function SEARCH_PERSONS(movie, year, limit = 10) {
    sparql =         
    getPrefixDbpedia() +
    `SELECT * ` +
    `WHERE { ` +

    `?film a dbo:Film; 
    dbp:name ?film_name.
    FILTER(lcase(str(?film_name)) = lcase(str('${movie}'@en))).
    FILTER (regex(str(?film), "\\\\(${year}_.*\\\\)") || !regex(str(?film), "\\\\(.*\\\\)"))
    OPTIONAL { 
        {
          ?film dbp:music ?person.
          VALUES ?role {"music"}.
        }
        UNION
        {
          ?film dbp:director ?person.
          VALUES ?role {"director"}.
        }
        UNION
        {
          ?film dbo:starring ?person.
          VALUES ?role {"starring"}.
        }
        UNION
        {
          ?film dbp:cinematography ?person.
          VALUES ?role {"cinematography"}.
        }

        ?person dbp:name ?name.
        ?person dbo:birthDate ?birthDate.
        ?person dbo:birthPlace ?birthPlaceEntity.
        ?birthPlaceEntity rdfs:label ?birthPlaceLabel.
        ?birthPlaceEntity a dbo:City.
        FILTER (LANG(?birthPlaceLabel)='en') 
    }
}
LIMIT ${limit}`

    console.log(sparql)
    return sparql
}

function getPrefix(prefix = 'movie') {
    return `PREFIX ${prefix}: <http://localhost:${DB_PORT}/schemas/movies/> `
}

function getPrefixDbpedia(prefixDbo = 'dbo', prefixDbp = 'dbp') {
    prefixDbpedia = 
`PREFIX ${prefixDbo}: <http://dbpedia.org/ontology/> 
PREFIX ${prefixDbp}: <http://dbpedia.org/property/> `
    return prefixDbpedia
}

function getGraph() {
    return `FROM <http://localhost:${DB_PORT}/movies#> `
}

function filterProviders(providers = ALL_PROVIDERS) {
    return `FILTER regex(str(?id), "(${providers})") `
}

function getMetadata(prefix = 'movie') {
    metadata = 
    `OPTIONAL {?id ${prefix}:cast ?cast} ` +
    `OPTIONAL {?id ${prefix}:country ?country} ` +
    `OPTIONAL {?id ${prefix}:date_added ?date_added} ` +
    `OPTIONAL {?id ${prefix}:description ?description} ` +
    `OPTIONAL {?id ${prefix}:director ?director} ` +
    `OPTIONAL {?id ${prefix}:duration ?duration} ` +
    `OPTIONAL {?id ${prefix}:release_year ?release_year} ` +
    `OPTIONAL {?id ${prefix}:type ?type} ` +
    `OPTIONAL {?id ${prefix}:rating ?rating} ` +
    `OPTIONAL {?id ${prefix}:listed_in ?listed_in} `

    return metadata
}

if(false) {
    (async() => {
        const { SparqlEndpointFetcher } = require("fetch-sparql-endpoint");
        const arrayifyStream = require('arrayify-stream');
        var fetcher = new SparqlEndpointFetcher();
        const endpoint = `https://dbpedia.org/sparql/`

        // sparql = SEARCH_PERSONS("Always", 2011)
        // sparql = SEARCH_PERSONS("Always", 1989)
        sparql = SEARCH_PERSONS("The Matrix")
        console.log("###########################")
        result = await arrayifyStream(await fetcher.fetchBindings(endpoint, sparql))
        console.log("###########################")
        console.log(`Results found: ${result.length}`)

        result.forEach(element => {
            console.log(element["name"].value)
            console.log(element["role"].value)
            console.log("---")
        });  
    })()
}

module.exports = {
    SELECT_ALL_TITLES: SELECT_ALL_TITLES,
    SEARCH_MOVIE: SEARCH_MOVIE,
    SEARCH_PERSONS: SEARCH_PERSONS
}