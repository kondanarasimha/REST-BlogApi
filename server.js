import express from 'express';
import bodyParser from 'body-parser';
import { router } from './routes/authencation-routes.js';
import { dataRouter } from './routes/data-routes.js';
import session from "express-session";
import passport from 'passport';


const app = express();
const port = 3000 || process.env.PORT;

app.use(
  session({
    secret: process.env.SESSION_SECRETS,
    resave: false,
    saveUninitialized: true, 
  })
);

app.use(passport.initialize());
app.use(passport.session());


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static('public'));
app.set('view engine', 'ejs');

app.use('/',router);
app.use('/',dataRouter);


app.listen(port,()=> {console.log("server is runing  on port",port)});
