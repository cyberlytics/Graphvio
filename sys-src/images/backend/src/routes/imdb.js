const router = require('express').Router();
const url = require('url');
const axios = require('axios');

/**
 * Rückgabe der Ratings aus der IMDB
 * @param {string} title - Titel des Films / der Serie möglichst genaue Angabe
 * @param {string} type  - Typ des Sucheintrags ("movie" oder "tv show")
 *                         alternativ wird "none" verwendet und in beidem gesucht
 * 
 * http://localhost:5000/imdb/search-imdbdata?title=The%20Matrix&type=Movie
 * - Suche nach dem Film "The Matrix"
 * 
 * @returns Liste verschiedenster Ratings die in der IMDB abgelegt sind
 * 
 * Beispiel-Responseobjekt: 
 * {
 *   "imDbId": "tt1436480",
 *   "title": "Undefined",
 *   "fullTitle": "Undefined (2006)",
 *   "type": "Movie",
 *   "year": "2006",
 *   "imDb": "6.7",
 *   "metacritic": "",
 *   "theMovieDb": "",
 *   "rottenTomatoes": "",
 *   "tV_com": "",
 *   "filmAffinity": "",
 *   "errorMessage": ""
 * }
 */
async function searchImdbdata(req, res) 
{
  const reqUrl = url.parse(req.url, true)

  if (reqUrl.query.title == undefined) {
    console.log("Error on reading title")
    res.json({});
    return
  }

  title = reqUrl.query.title;
  type = reqUrl.query.type || "none";

  let searchType = "";
  switch(type.toLowerCase()){
    case "movie":
      searchType = "SearchMovie";
      break;
    case "tv show":
      searchType = "SearchSeries";
      break;
    default:
      searchType = "SearchTitle";
  }

  /* GET IMDB-ID of Movie/Series */
  return axios.get(`https://imdb-api.com/en/API/${searchType}/k_xog7cg14/${encodeURIComponent(title)}`)
  .then(function (response){
    /* Response of ID-Request */
    console.log("IMDB ID Search Response:")
    console.log(response.data)

    if(response.data.errorMessage != ''){
      res.json(response.data);
      return
    }
    else if(response.data.results.length == 0){
      res.json({
        errorMessage: "Movie not found",
        results: []
      });
      return
    }
    else{
      if(response.data.results[0].image != undefined){
        var img = response.data.results[0].image;
      }

      /* Get IMDB-Rating for first entry of response via IMDB-ID */
      return axios.get(`https://imdb-api.com/en/API/Ratings/k_xog7cg14/${response.data.results[0].id}`)
      .then(function(response){
        /* Response of Rating-Request */
        console.log("IMDB Rating Search Response:")
        console.log(response.data)
  
        result = response.data;
        result.image = img;
  
        res.json(result);
      }).catch(function (error){
        /* Error-Handling for Rating-Request */
        console.log("Error on IMDB-Rating Request")
        console.log(error)
        res.json({});
      })
    }
  }).catch(function (error){
    /* Error-Handling for ID-Request */
    console.log("Error on IMDB-ID Request")
    console.log(error);
    res.json({});
  }); 
}

router.route('/search-imdbdata').get(async(req, res) => { 
  searchImdbdata(req, res)
})
  
module.exports = {
  router: router,
  tests: {
    searchImdbdata: searchImdbdata
  }
}