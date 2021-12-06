var db_port = process.env.DATABASE_PORT

function SELECT_ALL_TITLES() {
    sparql =         
    `PREFIX netflix: <http://localhost:${db_port}/schemas/netflix/> ` +
    'SELECT * ' +
    `FROM <http://localhost:${db_port}/netflix#> ` +
    'WHERE {?id netflix:title ?title ' +
    `OPTIONAL {?id netflix:director ?director} }` +
    'LIMIT 10'
    return sparql
}

function SEARCH_MOVIE(movie) {
    sparql =         
    `PREFIX netflix: <http://localhost:${db_port}/schemas/netflix/> ` +
    'SELECT * ' +
    `FROM <http://localhost:${db_port}/netflix#> ` +
    'WHERE {?id netflix:title ?title ' +
    `FILTER regex(str(lcase(?title)), "${movie.toLowerCase()}"). ` +
    `OPTIONAL {?id netflix:director ?director} }` +
    'LIMIT 10'
    return sparql
}

module.exports = {
    SELECT_ALL_TITLES: SELECT_ALL_TITLES,
    SEARCH_MOVIE: SEARCH_MOVIE
}