import { config } from 'dotenv';
if(process.env.NODE_ENV !== 'production') {
  config();
}
import express, {Request, Response, NextFunction, Application } from 'express';
import exphbs from 'express-handlebars';
import path from 'path';
import cors from  'cors';
import cookieParser from 'cookie-parser';
import indexRouter from './src/routes/index';
import authRouter from './src/routes/auths';
import transactionRouter from './src/routes/transactions';
import compression from 'compression';
import connectFlash from 'connect-flash';
import session from 'express-session';

const app:Application = express();
app.use(compression());

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(session({
  name: "sid",
  resave: false,
  saveUninitialized: false,
  secret: process.env.SESSION_SECRET!
}));
app.use(connectFlash());

app.use(express.static(path.join(__dirname, 'public')));


app.engine("hbs", exphbs({defaultLayout: "main"}));
app.set("view engine", "hbs");


app.use('/', indexRouter);
app.use("/", authRouter);
app.use("/", transactionRouter);


// 404 middleware
app.use((req, res, next) => {
  res.render("404", { pageTitle: "Page Not Found" });
});


let PORT:(string|number) = process.env.PORT! || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});