const express = require("express"); //imports express
const app = express(); //makes app
var expressHbs = require("express-handlebars");
require("dotenv").config(); // ensures .env is used in index.js
const DB = process.env.DB;
const scr = process.env.SCR;
const port = process.env.PORT;
const mongoose = require("mongoose");
const session = require("express-session");
const cookieParser = require("cookie-parser");




mongoose.set("strictQuery", true); //used this for depreciation warning

//connecting to database
mongoose
  .connect(DB, { useNewUrlParser: true })
  .then(() => console.log("Database connected"))
  .catch((err) => console.log(err));

app.use(cookieParser());
const oneMonth = 1000 * 60 * 60 * 24 * 30;
app.use(
  session({
    secret: scr,
    saveUninitialized: false,
    cookie: { maxAge: oneMonth, httpOnly: true },
    resave: false,
  })
);

const routes = require("./routes/routes.js"); //imports routes



const hbs = require("hbs"); //imports handlebars
hbs.registerPartials(__dirname + "/views/partials", (err) => {}); // registers partials for handlebars
app.set("view engine", "hbs"); //sets view engine to handlebars

hbs.handlebars.registerHelper("ifEquals", function (arg1, arg2, options) {
   return arg1 == arg2 ? options.fn(this) : options.inverse(this);
 });
 
app.use(express.json()); //sends data in form of json objects
app.use(express.urlencoded({ extended: false })); //body parser

app.use(express.static(__dirname + "/public")); //to include css files in hbs
app.use(express.static(__dirname));


app.use("/" , routes)

app.listen(port , () =>{
   console.log(port)
})