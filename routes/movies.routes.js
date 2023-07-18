'use strict';
const express = require("express");
const client = require("../client");
const Router = express.Router();

Router.get("/getMovies" , (req , res , next)=>{
  try {
    let sql = `select * from movie`;
    client.query(sql).then((movData)=>{
      res.status(200).send(movData.rows);
    });
  } catch (e) {
    next(`Error From getMovies : ${e}`);    
  }
    });
  
Router.post("/addMovie" , (req , res, next)=>{
  try {
    let title = req.body.title;
    let release_date = req.body.release_date;
    let poster_path = req.body.poster_path;
    let overview = req.body.overview;
    let comment = req.body.comment; 
  
    let sql = `insert into movie(title,release_date,poster_path,overview,comment) values($1,$2,$3,$4,$5)`;
    client.query(sql,[title,release_date,poster_path,overview,comment]).then(()=>{
      res.status(201).send(`movie ${title} added`);
    }) 
  } catch (error) {
    next(`Error From addMovie : ${e}`);  
  }
  });
    
Router.delete("/DELETE/:id" , (req , res, next)=>{
  try {
    let {id} = req.params;
    let sql = `delete from movie where id=${id}`;
    client.query(sql).then(()=>{
    res.status(200).send("deleted successfully");
    }) 
  } catch (error) {
    next(`Error From DELETE/:id : ${e}`);  
  }
  });
  
Router.get("/getMovie/:id" , (req , res, next)=>{
  try {
    let {id} = req.params;
    let sql = `select * from movie where id=${id}`;
    client.query(sql).then((movieData)=>{
    res.status(200).send(movieData.rows);
    })
  } catch (error) {
    next(`Error From getMovie:/id : ${e}`);  
  }  
  });
  
Router.put("/UPDATE/:id" , (req , res, next)=>{
  try {
      let {id} = req.params;
      let {title,release_date,poster_path,overview,comment}=req.body;
      let sql = `UPDATE movie SET title=$1,release_date=$2,poster_path=$3,overview=$4,comment=$5 where id=${id}`; 
      client.query(sql , [title,release_date,poster_path,overview,comment]).then(()=>{
      res.status(200).send("updated successfully");
  }) 
  } catch (error) {
    next(`Error From UPDATE/:id : ${e}`);
  }
  });

  module.exports = Router;
