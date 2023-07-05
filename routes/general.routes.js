'use strict';
const express = require("express");
const Router = express.Router();
const data = require("../Movie Data/data.json");

Router.get("/" , handleHome);
Router.get("/favorite" , handleFavorite);

function handleHome(req , res , next){
 try {
  const dataJson = {
    "title" : data.title,
    "poster_path" : data.poster_path,
    "overview" : data.overview};
    res.send(dataJson);
 } catch (e) {
  next(`handleHome Error : ${e}`);
 }
    }

function handleFavorite(req ,res , next){
    try {
      res.send("Welcome to Favorite Page");
    } catch (e) {
      next(`handleFavorite Error : ${e}`);
    }
}

module.exports = Router;