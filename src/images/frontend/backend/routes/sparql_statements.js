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

if(false) {
    (async() => {
        const { SparqlEndpointFetcher } = require("fetch-sparql-endpoint");
        const arrayifyStream = require('arrayify-stream');
        var fetcher = new SparqlEndpointFetcher();
        const endpoint = `https://dbpedia.org/sparql/`

        // Erste Versuche ...
        // sparql = SEARCH_PERSONS("Always", 2011)
        // sparql = SEARCH_PERSONS("Always", 1989)

        // "The Wachowskis"@en
        // Director ist aber vorhanden
        // Joe_Pantoliano
        // Birthplace doppelt ...
        // http://dbpedia.org/resource/The_Wachowskis
        // - dbo:director und dbp:director unterschiedlich belegt.
        // - Director: Sind mehrere Personen!
        // sparql = SEARCH_PERSONS("The Matrix")

        // Special Character '
        // sparql = SEARCH_PERSONS("You're Not You")

        // "Issue?" : The Last Sharknado
        // - https://dbpedia.org/page/The_Last_Sharknado:_It's_About_Time
        // Achtung! Ist vom Typ: 
        // - dbo:TelevisionShow
        // und nicht wie alle anderen:
        // - dbo:Film
        // sparql = SEARCH_PERSONS("The Last Sharknado: It's About Time")

        // Probleme mit BirthDates aus verschiedenen Ontologien
        // - https://stackoverflow.com/questions/49477387/how-to-gracefully-handle-dbpedia-queries-of-birthdate-in-different-ontologies
        // Probleme mit "schlecht" ausgefüllten Resourcen
        // Viele Felder sind nicht ausgefüllt bzw. existieren nicht
        // Oft werden Geburtstag / Ort nur im allgemeinen "Comment" erwähnt
        // Problem mit element["name"].value
        // element ist undefined
        // Setzen eines Defaultnamen mit
        // Bind Default (Resource)
        // Optional PersonenName der Resource auslesen
        // Bind von Default oder PersonenName
        // - https://stackoverflow.com/questions/40454268/how-can-get-default-return-values-for-a-sparql-query-when-counting
        // sparql = SEARCH_PERSONS("Under the Boardwalk: The Monopoly Story")

        // Film "Avatar" gibt es nicht.
        // Avatar braucht auch die Angabe des Jahres, alle Avatar-Filme heißen Avatar
        // sparql = SEARCH_PERSONS("Avatar", 2009)

        // Marvel <3
        // Suche nach: "Infinity War" im Frontend bringt:
        // - DisneyPlus:
        //   - Avengers: Infinity War
        // - Netflix:
        //   - Marvel Studios' Avengers: Infinity War
        // 
        // Dbpedia:
        // - Avengers: Infinity War
        //
        // http://dbpedia.org/resource/Russo_brothers
        // birthDate sind nicht immer vom Typ Date ...
        // dbp:birthDate
        // - 1970-02-03 (xsd:date)
        // - 1971-07-18 (xsd:date)
        // - Anthony Russo (en)
        // - Joseph Russo (en)
        // - Cleveland, Ohio, U.S. (en)
        //
        // Außerdem sind dbp:name und rdfs:label unterschiedlich geschrieben
        // Dadurch klappt DISTINCT natürlich nicht.
        // dbp:name
        // "Russo Brothers"@en
        // rdfs:label
        // "Russo brothers"@en
        //
        // https://dbpedia.org/page/Paul_Bettany
        // dbp:name
        // "Paul Bettany"@en
        // "Paul Bettany biography and credits"@en
        // rdfs:label
        // "Paul Bettany"@en
        //
        // Fazit:
        // Das ist alles suboptimal ...
        // - Beispiele beim Ergebnis von "Avengers: Infinity War"
        //   - rdf_person_name
        //     - "Chris Evans (actor)"@en
        //     - "Paul Bettany"@en
        //   - dbp_person_name
        //     - "Chris Evans"@en
        //     - "Paul Bettany biography and credits"@en
        sparql = SEARCH_PERSONS("Avengers: Infinity War", undefined, limit = 50)

        // Serien
        // Annahme, das Serien nach dem Namen "(TV_SHOW)" stehen haben.
        // - Scrubs (TV_SHOW)
        // sparql = SEARCH_PERSONS("Scrubs")
        // sparql = SEARCH_PERSONS("Lucifer")

        // # TODO:
        // - Priorisierung Birthplace
        //   Zuerst City, dann Settlement, dann erst Country verwenden
       

        
        console.log("###########################")
        result = await arrayifyStream(await fetcher.fetchBindings(endpoint, sparql))
        console.log("###########################")
        console.log(`Results found: ${result.length}`)

        result.forEach(element => {
            for (const [key, value] of Object.entries(element)) {
                console.log(`> ${key}: ${value.value}`)    
            };

            console.log("-----")
        });  
    })()
}

module.exports = {
    SELECT_ALL_TITLES: SELECT_ALL_TITLES,
    SEARCH_MOVIE: SEARCH_MOVIE,
    SEARCH_PERSONS: SEARCH_PERSONS
}