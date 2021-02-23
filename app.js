// load enviroment variables
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const hbs = require("express-handlebars");
const path = require("path");
const indexRouter = require("./src/routes/index");
const authRouter = require("./src/routes/auths");
const { ApolloServer } = require("apollo-server-express");
const { typeDefs } = require("./graphql/typedefs/paytr_schema");
const { resolvers } = require("./graphql/resolvers/paytr_resolver");
const flash = require("connect-flash");
const session = require("express-session");


/**
 * Apollo server configs
 */

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req, res }) => {
        req,
            res
    }
});


const app = express();


server.applyMiddleware({ app });
// application middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(session({
    name: "sid",
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(flash());


// set up static file directory
app.use(express.static(path.join(__dirname, "public")));

// setup template engine
app.engine("handlebars", hbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");
app.set("views", path.join(__dirname, "views"));

// app routers
app.use('/', indexRouter);
app.use("/", authRouter);

// 404 page error handler

app.use((req, res, next) => {
    res.render('404', { pageTitle: "Page Not Found" });
})

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log('Server running on port ' + PORT + " ", server.graphqlPath));

module.exports = app;