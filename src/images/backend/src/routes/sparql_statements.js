var DB_PORT = process.env.DATABASE_PORT || 8890
const ALL_PROVIDERS = 'netflix|disney_plus|amazon_prime|hulu'

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

function SEARCH_EXACT_MOVIE(movie, providers = ALL_PROVIDERS) {
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

module.exports = {
    SEARCH_MOVIE: SEARCH_MOVIE,
    SEARCH_EXACT_MOVIE: SEARCH_EXACT_MOVIE,
    SEARCH_PERSONS: SEARCH_PERSONS
}