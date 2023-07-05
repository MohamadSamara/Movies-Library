"use strict";
const express = require('express');
const cors = require('cors');
const axios = require("axios");
require("dotenv").config();
const moviesRoute = require("./routes/movies.routes");
const generalRoute = require("./routes/general.routes");
const handleErrorServer = require("./error_handlers/500");
const handleErrorNotFound = require("./error_handlers/404");
const client = require("./client");
const {PORT} = require("./config");

const app = express();
app.use(cors());
app.use(express.json()); // parse the body from req

app.use(generalRoute);
app.use(moviesRoute);

app.get("/trending", async (req, res) => {
  let axiosResponse = await axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.SECRET_API}&language=en-US`);
  let myData = axiosResponse.data.results.map((result) => ({
    "id": result.id,
    "title": result.title || result.name,
    "release_date": result.release_date || result.first_air_date,
    "poster_path": result.poster_path,
    "overview": result.overview
  }));
res.send(myData);
});

app.get("/search", async (req, res) => {
  let movieName  = req.query.query; 
  let axiosResponse = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.SECRET_API}&language=en-US&query=${movieName}&page=2`);
  let allmovie = axiosResponse.data.results;
  let movies = allmovie.map((result) => ({
    "id": result.id,
    "title": result.title,
    "release_date": result.release_date,
    "poster_path": result.poster_path,
    "overview": result.overview
  }));
  res.send(movies);
});

app.get("/recommendations", async (req, res) => {
  let axiosResponse = await axios.get(`https://api.themoviedb.org/3/movie/550/recommendations?api_key=${process.env.SECRET_API}`);
  let myData = axiosResponse.data.results.map((result) => ({
    "id": result.id,
    "title": result.title || result.name,
    "release_date": result.release_date || result.first_air_date,
    "poster_path": result.poster_path,
    "overview": result.overview
  }));
res.send(myData);
});

//https://api.themoviedb.org/3/discover/movie?api_key=37ddc7081e348bf246a42f3be2b3dfd0&include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_average.desc&without_genres=99,10755&vote_count.gte=200

app.get("/topRated", async (req, res) => {
  let axiosResponse = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${process.env.SECRET_API}&include_adult=false&include_video=false&language=en-US&page=1&sort_by=vote_average.desc&without_genres=99,10755&vote_count.gte=200`);
  let myData = axiosResponse.data.results.map((result) => ({
    "id": result.id,
    "title": result.title || result.name,
    "release_date": result.release_date || result.first_air_date,
    "poster_path": result.poster_path,
    "overview": result.overview
  }));
res.send(myData);
});

app.use(handleErrorServer);
app.use(handleErrorNotFound);

client.connect().then(()=>{
  app.listen(PORT , ()=>{
  console.log(`Running at ${PORT} Port`);
      });
});
