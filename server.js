"use strict";
const express = require('express');
const cors = require('cors');
const axios = require("axios");
const pg = require('pg');

require("dotenv").config();

const data = require("./Movie Data/data.json");

const app = express();
app.use(cors());
app.use(express.json()); // parse the body from req

const DB_URL = process.env.DATABASE_URL;
const client = new pg.Client(DB_URL);

client.connect().then(()=>{

    app.listen(3000 , ()=>{
    console.log("Running at 3000 Port");
        });
});



app.get("/" , handleHome);
app.get("/favorite" , handleFavorite);

function handleHome(req , res){
  const dataJson = {
      "title" : data.title,
      "poster_path" : data.poster_path,
      "overview" : data.overview};
      res.send(dataJson);
    }

function handleFavorite(req ,res){
    res.send("Welcome to Favorite Page");
}


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

//https://api.themoviedb.org/3/search/movie?api_key=668baa4bb128a32b82fe0c15b21dd699&language=en-US&query=The&page=2

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

//https://api.themoviedb.org/3/movie/550/recommendations?api_key=c1af319ddec837daad4a88728e24a468
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

app.get("/getMovies" , (req , res)=>{
  let sql = `select * from movie`;
  client.query(sql).then((movData)=>{
    res.status(200).send(movData.rows);
  });
});

app.post("/addMovie" , (req , res)=>{

  let title = req.body.title;
  let release_date = req.body.release_date;
  let poster_path = req.body.poster_path;
  let overview = req.body.overview; 

  let sql = `insert into movie(title,release_dat,poster_path,overview) values($1,$2,$3,$4)`;
  client.query(sql,[title,release_date,poster_path,overview]).then(()=>{
    res.status(201).send(`movie ${title} added`);
  })
});

app.use(handleNotFound);

function handleNotFound(req , res , next) {
  res.status(404).send(
  {
    status: 404,
    responseText: "Page not found"
  });
}

// Handle server error (status 500)
app.use(handleError);

function handleError(err, req, res, next) {
    res.status(500).send(
    {
      status: 500,
      responseText: "Sorry, something went wrong",
      error: err
    }); 
}