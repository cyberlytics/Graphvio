const router = require('express').Router();
const url = require('url');
const axios = require('axios');

router.route('/').get((req, res) => {
  res.json("Default Route")
})

router.route('/search-rating').get(async(req, res) => {
  const reqUrl = url.parse(req.url, true)
  title = reqUrl.query.title;
  type = reqUrl.query.type || "none";

  let searchType = "";
  switch(type){
    case "Movie":
      searchType = "SearchMovie";
    case "TV Show":
      searchType = "SearchSeries";
    case "none":
      searchType = "SearchTitle";
  }

  /* GET IMDB-ID of Movie/Series */
  axios.get(`https://imdb-api.com/en/API/${searchType}/k_xog7cg14/${encodeURIComponent(title)}`)
  .then(function (response){
    /* Response of ID-Request */
    console.log("IMDB ID Search Response:")
    console.log(response.data)

    /* Get IMDB-Rating for first entry of response via IMDB-ID */
    axios.get(`https://imdb-api.com/en/API/Ratings/k_xog7cg14/${response.data.results[0].id}`)
    .then(function(response){
      /* Response of Rating-Request */
      console.log("IMDB Rating Search Response:")
      console.log(response.data)
      res.json(response.data);
    }).catch(function (error){
      /* Error-Handling for Rating-Request */
      console.log("Error on IMDB-Rating Request")
      console.log(error)
    })
  }).catch(function (error){
    /* Error-Handling for ID-Request */
    console.log("Error on IMDB-ID Request")
    console.log(error);
  }); 
})

module.exports = {
  router: router
}