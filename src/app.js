import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"



const app = express()


app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))


app.use(express.json({limit : "16kb"}))  // it is accepting data when it is taken from form

// for data com from express'
app.use(express.urlencoded({extended: true, limit: "16kb"}))  
// through extended we use for  object in side object

app.use(express.static("public"))
// it is use for keep file,image to me any any can access it 

app.use(cookieParser())

export { app }