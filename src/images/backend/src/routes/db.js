const { SparqlEndpointFetcher } = require("fetch-sparql-endpoint");
const arrayifyStream = require('arrayify-stream');
const router = require('express').Router()
const url = require('url')
const SPARQL_STATEMENTS = require('./sparql_statements')

const endpoint_local = `http://${process.env.DATABASE_URI || "localhost"}:${process.env.DATABASE_PORT || "8890"}/sparql`
const endpoint_dbpedia = `https://dbpedia.org/sparql/`

var fetcher = new SparqlEndpointFetcher();

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
 * http://localhost:5000/db/search-movies?provider=disney_plus
 * - Sucht nur in der jeweiligen Provider-Datenbank
 * - Standard: netflix|disney_plus|amazon_prime|hulu
 * - Möglich: Beliebige Kombination der Provider, getrennt mit |
 *   - disney_plus
 *   - disney_plus|hulu
 *   - netflix|disney|amazon_prime|hulu
 * 
 * http://localhost:5000/db/search-movies?limit=1
 * - Anzahl der Einträge, die maximal zurückgegeben werden.
 * - Standard: 10
 * 
 * Beispiel:
 * - http://localhost:5000/db/search-movies?title=shark&provider=netflix|disney_plus|amazon_prime
 *   - Sucht in den Datenbanken von Netflix, Disney und Prime nach
 *     einem Eintrag, der "shark" enthält.
 * 
 * @returns Liste der Filme als JSON
 * 
 * Beispiel:
 * URL: http://localhost:5000/db/search-movies
 * 
 * [
 *   {
 *     "title": "Take Care Good Night",
 *     "provider": "amazon_prime",
 *     "metadata": {
 *       "cast": "Mahesh Manjrekar, Abhay Mahajan, Sachin Khedekar",
 *       "country": "India",
 *       "date_added": "March 30, 2021",
 *       "description": "A Metro Family decides to fight a Cyber Criminal threatening their stability and pride.",
 *       "director": "Girish Joshi",
 *       "duration": "110 min",
 *       "release_year": "2018",
 *       "type": "Movie",
 *       "rating": "13+",
 *       "genre": "Drama, International"
 *     }
 *   },
 *   ...
 */

async function searchMovies(req, res){
  const reqUrl = url.parse(req.url, true)
  movie = reqUrl.query.title || "";
  provider = reqUrl.query.provider?.toLocaleLowerCase() || undefined;
  limit = reqUrl.query.limit || undefined;

  sparql = SPARQL_STATEMENTS.SEARCH_MOVIE(movie, provider, limit)
  console.log(sparql)
  
  result = await arrayifyStream(await fetcher.fetchBindings(endpoint_local, sparql))
  console.log(`Results found: ${result.length}`)

  movies = []

  result.forEach(element => {
    movies.push({
      "title": element.title.value,
      "provider": element.id.value.match("/movies/(.*)_titles_csv")[1], // Provider, der den Film zur Verfügung stellt
      "metadata": {
        "cast": element.cast?.value,
        "country": element.country?.value,
        "date_added": element.date_added?.value,
        "description": element.description?.value,
        "director": element.director?.value,
        "duration": element.duration?.value,
        "release_year": element.release_year?.value,
        "type": element.type?.value, // "Movie" | "TV Show"
        "rating": element.rating?.value,
        "genre": element.listed_in?.value
      }
    })
  });

  res.json(movies) 
}

/**
 * Rückgabe der Filmmitwirkenden zu einem Film
 * 
 * http://localhost:5000/db/search-persons?title=Lucifer
 * - Liefert eine Liste der Filmmitwirkenden zurück
 * 
 * http://localhost:5000/db/search-persons?title=Always&year=2011
 * - Liefert eine Liste der Filmmitwirkenden zurück
 * - Das Jahr sollte immer angegeben werden, um DBpedia bei
 *   der Suche nach einem bestimmten Film zu unterstützen.
 *   Gibt es sowieso nur einen Film, wird das Jahr bei der Suche
 *   verworfen.
 *   Gibt es aber mehrere Einträge bei DBpedia und es wurde kein
 *   Jahr angegeben, kann nicht darauf zugegriffen werden.
 *   Es werden dann keine Personen ausgegeben.
 * 
 *   Beispiel:
 *   - Always, 2011
 *   - Always, 1989
 * 
 *   http://localhost:5000/db/search-persons?title=Always
 *   - Keine Personen
 *   http://localhost:5000/db/search-persons?title=Always&year=2011
 *   - Always, 2011
 *   - Film: http://dbpedia.org/resource/Always_(2011_film)
 *   http://localhost:5000/db/search-persons?title=Always&year=1989
 *   - Always, 1989
 *   - Film: http://dbpedia.org/resource/Always_(1989_film)
 * 
 * http://localhost:5000/db/search-persons?title=Avengers: Infinity War&limit=50
 * - Anzahl der Einträge, die maximal zurückgegeben werden.
 * - Standard: 10
 * 
 * @returns Liste der Filmmitwirkenden als JSON
 * 
 * Beispiel:
 * URL: http://localhost:5000/db/search-persons?title=Always&year=2011
 * 
 *  {
 *    "request": {
 *      "title": "Always",
 *      "year": "2011"
 *    },
 *    "response": {
 *      "film": "http://dbpedia.org/resource/Always_(2011_film)",
 *      "persons": [
 *        {
 *          "name": "Bang Jun-seok",
 *          "role": "music",
 *          "birthDate": "1970-08-01",
 *          "birthPlace": "South Korea",
 *          "advanced": {
 *            "title_entity": "http://dbpedia.org/resource/Always_(2011_film)",
 *            "person_entity": "http://dbpedia.org/resource/Bang_Jun-seok",
 *            "person_rdf": "Bang Jun-seok",
 *            "person_dbp": "Bang Jun-seok",
 *            "birthPlaceEntities": "http://dbpedia.org/resource/South_Korea",
 *            "country_birthPlace": "South Korea"
 *          }
 *        },
 *        ...
 */
async function searchPersons(req, res){
  const reqUrl = url.parse(req.url, true)
  movie = reqUrl.query.title || "";
  year = reqUrl.query.year || undefined;
  limit = reqUrl.query.limit || undefined;

  sparql = SPARQL_STATEMENTS.SEARCH_PERSONS(movie, year, limit)
  console.log(sparql)
  
  result = await arrayifyStream(await fetcher.fetchBindings(endpoint_dbpedia, sparql))
  console.log(`Results found: ${result.length}`)

  persons = []

  result.forEach(element => {
    // Ungültige Personen filtern.
    if (typeof(element) === 'undefined'
      || typeof(element.name) === 'undefined'
      || typeof(element.role) === 'undefined') {
      return;
    }

    persons.push({
      "name": element.name.value,
      "role": element.role.value,
      "birthDate": element.birthDate?.value,
      "birthPlace": element.birthPlace?.value,
      "advanced": {
        "title_entity": element.film?.value,
        "person_entity": element.person?.value,
        "person_rdf": element.rdf_person_name?.value,
        "person_dbp": element.dbp_person_name?.value,
        "birthPlaceEntities": element.birthPlaceEntities?.value,
        "city_birthPlace": element.city_birthPlace?.value,
        "settlement_birthPlace": element.settlement_birthPlace?.value,
        "country_birthPlace": element.country_birthPlace?.value,
      }
    })
  });

  resultWrapper = {
    "request": {
      "title": movie,
      "year": year,
      "limit": limit,
    },
    "response": {
      "film": result[0]?.film.value || "",
      "persons": persons
    }
  }

  res.json(resultWrapper) 
}


/**
 * Rückgabe der gemeinsamen Merkmale von Filmen innerhalb der Datenbank
 * 
 * - Für jeden Film der verglichen werden soll muss ein "title=movietitle" als GET-Parameter geliefert werden
 * - Der Titel des Films muss exakt der Titel aus der Datenbank sein
 * 
 * http://localhost:5000/db/compare-movies?title=Marvel%20Studios%27%20Avengers:%20Infinity%20War&title=Marvel%20Studios%27%20Avengers:%20Age%20of%20Ultron&title=Marvel%20Studios%27%20Iron%20Man%202
 * - Vergleich der Merkmale der Filme:
 *      "Marvel Studios' Avengers: Infinity War",
 *      "Marvel Studios' Avengers: Age of Ultron",
 *      "Marvel Studios' Iron Man 2"
 * 
 * @returns Liste der Merkmale als JSON
 */
async function compareMovies(req, res){
  const reqUrl = url.parse(req.url, true)
  movies = reqUrl.query.title || [];

  result = []

  for(const i in movies){
    const sparql = SPARQL_STATEMENTS.SEARCH_EXACT_MOVIE(movies[i], undefined)
    console.log(sparql)
    let res = await arrayifyStream(await fetcher.fetchBindings(endpoint_local, sparql))

    result.push(res[0])
  }

  movies_data = []

  result.forEach(element => {
    movies_data.push({
      "title": element.title.value,
      "provider": element.id.value.match("/movies/(.*)_titles_csv")[1], // Provider, der den Film zur Verfügung stellt
      "metadata": {
        "cast": element.cast?.value,
        "country": element.country?.value,
        "date_added": element.date_added?.value,
        "description": element.description?.value,
        "director": element.director?.value,
        "duration": element.duration?.value,
        "release_year": element.release_year?.value,
        "type": element.type?.value, // "Movie" | "TV Show"
        "rating": element.rating?.value,
        "genre": element.listed_in?.value
      }
    })
  });

  result = compareMoviedata(movies_data);

  res.json(result) 
}

function compareMoviedata(movie_data){
  result = {
    cast: {},
    country: {},
    director: {},
    genre: {}
  }

  /* iterate over every movies */
  for (let current_movie_index = 0; current_movie_index < movie_data.length - 1; current_movie_index++) {
    /* iterate over every movie after the current one */
    for (let compare_with_index = current_movie_index + 1; compare_with_index < movie_data.length; compare_with_index++) {
      /* compare metadata */
      result = compare(movie_data[current_movie_index], movie_data[compare_with_index], result, "cast")
      result = compare(movie_data[current_movie_index], movie_data[compare_with_index], result, "country")
      result = compare(movie_data[current_movie_index], movie_data[compare_with_index], result, "director")
      result = compare(movie_data[current_movie_index], movie_data[compare_with_index], result, "genre")
    }
  }

  return result
}

function compare(input1, input2, result, key){
  /* dont compare if one input has no entries */
  if(input1.metadata[key] == undefined || input2.metadata[key] == undefined){
    return result;
  }

  /* split strings */
  current_movie = input1.metadata[key].split(", ");
  compare_with_movie = input2.metadata[key].split(", ");

  /* compare */
  compare_with_movie.forEach(element => {
    /* if element is in both movies */
    if(current_movie.includes(element)){
      /* if no entry for element exists add entry with both movie titles */
      if(result[key][element] == undefined){
        result[key][element] = [
          input1.title,
          input2.title
        ]
      }
      /* if entry for element exists append only input2's movietitle */
      else if(!result[key][element].includes(input2.title)){
        result[key][element].push(input2.title)
      }
    }
  });

  return result;
}

/* Routes */
router.route('/search-movies').get(async(req, res) => {
  searchMovies(req, res)
})

router.route('/search-persons').get(async(req, res) => {
  searchPersons(req, res)
})

router.route('/compare-movies').get(async(req, res) => {
  compareMovies(req, res);
})

router.route('/search-similar-movies').get(async(req, res) => {
  const reqUrl = url.parse(req.url, true)
  movies = reqUrl.query.title || [];

  // res.json(result)
})

module.exports = {
  router: router,
  tests: {
    searchMovies: searchMovies,
    searchPersons: searchPersons,
    compareMovies: compareMovies,
    compareMoviedata: compareMoviedata,
    compare: compare
  }
}

