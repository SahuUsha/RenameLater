import express from "express"
import cors from "cors"
import cookieParser from "cookie-parser"



const app = express()


app.use(cors({
    origin : process.env.CORS_ORIGIN,
    credentials : true
}))


app.use(express.json({limit : "20kb"}))  // it is accepting data when it is taken from form

// for data com from express'
app.use(express.urlencoded({extended: true, limit: "16kb"}))  
// through extended we use for  object in side object

app.use(express.static("public"))
// it is use for keep file,image to me any any can access it 
app.use(cookieParser())

// routes import
import userRouter from './routes/user.router.js' 
import videoRouter from './routes/video.router.js'
import playlistRouter from './routes/playlist.router.js'
import commentRouter from './routes/comments.router.js'
import tweetRouter from './routes/tweets.router.js'
import likeRouter from './routes/like.router.js'


// routes declaration
// app.use("/users", userRouter)  // when any oner reach to /user then controll wil =l go to userRouter file

app.use("/api/v1/users", userRouter)  // if we are defining Api we need to tell version of apu so we use it -> standar practice



// url will create in this way
// https://localhost:8000/users
// https://localhost:8000/api/v1/users/register
app.use("/api/v1/videos",videoRouter)
app.use("/api/v1/playlists",playlistRouter)
app.use("/api/v1/comments" , commentRouter)
app.use("/api/v1/tweets",tweetRouter)
app.use("/api/v1/likes",likeRouter)


export default app;