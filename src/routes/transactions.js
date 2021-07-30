"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = express_1.Router();
router.get("/", (req, res) => {
    res.json({
        message: "Welcome to the fastest and easiest payment platform in the world",
        Path: "/transaction"
    });
});
exports.default = router;
