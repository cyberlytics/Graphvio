var DB_PORT = process.env.DATABASE_PORT

function SELECT_ALL_TITLES(provider="netflix", limit=10) {
    sparql =         
    getPrefix(provider) +
    `SELECT * ` +
    getGraph(provider) +
    `WHERE {?id netflix:title ?title ` +
    getMetadata() +
    `} ` +
    `LIMIT ${limit}`
    return sparql
}

function SEARCH_MOVIE(movie, provider="netflix", limit=10) {
    sparql =         
    getPrefix(provider) +
    'SELECT * ' +
    getGraph(provider) +
    `WHERE {?id movie:title ?title ` +
    `FILTER regex(str(lcase(?title)), "${movie.toLowerCase()}"). ` +
    getMetadata() +
    `} ` +
    `LIMIT ${limit}`
    return sparql
}

function getPrefix(provider, prefix = 'movie') {
    return `PREFIX ${prefix}: <http://localhost:${DB_PORT}/schemas/${provider}/> `
}

function getGraph(provider) {
    return `FROM <http://localhost:${DB_PORT}/${provider}#> `
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