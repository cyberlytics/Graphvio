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

function getPrefix(prefix = 'movie') {
    return `PREFIX ${prefix}: <http://localhost:${DB_PORT}/schemas/movies/> `
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
    `OPTIONAL {?id ${prefix}:genre ?genre} `

    return metadata
}

module.exports = {
    SELECT_ALL_TITLES: SELECT_ALL_TITLES,
    SEARCH_MOVIE: SEARCH_MOVIE
}