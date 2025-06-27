const express = require('express');
const dbConnect = require('./config/dbConnect');
const dotenv  = require('dotenv').config();
const app = express();


//middleware;
app.use(express.json());


//routes


//start the server
const PORT = process.env.PORT || 7002;
app.listen(PORT,()=>{
  console.log(`app running on ${PORT}`)
})

dbConnect();