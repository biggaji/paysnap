import express, {Request, Response, NextFunction, Application } from 'express';
import exphbs from 'express-handlebars';
import path from 'path';
import cors from  'cors';
import cookieParser from 'cookie-parser';
import indexRouter from './src/routes/index';
import authRouter from './src/routes/auths';
import transactionRouter from './src/routes/transactions';

const app:Application = express();

app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(cookieParser());
app.use(cors());

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


let PORT:(string|number) = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});