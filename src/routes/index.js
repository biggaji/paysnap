const router = require("express").Router();
const { indexControl } = require("../controllers");

router.get('/', indexControl);

module.exports = router;