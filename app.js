"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const express_handlebars_1 = __importDefault(require("express-handlebars"));
const path_1 = __importDefault(require("path"));
const cors_1 = __importDefault(require("cors"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const index_1 = __importDefault(require("./src/routes/index"));
const auths_1 = __importDefault(require("./src/routes/auths"));
const transactions_1 = __importDefault(require("./src/routes/transactions"));
const app = express_1.default();
app.use(express_1.default.urlencoded({ extended: false }));
app.use(express_1.default.json());
app.use(cookie_parser_1.default());
app.use(cors_1.default());
app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
app.engine("hbs", express_handlebars_1.default({ defaultLayout: "main" }));
app.set("view engine", "hbs");
app.use('/', index_1.default);
app.use("/", auths_1.default);
app.use("/", transactions_1.default);
// 404 middleware
app.use((req, res, next) => {
    res.render("404", { pageTitle: "Page Not Found" });
});
let PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
