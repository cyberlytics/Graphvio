var DB_PORT = process.env.DATABASE_PORT || 8890
const ALL_PROVIDERS = 'netflix|disney_plus|amazon_prime|hulu'

/**
 * Mithilfe der übergebenen Merkmale kann eine SPARQL-Statement erstellt werden,
 * mit dem eine Suche durchgeführt werden kann.
 * 
 * @param {string} excludeTitles Filme, die nicht in das Ergebnis inkludiert werden sollen. Im Normalfall sind das 
 * die Ursprungsfilme, die für den Vergleich der Merkmale 
 * herangezogen wurden.
 * @param {string} director Regisseure, nach denen gefiltert werden soll.
 * @param {string} country Länder, nach denen gefiltert werden soll.
 * @param {string} cast Schauspieler, die in den Filmen mitwirken sollen.
 * @param {string} genre Genre, als das der Film gelistet sein soll.
 * @param {string} providers Provider, die für die Suche durchsucht werden sollen.
 * Provider können mit dem Zeichen | miteinander kombiniert werden.
 * Beispiel: netflix|disney_plus oder nur amazon_prime oder hulu
 * @param {int} limit Anzahl der Einträge, die maximal zurückgegeben werden sollen.
 * 
 * @returns SPARQL-Statement, Suche nach Filmen, die mit den übergebenen Merkmalen übereinstimmen.
 */
function SEARCH_SIMILAR_MOVIES(excludeTitles, director, country, cast, genre, providers, limit = 10) {
    sparql = 
    getPrefix() +
    `SELECT * ` + 
    getGraph() +
    `WHERE {?id movie:title ?title ` + 
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

/**
 * Durchsuche die Datenbank nach einem Film, der den movie im Titel hat.
 * 
 * @param {string} movie Film, nach dem gesucht wird.
 * @param {string} providers Provider, die für die Suche durchsucht werden sollen.
 * @param {int} limit Anzahl der Einträge, die maximal zurückgegeben werden sollen.
 * 
 * @returns SPARQL-Statement, suche nach einen Film.
 */
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

/**
 * Durchsuche die Datenbank nach einem Film, der exakt so heißt.
 * 
 * @param {string} preciseMovietitle Exakter Filmtitel, der gesucht wird.
 * @param {string} providers Provider, die für die Suche durchsucht werden sollen.
 * Provider können mit dem Zeichen | miteinander kombiniert werden.
 * Beispiel: netflix|disney_plus oder nur amazon_prime oder hulu
 * 
 * @returns SPARQL-Statement, suche nach einen Film mit diesem Titel.
 */
function SEARCH_EXACT_MOVIE(preciseMovietitle, providers) {
    sparql =         
    getPrefix() +
    'SELECT * ' +
    getGraph() +
    `WHERE {?id movie:title ?title ` +
    filterProviders(providers) +
    `FILTER (str(lcase(?title)) = "${preciseMovietitle.toLowerCase()}"). ` +
    getMetadata() +
    `} `

    return sparql
}

/**
 * Durchsuche die DBpedia mithilfe des SPARQL-Statements nach Filmmitwirkenden
 * des übergebenen Filmes.
 * 
 * Zu den Filmmitwirkenden werden Detailinformationen der jeweiligen
 * Person ausgelesen.
 * 
 * @param {string} movie Film, nach dem gesucht wird.
 * @param {string} year Erscheinungsjahr des Filmes.
 * @param {int} limit Anzahl der Einträge, die maximal zurückgegeben werden sollen.
 * 
 * @returns SPARQL-Statement, mit dem die DBpedia durchsucht werden kann.
 */
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

/**
 * Erstellt den Prefix für die Filmontologie.
 * 
 * @param {string} prefix Prefix, der für die Filme aus der Virtuoso
 * Datenbank verwendet werden soll.
 * 
 * @returns Teil eines SPARQL-Statements.
 */
function getPrefix(prefix = 'movie') {
    return `PREFIX ${prefix}: <http://localhost:${DB_PORT}/schemas/movies/> `
}

/**
 * Erstellt den Import des Graphen der Filmontologie.
 * 
 * @returns Teil eines SPARQL-Statements.
 */
function getGraph() {
    return `FROM <http://localhost:${DB_PORT}/movies#> `
}

/**
 * Erstellt den Filter für die Filterung der Filme nach
 * den Providern, auf denen diese gehostet werden.
 * 
 * @param {string} providers Provider, die für die Suche durchsucht werden sollen.
 * Provider können mit dem Zeichen | miteinander kombiniert werden.
 * Beispiel: netflix|disney_plus oder nur amazon_prime oder hulu
 * 
 * @returns Teil eines SPARQL-Statements.
 */
function filterProviders(providers = ALL_PROVIDERS) {
    return `FILTER regex(str(?id), "(${providers})") `
}

/**
 * Fügt die Parameter, die bei einem Film in der Virtuoso
 * Datenbank ausgelesen werden sollen.
 * 
 * @param {string} prefix Prefix, der für die Filme aus der Virtuoso
 * Datenbank verwendet werden soll.
 * 
 * @returns Teil eines SPARQL-Statements.
 */
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

/**
 * Filtert die Suche nach einer Spalte und dessen Werten,
 * die dann verwendet werden sollen.
 * 
 * @param {string} column Spalte, nach der gefiltert werden soll.
 * @param {string} values Werte, die gefiltert werden.
 * @param {boolean} exclude Invertiert die Filterung.
 * 
 * @returns Teil eines SPARQL-Statements.
 */
function filterByMetadata(column, values, exclude) {
    if (values == undefined || values.length == 0) {
        return ''
    }

    sparql = `FILTER (`

    values.forEach((value, index, array) => {
        if (exclude) {
            sparql += `!`
        }

        // Filtern nach einem Wert der Spalte
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