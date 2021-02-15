// load enviroment variables
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");
const hbs = require("express-handlebars");
const path = require("path");
const indexRouter = require("./src/routes/index");
// application middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// set up static file directory
app.use(express.static(path.join(__dirname, "public")));

// setup template engine
app.engine("handlebars", hbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// app routers
app.use('/', indexRouter);

// 404 page error handler

app.use((req, res, next) => {
    res.render('404', { pageTitle: "Page Not Found" });
})

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log('Server running on port ' + PORT));

module.exports = app;