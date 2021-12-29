var DB_PORT = process.env.DATABASE_PORT || 8890
const ALL_PROVIDERS = 'netflix|disney_plus|amazon_prime|hulu'

// filterByMetadata("title", ["Sharknado 4: The 4th Awakens", "My Boss's Daughter"], exclude=true) + 
// filterByMetadata("director", ["Anthony C. Ferrante"], exclude=false) +
// filterByMetadata("country", ["United States"], exclude=false) +
// filterByMetadata("cast", ["Tara Reid"], exclude=false) +
// filterByMetadata("listed_in", ["Action"], exclude=false) +
function SEARCH_SIMILAR_MOVIES(excludeTitles, director, country, cast, genre, providers, limit = 10) {
    sparql = 
    getPrefix() +
    `SELECT * ` + 
    getGraph() +
    `WHERE {	
    ?id movie:title ?title ` + 
    filterProviders(providers) +
    filterByMetadata("title", excludeTitles, exclude=true) + 
    getMetadata() +
    filterByMetadata("director", director, exclude=false) +
    filterByMetadata("country", country, exclude=false) +
    filterByMetadata("cast", cast, exclude=false) +
    filterByMetadata("listed_in", genre, exclude=false) +
    `} ` +
    `LIMIT ${limit}`
    return sparql
}

// PREFIX movie: <http://localhost:8890/schemas/movies/> 
// SELECT * FROM <http://localhost:8890/movies#> 
// WHERE {
// ?id movie:title ?title 
// FILTER regex(str(?id), "(netflix|disney_plus|amazon_prime|hulu)") 
// FILTER regex(str(lcase(?title)), "sharknado"). 
// OPTIONAL {?id movie:cast ?cast} 
// OPTIONAL {?id movie:country ?country} 
// OPTIONAL {?id movie:date_added ?date_added} 
// OPTIONAL {?id movie:description ?description} 
// OPTIONAL {?id movie:director ?director} 
// OPTIONAL {?id movie:duration ?duration} 
// OPTIONAL {?id movie:release_year ?release_year} 
// OPTIONAL {?id movie:type ?type} 
// OPTIONAL {?id movie:rating ?rating} 
// OPTIONAL {?id movie:listed_in ?listed_in} 
// }
// LIMIT 20
function SEARCH_MOVIE(movie, providers, limit = 10) {
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

function SEARCH_EXACT_MOVIE(movie, providers) {
    sparql =         
    getPrefix() +
    'SELECT * ' +
    getGraph() +
    `WHERE {?id movie:title ?title ` +
    filterProviders(providers) +
    `FILTER (str(lcase(?title)) = "${movie.toLowerCase()}"). ` +
    getMetadata() +
    `} `

    return sparql
}

function SEARCH_PERSONS(movie, year, limit = 10) {
    sparql =         
    `
PREFIX dbo: <http://dbpedia.org/ontology/>
PREFIX dbp: <http://dbpedia.org/property/>

SELECT DISTINCT * 
WHERE { 
    {
        ?film a dbo:Film;
        dbp:name ?film_name.
    }
    UNION {
        ?film a dbo:TelevisionShow;
        dbp:name ?film_name.
    }
    FILTER(lcase(str(?film_name)) = lcase(str("${movie}"@en))).
    # Jahr, in dem der Film gedreht worden ist.
    # Ansonsten prüfen, ob es eventuell eine Serie dazu gibt.
    # Ansonsten prüfen, ob es einen Film mit diesem Namen ohne einem Jahr im Titel gibt.
    FILTER (
        regex(str(?film), "\\\\(${year}_.*\\\\)")
        || regex(lcase(str(?film)), "\\\\(tv_series\\\\)") 
        || !regex(str(?film), "\\\\(.*\\\\)")
        )
    OPTIONAL { 
        {
            ?film dbp:music ?person.
            VALUES ?role {"music"}.
        }
        UNION {
            ?film dbo:director ?person.
            VALUES ?role {"director"}.
        }
        UNION {
            ?film dbo:starring ?person.
            VALUES ?role {"starring"}.
        }
        UNION {
            ?film dbp:cinematography ?person.
            VALUES ?role {"cinematography"}.
        }

        # Name
        bind(?person AS ?default_name).
        OPTIONAL {
            ?person a dbo:Person;
            rdfs:label ?rdf_person_name;
            dbp:name ?dbp_person_name.
            FILTER langMatches(lang(?rdf_person_name), "en").
            FILTER langMatches(lang(?dbp_person_name), "en").
        }
        bind(coalesce(?dbp_person_name, ?rdf_person_name, ?default_name) as ?name).
        FILTER langMatches(lang(?name), "en").

        # Geburtsdatum
        # Geburtsdatum wird in verschiedenen Ontologien gepflegt.
        OPTIONAL {
            ?person dbo:birthDate|dbp:birthDate ?birthDate.
            FILTER (xsd:date(?birthDate)).
        }

        # Geburtsort
        bind("" AS ?default_birthPlace).

        ?person dbo:birthPlace ?birthPlaceEntities.

        OPTIONAL {
            ?birthPlaceEntities a dbo:City;
            rdfs:label ?city_birthPlace.
            FILTER langMatches(lang(?city_birthPlace), "en").
        }
        OPTIONAL {
            ?birthPlaceEntities a dbo:Settlement;
            rdfs:label ?settlement_birthPlace.
            FILTER langMatches(lang(?settlement_birthPlace), "en").
        }
        OPTIONAL {
            ?birthPlaceEntities a dbo:Country;
            rdfs:label ?country_birthPlace.
            FILTER langMatches(lang(?country_birthPlace), "en").
        }
        
        bind(coalesce(?city_birthPlace, ?settlement_birthPlace, ?country_birthPlace, ?default_birthPlace) as ?birthPlace).
        FILTER langMatches(lang(?birthPlace), "en").
    }
}
LIMIT ${limit}
`

    console.log(sparql)
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
    `OPTIONAL {?id ${prefix}:listed_in ?listed_in} `

    return metadata
}

function filterByMetadata(column, values, exclude=false) {
    if (values == undefined || values.length == 0) {
        return ''
    }

    sparql = `FILTER (`

    values.forEach((value, index, array) => {
        if (exclude) {
            sparql += `!`
        }

        // Filtern
        sparql += `regex(str(lcase(?${column})), "${value.toLowerCase()}")`

        if (index === array.length - 1) {
            // Letztes Element erreicht,
            // es muss kein && oder || angefügt werden
        } else {
            if (exclude) {
                sparql += ` && `
            } else {
                sparql += ` || `
            }
        }
    });

    sparql += `) `

    return sparql
}

module.exports = {
    SEARCH_MOVIE: SEARCH_MOVIE,
    SEARCH_EXACT_MOVIE: SEARCH_EXACT_MOVIE,
    SEARCH_PERSONS: SEARCH_PERSONS,
    SEARCH_SIMILAR_MOVIES: SEARCH_SIMILAR_MOVIES
}

SEARCH_SIMILAR_MOVIES()