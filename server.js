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

// app.use((req, res, next) => {
//   if (req.query.api_key) {
//     next();
//   } else {
//     next("Wrong authentication");
//   }
// });

// https://api.themoviedb.org/3/trending/all/week?api_key=c1af319ddec837daad4a88728e24a468&language=en-US


// function myDataa(){
//  const myData = axiosResponse.results.map((result) => ({
//     "id": result.id,
//     "title": result.title,
//     "release_date": result.release_date,
//     "poster_path": result.poster_path,
//     "overview": result.overview
//   }));
// }

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


// let axiosResponse = await axios.get(`https://api.themoviedb.org/3/trending/all/week?api_key=${process.env.SECRET_API}&language=en-US`);
// let myData = axiosResponse.data.results;

// let x = myData.map((result) => ({
//   "id": result.id,
//   "title": result.title || result.name, // Adjust for different types of media (movie, TV show, etc.)
//   "release_date": result.release_date || result.first_air_date, // Adjust for different types of media (movie, TV show, etc.)
//   "poster_path": result.poster_path,
//   "overview": result.overview
// }));

// res.send(x);


});

//https://api.themoviedb.org/3/search/movie?api_key=668baa4bb128a32b82fe0c15b21dd699&language=en-US&query=The&page=2

app.get("/search", async (req, res) => {
  // let axiosResponse = await axios.get(`https://api.themoviedb.org/3/search/movie?api_key=${process.env.SECRET_API}&language=en-US&query=The&page=2`);
  // res.send(axiosResponse.data);
  let movieName  = req.query.query; 
  // console.log(movieName);
  // console.log(req.query);
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

app.get("/getMovies" , (req , res)=>{
  let sql = `select * from movie`;
  client.query(sql).then((movData)=>{
    res.status(200).send(movData.rows);
  });


});

app.post("/addMovie" , (req , res)=>{

  let title = req.body.t;
  let release_date = req.body.r;
  let poster_path = req.body.p;
  let overview = req.body.o; 

  let sql = `insert into movie(title,release_dat,poster_path,overview) values($1,$2,$3,$4)`;
  client.query(sql,[title,release_date,poster_path,overview]).then(()=>{
    res.status(201).send(`movie ${title} added`);
  })

  // res.send(req.body);

});


app.delete("/DELETE/:id" , (req , res)=>{
  let {id} = req.params;
  let sql = `delete from movie where id=${id}`;
  client.query(sql).then(()=>{
  res.status(200).send("deleted successfully");
  })
});

app.get("/getMovie/:id" , (req , res)=>{
  let {id} = req.params;
  let sql = `select * from movie where id=${id}`;
  client.query(sql).then((movieData)=>{
  res.status(200).send(movieData.rows);
  })
});

app.put("/UPDATE/:id" , (req , res)=>{
  let {id} = req.params;
  let {title,release_date,poster_path,overview}=req.body;
  let sql = `UPDATE movie SET title=$1,release_dat=$2,poster_path=$3,overview=$4 where id=${id}`; 
  client.query(sql , [title,release_date,poster_path,overview]).then(()=>{
    res.status(200).send("updated successfully");
  }) 
})


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





//   const fetch = require('node-fetch');

// const url = 'https://api.themoviedb.org/3/configuration';
// const options = {
//   method: 'GET',
//   headers: {
//     accept: 'application/json',
//     Authorization: 'Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiJjMWFmMzE5ZGRlYzgzN2RhYWQ0YTg4NzI4ZTI0YTQ2OCIsInN1YiI6IjY0OTMxMzVmNzA2ZTU2MDEzYTY1M2RjZSIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.IqoVvF8jMqjkhspI-wz66OHsieej0QxPtxVjH_gog30'
//   }
// };

// fetch(url, options)
//   .then(res => res.json())
//   .then(json => console.log(json))
//   .catch(err => console.error('error:' + err));