console.log("Chai aur code")

// to run file
// ls
// node filename

// to ren from package.json we create script command in package.json
// help when we run in server

// import express from "express"

// install dotenv

require('dotenv').config()

const express = require('express')
const app = express()
const port = 3500  // it is just port 

// / --> home route --> call back

app.get('/', (req, res) => {  
  res.send('Hello World!')
})

app.get('/twitter' , (req , res) =>
{
    res.send('ushadotcom')
})

app.get('/login' , (req , res)=>{
    res.send('<h2>Welcome to login page</h2>')
})

app.get('/youtube' , (req,res)=>{
    res.send("<h2>Youtube</h2>")
})

app.listen(process.env.PORT, () => {  // listen successfully
  console.log(`Example app listening on port ${port}`)

  // continue listening on both '/' and 'twitter'
 })

//   check by going to localhost:3500 and localhost:3500/twitter