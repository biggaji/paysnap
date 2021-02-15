// load enviroment variables
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const app = express();
const cookieParser = require("cookie-parser");

// application middlewares
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());
app.use(cookieParser());

// sample data

// const crypto_coins = [
//     {
//         name: "Bitcoin",
//         abbr: "BTC"
//     },
//     {
//         name: "Etherum",
//         abbr: "ETH"
//     },
//     {
//         name: "Litecoin",
//         abbr: "LTC"
//     },
//     {
//         name: "Dogecoin",
//         abbr: "DOGE"
//     },
//     {
//         name: "Bitcoin Cash",
//         abbr: "BTCASH"
//     }
// ];


// // get all coins

// app.get('/', (req, res) => {
//     res.send(crypto_coins);
// });

// // get a coin by abbr
// app.get('/:abbr', async (req, res) => {
//     const { abbr } = req.params;

//     // res.send(coin);
// });

// // create a coin
// app.post('/create_coin', (req, res) => {
//     const { name, abbr } = req.body;
//     res.json({
//         "message": "Coins created successfully",
//         "status": "success",
//         "name": name,
//         "abbr": abbr
//     });
// })

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => console.log('Server running on port ' + PORT));

module.exports = app;