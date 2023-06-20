"use strict";
const express = require('express');
const cors = require('cors');
const app = express();
app.use(cors());
const data = require("./Movie Data/data.json");

app.listen(3000 ,startingLog)
function startingLog(req , res){
    console.log("Running at 3000 Port");
}


app.get("/" , handleHome);
app.get("/favorite" , handleFavorite);
// app.get("*" , handleError);



function handleHome(req , res){
    const dataJson = {
        "title" : data.title,
        "poster_path" : data.poster_path,
        "overview" : data.overview
     };

        res.send(dataJson);
}

function handleFavorite(req ,res){
    res.send("Welcome to Favorite Page");
}


// Handle server error (status 500)
app.use(handleError);

function handleError(err, req, res, next) {
    res.status(500).send(
    {
      status: 500,
      responseText: "Sorry, something went wrong"
    }
        ); 
}


  app.use(handleNotFound);

  function handleNotFound(req, res) {
    res.status(404).send(
    {
      status: 404,
      responseText: "Page not found"
    }
            );
  }