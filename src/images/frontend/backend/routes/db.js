const { SparqlEndpointFetcher } = require("fetch-sparql-endpoint");
const arrayifyStream = require('arrayify-stream');
const router = require('express').Router()
const url = require('url')
const SPARQL_STATEMENTS = require('./sparql_statements')

const endpoint = `http://${process.env.DATABASE_URI}:${process.env.DATABASE_PORT}/sparql`

var fetcher = new SparqlEndpointFetcher();

router.route('/').get((req, res) => {
  res.json("Default Route")
})

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
 */
router.route('/search-movies').get(async(req, res) => {
  const reqUrl = url.parse(req.url, true)
  movie = reqUrl.query.title || "";
  provider = reqUrl.query.provider?.toLocaleLowerCase() || undefined;
  limit = reqUrl.query.limit || undefined;

  sparql = SPARQL_STATEMENTS.SEARCH_MOVIE(movie, provider, limit)
  console.log(sparql)
  
  result = await arrayifyStream(await fetcher.fetchBindings(endpoint, sparql))
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
})

/**
 * Debug
 */
router.route('/debug-sparqljs-endpoint').get(async(req, res) => {
  // https://github.com/rubensworks/fetch-sparql-endpoint.js/
  
  // const bindingsStream = await fetcher.fetchBindings('https://dbpedia.org/sparql', 'SELECT * WHERE { ?s ?p ?o } LIMIT 100');
  console.log(SPARQL_SELECT_ALL_TITLES)
  // const bindingsStream = await fetcher.fetchBindings('http://database:8890/sparql', SPARQL_SELECT_ALL_TITLES);

  const bindingsStream = await fetcher.fetchBindings(endpoint, SPARQL_SELECT_ALL_TITLES);

  result = await arrayifyStream(bindingsStream)

  movies = []

  result.forEach(element => {
    movies.push({
      "title": element.title.value,
      "director": element.director?.value,
    })
  });

  res.json(movies) 
})


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
router.route('/compare-movies').get(async(req, res) => {
  const reqUrl = url.parse(req.url, true)
  movies = reqUrl.query.title || [];

  result = []

  for(const i in movies){
    const sparql = SPARQL_STATEMENTS.SEARCH_EXACT_MOVIE(movies[i], undefined)
    let res = await arrayifyStream(await fetcher.fetchBindings(endpoint, sparql))

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

  result = compareMovies(movies_data);

  res.json(result) 
})

function compareMovies(movie_data){
  result = {
    cast: {},
    country: {},
    director: {},
    genre: {}
  }

  for (let current_movie_index = 0; current_movie_index < movie_data.length - 1; current_movie_index++) {
    /* setup cast of current movie */
    current_movie_cast = movie_data[current_movie_index].metadata.cast.split(", ")
    current_move_countries = movie_data[current_movie_index].metadata.country.split(", ")
    current_move_directors = movie_data[current_movie_index].metadata.director.split(", ")
    current_move_genres = movie_data[current_movie_index].metadata.genre.split(", ")

    for (let compare_with_index = current_movie_index + 1; compare_with_index < movie_data.length; compare_with_index++) {
      /* setup cast of movie to compare with */
      compare_with_cast = movie_data[compare_with_index].metadata.cast.split(", ")
      compare_with_countries = movie_data[compare_with_index].metadata.country.split(", ");
      compare_with_directors = movie_data[compare_with_index].metadata.director.split(", ");
      compare_with_genres = movie_data[compare_with_index].metadata.genre.split(", ");
      
      /* compare casts */
      compare_with_cast.forEach(castmember => {
        /* if actor is in both casts */
        if(current_movie_cast.includes(castmember)){
          /* if no entry for actor exists add entry with both movie titles */
          if(result.cast[castmember] == undefined){
            result.cast[castmember] = [
              movie_data[current_movie_index].title,
              movie_data[compare_with_index].title
            ]
          }
          /* if entry for actor exists append current movie title */
          else if(!result.cast[castmember].includes(movie_data[compare_with_index].title)){
            result.cast[castmember].push(movie_data[compare_with_index].title)
          }
        }
      });

      /* compare countries */
      compare_with_countries.forEach(country => {
        if(current_move_countries.includes(country)){
          if(result.country[country] == undefined){
            result.country[country] = [
              movie_data[current_movie_index].title,
              movie_data[compare_with_index].title
            ]
          }
          else if (!result.country[country].includes(movie_data[compare_with_index].title)){
            result.country[country].push(movie_data[compare_with_index].title)
          }
        }
      });

      /* compare directors */
      compare_with_directors.forEach(director => {
        if(current_move_directors.includes(director)){
          if(result.director[director] == undefined){
            result.director[director] = [
              movie_data[current_movie_index].title,
              movie_data[compare_with_index].title
            ]
          }
          else if (!result.director[director].includes(movie_data[compare_with_index].title)){
            result.director[director].push(movie_data[compare_with_index].title)
          }
        }
      });

      /* compare genre */
      compare_with_genres.forEach(genre => {
        if(current_move_genres.includes(genre)){
          if(result.genre[genre] == undefined){
            result.genre[genre] = [
              movie_data[current_movie_index].title,
              movie_data[compare_with_index].title
            ]
          }
          else if (!result.genre[genre].includes(movie_data[compare_with_index].title)){
            result.genre[genre].push(movie_data[compare_with_index].title)
          }
        }
      });
    }
  }

  return result
}

module.exports = {
  router: router
}