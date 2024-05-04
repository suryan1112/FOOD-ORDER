import express from "express";
import cookieParser from "cookie-parser";
import { urlencoded } from "express";
import router from './routes/user.js'
import router2 from './routes/home.js'
import session from 'express-session'
import path from 'path'
import flash from 'connect-flash'
import nodeSassMiddleware from "node-sass-middleware";
import { createServer } from 'http'

// import passport from "passport";
// import passportGoogle from 'passport-google-oauth'

const app = express()
const server = createServer(app)

// app.use(nodeSassMiddleware({
//     src:'./public/sass/',
//     dest:'./public/styles',
//     debug:true,
//     outputStyle:'expanded',
//     prefix:'/styles'
// }))
app.use(express.static(path.join(path.resolve(),'public')))
app.use(express.static(path.join(path.resolve(),'uploads')))
app.use(urlencoded())
app.use(express.json())
app.set('view engine', 'ejs')
app.use(cookieParser())

app.use(session({secret:'secret'},{cookie:{maxAge:6000}}))
app.use(flash());

app.use('/user',router)
app.use('/',router2)

export default server;